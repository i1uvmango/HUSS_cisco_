import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { SummaryService } from './summary.service';
import { CreateSummaryDto, SummaryResponseDto } from './dto/summary.dto';

@Controller('api/summary')
export class SummaryController {
    constructor(private readonly summaryService: SummaryService) { }

    @Post()
    async createSummary(@Body() dto: CreateSummaryDto): Promise<SummaryResponseDto> {
        return this.summaryService.createSummary(dto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.summaryService.findOne(id);
    }

    @Get('user/:userId')
    async findByUser(@Param('userId') userId: string) {
        return this.summaryService.findByUser(userId);
    }
}
