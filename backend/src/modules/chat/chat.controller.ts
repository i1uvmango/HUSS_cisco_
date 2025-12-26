import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatMessageDto, ChatResponseDto } from './dto/chat.dto';

@Controller('api/chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Post()
    async sendMessage(@Body() chatDto: ChatMessageDto): Promise<ChatResponseDto> {
        const result = await this.chatService.processMessage(
            chatDto.message,
            chatDto.session_id,
        );

        return {
            response: result.response,
            session_id: result.sessionId,
        };
    }
}
