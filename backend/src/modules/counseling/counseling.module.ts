import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CounselingSession } from '../../database/entities';
import { CounselingController } from './counseling.controller';
import { CounselingService } from './counseling.service';
import { WebexModule } from '../webex/webex.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([CounselingSession]),
        forwardRef(() => WebexModule),
    ],
    controllers: [CounselingController],
    providers: [CounselingService],
    exports: [CounselingService],
})
export class CounselingModule { }
