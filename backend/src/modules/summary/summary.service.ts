import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AISummary } from '../../database/entities';
import { AIService } from '../../services/ai/ai.service';
import { ChatService } from '../chat/chat.service';
import { WebexService } from '../webex/webex.service';
import { CreateSummaryDto, SummaryResponseDto } from './dto/summary.dto';

@Injectable()
export class SummaryService {
    constructor(
        @InjectRepository(AISummary)
        private summaryRepository: Repository<AISummary>,
        private readonly aiService: AIService,
        private readonly chatService: ChatService,
        private readonly webexService: WebexService,
    ) { }

    async createSummary(dto: CreateSummaryDto): Promise<SummaryResponseDto> {
        // Get session messages
        const messages = this.chatService.getSessionMessages(dto.session_id);

        if (messages.length === 0) {
            throw new NotFoundException('Session not found or empty');
        }

        // Generate AI summary using Gemini
        const emotionSummary = await this.aiService.generateEmotionSummary(messages);

        // Save to database
        const summary = this.summaryRepository.create({
            user_id: dto.user_id,
            emotion_tags: emotionSummary.emotion_tags,
            dominant_emotion: emotionSummary.dominant_emotion,
            repeated_topics: emotionSummary.repeated_topics,
            risk_flag: emotionSummary.risk_flag,
            intensity_score: emotionSummary.intensity_score,
        });

        const saved = await this.summaryRepository.save(summary);

        // Clear the session after summarizing (privacy)
        this.chatService.clearSession(dto.session_id);

        // If risk_flag is true, automatically create Webex counseling meeting
        let meeting_url: string | undefined;
        if (saved.risk_flag) {
            try {
                const meeting = await this.webexService.createCounselingMeeting(
                    dto.user_id,
                    saved.summary_id,
                    true  // isUrgent: 리스크 감지 시 긴급 상담
                );
                meeting_url = meeting.webLink;
            } catch (error) {
                console.error('Failed to create Webex meeting:', error);
            }
        }

        return {
            summary_id: saved.summary_id,
            emotion_tags: saved.emotion_tags,
            dominant_emotion: saved.dominant_emotion,
            repeated_topics: saved.repeated_topics,
            risk_flag: saved.risk_flag,
            intensity_score: saved.intensity_score,
            meeting_url, // Include meeting URL if risk detected
        };
    }

    async findOne(summaryId: string): Promise<AISummary | null> {
        return this.summaryRepository.findOne({
            where: { summary_id: summaryId },
        });
    }

    async findByUser(userId: string): Promise<AISummary[]> {
        return this.summaryRepository.find({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
        });
    }
}
