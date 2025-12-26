import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CounselingModule } from '../counseling/counseling.module';

@Module({
    imports: [CounselingModule],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { }
