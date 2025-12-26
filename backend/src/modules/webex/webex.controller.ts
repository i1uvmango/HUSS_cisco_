import { Controller, Post, Body, Headers, Logger } from '@nestjs/common';
import { CounselingService } from '../counseling/counseling.service';
import { WebexWebhookDto } from './dto/webex.dto';

@Controller('api/webex')
export class WebexController {
    private readonly logger = new Logger(WebexController.name);

    constructor(private readonly counselingService: CounselingService) { }

    @Post('webhook')
    async handleWebhook(
        @Body() payload: WebexWebhookDto,
        @Headers('x-webex-signature') signature: string,
    ) {
        this.logger.log(`Received Webex webhook: ${payload.event}`);

        const { event, data } = payload;

        switch (event) {
            case 'meeting.started':
                await this.counselingService.updateSessionStatus(
                    data.meetingId,
                    'in_progress',
                );
                this.logger.log(`Meeting started: ${data.meetingId}`);
                break;

            case 'meeting.ended':
                await this.counselingService.updateSessionStatus(
                    data.meetingId,
                    'completed',
                );
                this.logger.log(`Meeting ended: ${data.meetingId}`);
                break;

            default:
                this.logger.log(`Unhandled event: ${event}`);
        }

        return { received: true, event };
    }
}
