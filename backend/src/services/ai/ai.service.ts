import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
    EMOTION_ANALYSIS_PROMPT,
    CHAT_SYSTEM_PROMPT,
} from './prompts/emotion-analysis.prompt';

export interface ConversationMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface EmotionSummary {
    emotion_tags: string[];
    dominant_emotion: string;
    repeated_topics: string[];
    risk_flag: boolean;
    intensity_score: number;
}

@Injectable()
export class AIService {
    private openai: OpenAI;

    constructor(private configService: ConfigService) {
        this.openai = new OpenAI({
            apiKey: this.configService.get('OPENAI_API_KEY'),
        });
    }

    async generateChatResponse(
        messages: ConversationMessage[],
        userMessage: string,
    ): Promise<string> {
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: CHAT_SYSTEM_PROMPT },
                    ...messages.map((m) => ({
                        role: m.role as 'user' | 'assistant',
                        content: m.content,
                    })),
                    { role: 'user', content: userMessage },
                ],
                temperature: 0.7,
                max_tokens: 500,
            });

            return response.choices[0].message.content || '';
        } catch (error) {
            console.error('AI Chat Error:', error);
            return '죄송합니다. 잠시 후 다시 시도해 주세요.';
        }
    }

    async generateEmotionSummary(
        messages: ConversationMessage[],
    ): Promise<EmotionSummary> {
        try {
            const conversationText = messages
                .map((m) => `${m.role === 'user' ? '사용자' : 'AI'}: ${m.content}`)
                .join('\n');

            const response = await this.openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: EMOTION_ANALYSIS_PROMPT },
                    {
                        role: 'user',
                        content: `다음 대화를 분석하고 요약하세요:\n\n${conversationText}`,
                    },
                ],
                temperature: 0.3,
                response_format: { type: 'json_object' },
            });

            const content = response.choices[0].message.content || '{}';
            return JSON.parse(content) as EmotionSummary;
        } catch (error) {
            console.error('AI Summary Error:', error);
            return {
                emotion_tags: [],
                dominant_emotion: 'unknown',
                repeated_topics: [],
                risk_flag: false,
                intensity_score: 0,
            };
        }
    }
}
