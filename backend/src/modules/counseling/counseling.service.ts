import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CounselingSession, SessionStatus } from '../../database/entities';
import { WebexService } from '../webex/webex.service';
import { CreateCounselingDto, CounselingResponseDto } from './dto/counseling.dto';

@Injectable()
export class CounselingService {
    constructor(
        @InjectRepository(CounselingSession)
        private sessionRepository: Repository<CounselingSession>,
        @Inject(forwardRef(() => WebexService))
        private webexService: WebexService,
    ) { }

    async createCounselingRequest(
        dto: CreateCounselingDto,
    ): Promise<CounselingResponseDto> {
        // Create Webex meeting
        const meeting = await this.webexService.createCounselingMeeting(
            dto.user_id,
            dto.summary_id,
        );

        // Save session to database
        const session = this.sessionRepository.create({
            user_id: dto.user_id,
            summary_id: dto.summary_id,
            webex_meeting_id: meeting.id,
            webex_meeting_url: meeting.webLink,
            status: SessionStatus.SCHEDULED,
        });

        const saved = await this.sessionRepository.save(session);

        return {
            session_id: saved.session_id,
            meeting_url: meeting.webLink,
            status: saved.status,
        };
    }

    async updateSessionStatus(
        webexMeetingId: string,
        status: 'in_progress' | 'completed',
    ): Promise<void> {
        const session = await this.sessionRepository.findOne({
            where: { webex_meeting_id: webexMeetingId },
        });

        if (session) {
            session.status =
                status === 'in_progress'
                    ? SessionStatus.IN_PROGRESS
                    : SessionStatus.COMPLETED;
            await this.sessionRepository.save(session);
        }
    }

    async findAll(): Promise<CounselingSession[]> {
        return this.sessionRepository.find({
            relations: ['user', 'summary'],
            order: { created_at: 'DESC' },
        });
    }

    async findOne(sessionId: string): Promise<CounselingSession | null> {
        return this.sessionRepository.findOne({
            where: { session_id: sessionId },
            relations: ['user', 'summary'],
        });
    }

    async findByUser(userId: string): Promise<CounselingSession[]> {
        return this.sessionRepository.find({
            where: { user_id: userId },
            relations: ['summary'],
            order: { created_at: 'DESC' },
        });
    }
}
