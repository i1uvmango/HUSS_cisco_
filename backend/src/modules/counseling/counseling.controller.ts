import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CounselingService } from './counseling.service';
import { CreateCounselingDto, CounselingResponseDto } from './dto/counseling.dto';

@Controller('api/counseling')
export class CounselingController {
    constructor(private readonly counselingService: CounselingService) { }

    @Post('request')
    async createRequest(
        @Body() dto: CreateCounselingDto,
    ): Promise<CounselingResponseDto> {
        return this.counselingService.createCounselingRequest(dto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.counselingService.findOne(id);
    }

    @Get('user/:userId')
    async findByUser(@Param('userId') userId: string) {
        return this.counselingService.findByUser(userId);
    }
}
