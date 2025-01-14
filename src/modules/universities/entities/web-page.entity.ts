import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { University } from './university.entity';

@Entity('web_pages')
export class WebPage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => University, (university) => university.webPages)
  university: University;

  @Column({ unique: true })
  url: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}
