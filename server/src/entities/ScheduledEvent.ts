import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Epg } from './Epg';
import { Media } from './Media';

@Entity()
export class ScheduledEvent {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  startTime!: Date;

  @Column({
    nullable: true,
  })
  duration!: number;

  @ManyToOne(() => Media, (media) => media.scheduledEvents, {
    nullable: true,
  })
  media!: Relation<Media>;

  @ManyToOne(() => Epg, (epg) => epg.scheduledEvents, {
    nullable: true,
  })
  epg!: Relation<Epg>;
}
