import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { CounselingSession } from './counseling-session.entity';

@Entity('ai_summaries')
export class AISummary {
    @PrimaryGeneratedColumn('uuid')
    summary_id: string;

    @Column('uuid')
    user_id: string;

    @ManyToOne(() => User, (user) => user.summaries)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'jsonb', default: [] })
    emotion_tags: string[];

    @Column({ type: 'text', nullable: true })
    dominant_emotion: string;

    @Column({ type: 'jsonb', default: [] })
    repeated_topics: string[];

    @Column({ type: 'boolean', default: false })
    risk_flag: boolean;

    @Column({ type: 'float', default: 0 })
    intensity_score: number;

    @CreateDateColumn()
    created_at: Date;

    @OneToOne(() => CounselingSession, (session) => session.summary)
    session: CounselingSession;
}
