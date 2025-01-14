import { HttpService } from "@nestjs/axios";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { firstValueFrom } from "rxjs";
import { Repository } from "typeorm";
import { BASE_API_URL } from "../../constants";
import { ResponseMessage } from "../../enums/response-message.enum";
import { MessageResponse, UniversityData } from "../../types";
import { Domain } from "./entities/domain.entity";
import { University } from "./entities/university.entity";
import { WebPage } from "./entities/web-page.entity";

@Injectable()
export class UniversityService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(University)
    private readonly universityRepository: Repository<University>,
    @InjectRepository(Domain)
    private readonly domainRepository: Repository<Domain>,
    @InjectRepository(WebPage)
    private readonly webPageRepository: Repository<WebPage>
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: "UTC" })
  async fetchData(): Promise<MessageResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${BASE_API_URL}/search`, {
          params: {
            country: "United States",
          },
        })
      );

      const universities: University[] = response?.data?.map(
        (university: UniversityData) => ({
          name: university.name,
          alphaTwoCode: university.alpha_two_code,
          country: university.country,
          stateProvince: university["state-province"],
          domains: university.domains?.map((domain) => ({ domain })),
          webPages: university.web_pages?.map((url) => ({ url })),
        })
      );

      await this.universityRepository
        .createQueryBuilder()
        .insert()
        .values(
          universities.map((uni) => ({
            name: uni.name,
            alphaTwoCode: uni.alphaTwoCode,
            country: uni.country,
            stateProvince: uni.stateProvince,
          }))
        )
        .orIgnore()
        .execute();

      const universityNames: string[] = universities.map((u) => u.name);
      const savedUniversities = await this.universityRepository
        .createQueryBuilder("university")
        .where("university.name IN (:...names)", { names: universityNames })
        .getMany();

      const universityMap = new Map(
        savedUniversities.map((u) => [u.name, u.id])
      );

      const domainValues: {
        domain: string;
        university: { id: number };
      }[] = universities
        .flatMap((uni) =>
          uni.domains.map((d) => ({
            domain: d.domain,
            university: { id: universityMap.get(uni.name) },
          }))
        )
        .filter((d) => d.university.id);
      const webPageValues: {
        url: string;
        university: { id: number };
      }[] = universities
        .flatMap((uni) =>
          uni.webPages.map((w) => ({
            url: w.url,
            university: { id: universityMap.get(uni.name) },
          }))
        )
        .filter((w) => w.university.id);

      if (domainValues.length > 0) {
        await this.domainRepository
          .createQueryBuilder()
          .insert()
          .values(domainValues)
          .updateEntity(false)
          .orIgnore()
          .execute();
      }

      if (webPageValues.length > 0) {
        await this.webPageRepository
          .createQueryBuilder()
          .insert()
          .values(webPageValues)
          .updateEntity(false)
          .orIgnore()
          .execute();
      }

      return { message: ResponseMessage.DATA_FETCHED_AND_SAVED };
    } catch (error) {
      throw new BadRequestException({ message: error?.message });
    }
  }

  async transformData(): Promise<string> {
    try {
      const universities = await this.universityRepository
        .createQueryBuilder("university")
        .leftJoinAndSelect("university.domains", "domains")
        .leftJoinAndSelect("university.webPages", "webPages")
        .getMany();

      const headers: string = [
        "name",
        "domains",
        "web_pages",
        "alpha_two_code",
        "country",
        "state-province",
      ].join(",");

      const csvRows = universities.map((university) =>
        [
          `"${university.name}"`,
          `"${university.domains.map((d) => d.domain).join(", ")}"`,
          `"${university.webPages.map((w) => w.url).join(", ")}"`,
          `"${university.alphaTwoCode}"`,
          `"${university.country}"`,
          `"${university.stateProvince || ""}"`,
        ].join(",")
      );

      const csvString: string = [headers, ...csvRows].join("\n");
      return csvString;
    } catch (error) {
      throw new BadRequestException({ message: error?.message });
    }
  }
}
