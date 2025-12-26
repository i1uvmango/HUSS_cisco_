import { IsUUID } from 'class-validator';

export class CreateCounselingDto {
    @IsUUID()
    user_id: string;

    @IsUUID()
    summary_id: string;
}

export class CounselingResponseDto {
    session_id: string;
    meeting_url: string;
    status: string;
}
