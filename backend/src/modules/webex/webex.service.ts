import { Injectable, HttpException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

export interface WebexMeeting {
    id: string;
    webLink: string;
    sipAddress?: string;
    start: string;
    end: string;
}

@Injectable()
export class WebexService {
    private client: AxiosInstance;
    private readonly logger = new Logger(WebexService.name);

    constructor(private configService: ConfigService) {
        const token = this.configService.get('WEBEX_ACCESS_TOKEN');

        this.client = axios.create({
            baseURL: 'https://webexapis.com/v1',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
    }

    async createCounselingMeeting(
        userId: string,
        summaryId: string,
        isUrgent: boolean = false,
    ): Promise<WebexMeeting> {
        try {
            const now = new Date();
            const start = new Date(now.getTime()); // 즉시 시작 (지연 없음)
            const end = new Date(start.getTime() + 60 * 60000); // 1시간 미팅

            // 긴급 상담과 일반 상담 요청 구분
            const meetingTitle = isUrgent
                ? `[긴급] 심리 상담 세션 - ${userId.slice(0, 8)}`
                : `[상담 요청] 심리 상담 세션 - ${userId.slice(0, 8)}`;

            this.logger.log(`Creating Webex meeting for user: ${userId} (urgent: ${isUrgent})`);
            // Mask token for security in logs
            const token = this.configService.get('WEBEX_ACCESS_TOKEN');
            this.logger.debug(`Token being used (first 10 chars): ${token?.substring(0, 10)}...`);

            const payload = {
                title: meetingTitle,
                start: start.toISOString(),
                end: end.toISOString(),
                enabledAutoRecordMeeting: false,
                allowAnyUserToBeCoHost: false,
                enabledJoinBeforeHost: true,
                joinBeforeHostMinutes: 5,
                publicMeeting: false,
            };

            this.logger.debug(`Webex API Payload: ${JSON.stringify(payload)}`);

            const response = await this.client.post('/meetings', payload);

            this.logger.log(`Webex API Response Status: ${response.status}`);
            this.logger.debug(`Webex API Response Data: ${JSON.stringify(response.data)}`);

            if (!response.data || !response.data.webLink) {
                this.logger.warn('WARNING: Webex API did not return a webLink!');
            }

            this.logger.log(`Created Webex meeting ID: ${response.data.id}`);
            return response.data;
        } catch (error: any) {
            this.logger.error('Webex meeting creation failed details:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message
            });
            throw new HttpException(
                error.response?.data?.message || 'Webex 미팅 생성 실패',
                error.response?.status || 500,
            );
        }
    }

    async getMeetingStatus(meetingId: string): Promise<string> {
        try {
            const response = await this.client.get(`/meetings/${meetingId}`);
            return response.data.state;
        } catch (error: any) {
            throw new HttpException(
                'Webex 미팅 조회 실패',
                error.response?.status || 500,
            );
        }
    }

    async endMeeting(meetingId: string): Promise<void> {
        try {
            await this.client.delete(`/meetings/${meetingId}`);
        } catch (error: any) {
            throw new HttpException(
                'Webex 미팅 종료 실패',
                error.response?.status || 500,
            );
        }
    }

    verifyWebhookSignature(payload: any, signature: string): boolean {
        // In production, implement proper signature verification
        // using HMAC-SHA256 with your webhook secret
        return true;
    }
}
