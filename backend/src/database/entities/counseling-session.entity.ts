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
import { AISummary } from './ai-summary.entity';

export enum SessionStatus {
    SCHEDULED = 'scheduled',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

@Entity('counseling_sessions')
export class CounselingSession {
    @PrimaryGeneratedColumn('uuid')
    session_id: string;

    @Column('uuid')
    user_id: string;

    @ManyToOne(() => User, (user) => user.sessions)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column('uuid', { nullable: true })
    summary_id: string;

    @OneToOne(() => AISummary, (summary) => summary.session)
    @JoinColumn({ name: 'summary_id' })
    summary: AISummary;

    @Column({ type: 'text', nullable: true })
    webex_meeting_id: string;

    @Column({ type: 'text', nullable: true })
    webex_meeting_url: string;

    @Column({
        type: 'enum',
        enum: SessionStatus,
        default: SessionStatus.SCHEDULED,
    })
    status: SessionStatus;

    @CreateDateColumn()
    created_at: Date;
}
