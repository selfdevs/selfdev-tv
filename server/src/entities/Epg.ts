import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { ScheduledEvent } from "./ScheduledEvent";

@Entity()
export class Epg {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  title: string;

  @Column({
    nullable: false,
  })
  description: string;

  @OneToMany(() => ScheduledEvent, (scheduledEvent) => scheduledEvent.epg)
  scheduledEvents: Relation<ScheduledEvent[]>;
}
