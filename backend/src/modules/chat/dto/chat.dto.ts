import { IsString, IsUUID, IsOptional } from 'class-validator';

export class ChatMessageDto {
    @IsUUID()
    @IsOptional()
    user_id?: string;

    @IsString()
    @IsOptional()
    session_id?: string;

    @IsString()
    message: string;
}

export class ChatResponseDto {
    response: string;
    session_id: string;
}
