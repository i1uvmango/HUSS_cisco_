export class WebexWebhookDto {
    event: string;
    data: {
        id: string;
        meetingId: string;
        title?: string;
    };
}
