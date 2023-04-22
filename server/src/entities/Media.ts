import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ScheduledEvent } from './ScheduledEvent';

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    nullable: false,
  })
  name!: string;

  @Column({
    nullable: false,
  })
  filename!: string;

  @Column({
    nullable: false,
  })
  length!: number;

  @OneToMany(() => ScheduledEvent, (scheduledEvent) => scheduledEvent.media)
  scheduledEvents!: ScheduledEvent[];
}
