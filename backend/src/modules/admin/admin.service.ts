import { Injectable } from '@nestjs/common';
import { CounselingService } from '../counseling/counseling.service';

@Injectable()
export class AdminService {
    constructor(private readonly counselingService: CounselingService) { }

    async getAllSessions() {
        const sessions = await this.counselingService.findAll();

        return sessions.map((session) => ({
            session_id: session.session_id,
            user: session.user
                ? {
                    nickname: session.user.nickname,
                    region: session.user.region,
                }
                : null,
            summary: session.summary
                ? {
                    dominant_emotion: session.summary.dominant_emotion,
                    emotion_tags: session.summary.emotion_tags,
                    risk_flag: session.summary.risk_flag,
                    intensity_score: session.summary.intensity_score,
                }
                : null,
            status: session.status,
            meeting_url: session.webex_meeting_url,
            created_at: session.created_at,
        }));
    }
}
