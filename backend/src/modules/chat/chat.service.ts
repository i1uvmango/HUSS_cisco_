import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AIService } from '../../services/ai/ai.service';
import { WebexService } from '../webex/webex.service';

export interface ConversationMessage {
    role: 'user' | 'assistant';
    content: string;
}

// In-memory session store (production should use Redis)
const sessionStore = new Map<string, ConversationMessage[]>();
// Track if a session has already triggered a crisis alert
const sessionCrisisStore = new Map<string, boolean>();

@Injectable()
export class ChatService {
    constructor(
        private readonly aiService: AIService,
        @Inject(forwardRef(() => WebexService))
        private readonly webexService: WebexService,
    ) { }

    async processMessage(
        message: string,
        sessionId?: string,
    ): Promise<{ response: string; sessionId: string; meeting_url?: string }> {
        // Create or get session
        const currentSessionId = sessionId || uuidv4();

        if (!sessionStore.has(currentSessionId)) {
            sessionStore.set(currentSessionId, []);
            sessionCrisisStore.set(currentSessionId, false);
        }

        const messages = sessionStore.get(currentSessionId)!;

        // 1. Add user message to history
        const userMsgObj: ConversationMessage = { role: 'user', content: message };
        messages.push(userMsgObj);

        // 2. Generate AI response using Gemini
        // We pass the conversation context + new user message
        // Note: In a real app, you might want to limit context window size
        let aiResponse = await this.aiService.generateChatResponse(messages, message);

        console.log('[DEBUG] Full AI Response:', aiResponse);

        let meeting_url: string | undefined;

        // 3. Check for [RISK_DETECTED] tag
        if (aiResponse.includes('[RISK_DETECTED]')) {
            console.log('[ALERT] RISK_DETECTED tag found in AI response!');
            // Remove the tag from the visible response
            aiResponse = aiResponse.replace('[RISK_DETECTED]', '').trim();

            // Check if we already handled a crisis for this session to avoid Spamming meetings
            // But for safety, maybe we allow multiple? Let's check the store.
            const alreadyTriggered = sessionCrisisStore.get(currentSessionId);

            if (!alreadyTriggered) {
                try {
                    // 4. Create Webex Meeting automatically (Webex Bot action)
                    // We use a dummy user ID for now or anonymous
                    const meeting = await this.webexService.createCounselingMeeting(
                        `anonymous-${currentSessionId.substring(0, 8)}`,
                        'crisis-auto-generated',
                        true  // isUrgent: 위기 감지 시 긴급 상담
                    );
                    meeting_url = meeting.webLink;

                    // Mark as triggered
                    sessionCrisisStore.set(currentSessionId, true);

                    // Add a system-like message to the response?
                    // Actually, the frontend will see meeting_url and show the alert button.
                    // We can also append a text guidance.
                    // aiResponse += "\n\n(상담사가 연결되었습니다. 아래 버튼을 눌러 상담실로 입장해주세요.)";

                } catch (error) {
                    console.error('Failed to auto-create crisis meeting:', error);
                }
            }
        }

        // 5. Store AI response
        messages.push({ role: 'assistant', content: aiResponse });

        return {
            response: aiResponse,
            sessionId: currentSessionId,
            meeting_url, // Return this so frontend can show the 'Join' button immediately
        };
    }

    getSessionMessages(sessionId: string): ConversationMessage[] {
        return sessionStore.get(sessionId) || [];
    }

    clearSession(sessionId: string): void {
        sessionStore.delete(sessionId);
        sessionCrisisStore.delete(sessionId);
    }

    async startSession(): Promise<{ greeting: string; sessionId: string }> {
        const sessionId = uuidv4();
        const greeting = "안녕! 반가워 😊 여기는 네가 편하게 이야기할 수 있는 공간이야. 오늘 하루는 어땠어? 네 이야기가 궁금해!";

        // Initialize session
        sessionStore.set(sessionId, [
            { role: 'assistant', content: greeting }
        ]);
        sessionCrisisStore.set(sessionId, false);

        return {
            greeting,
            sessionId,
        };
    }
}
