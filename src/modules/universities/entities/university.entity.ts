import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Domain } from './domain.entity';
import { WebPage } from './web-page.entity';

@Entity('universities')
export class University {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 150, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 2 })
  alphaTwoCode: string;

  @Column({ type: 'varchar', length: 100 })
  country: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  stateProvince: string;

  @OneToMany(() => Domain, (domain) => domain.university, {
    cascade: true,
  })
  domains: Domain[];

  @OneToMany(() => WebPage, (webPage) => webPage.university, {
    cascade: true,
  })
  webPages: WebPage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}
