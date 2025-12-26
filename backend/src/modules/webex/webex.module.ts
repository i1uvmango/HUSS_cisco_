import { Module, forwardRef } from '@nestjs/common';
import { WebexService } from './webex.service';
import { WebexController } from './webex.controller';
import { CounselingModule } from '../counseling/counseling.module';

@Module({
    imports: [forwardRef(() => CounselingModule)],
    controllers: [WebexController],
    providers: [WebexService],
    exports: [WebexService],
})
export class WebexModule { }
