import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { AISummary } from './ai-summary.entity';
import { CounselingSession } from './counseling-session.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ type: 'varchar', length: 100 })
  nickname: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  region: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => AISummary, (summary) => summary.user)
  summaries: AISummary[];

  @OneToMany(() => CounselingSession, (session) => session.user)
  sessions: CounselingSession[];
}
