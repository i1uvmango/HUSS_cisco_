import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AIService, ConversationMessage } from '../../services/ai/ai.service';

// In-memory session store (production should use Redis)
const sessionStore = new Map<string, ConversationMessage[]>();

@Injectable()
export class ChatService {
    constructor(private readonly aiService: AIService) { }

    async processMessage(
        message: string,
        sessionId?: string,
    ): Promise<{ response: string; sessionId: string }> {
        // Create or get session
        const currentSessionId = sessionId || uuidv4();

        if (!sessionStore.has(currentSessionId)) {
            sessionStore.set(currentSessionId, []);
        }

        const messages = sessionStore.get(currentSessionId)!;

        // Generate AI response
        const response = await this.aiService.generateChatResponse(messages, message);

        // Store messages in session (NOT in database)
        messages.push({ role: 'user', content: message });
        messages.push({ role: 'assistant', content: response });

        return {
            response,
            sessionId: currentSessionId,
        };
    }

    getSessionMessages(sessionId: string): ConversationMessage[] {
        return sessionStore.get(sessionId) || [];
    }

    clearSession(sessionId: string): void {
        sessionStore.delete(sessionId);
    }
}
