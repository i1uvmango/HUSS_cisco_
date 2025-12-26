import { IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateSummaryDto {
    @IsUUID()
    user_id: string;

    @IsString()
    session_id: string;
}

export class SummaryResponseDto {
    summary_id: string;
    emotion_tags: string[];
    dominant_emotion: string;
    repeated_topics: string[];
    risk_flag: boolean;
    intensity_score: number;
}
