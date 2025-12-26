import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, AISummary, CounselingSession } from './database/entities';
import { AIModule } from './services/ai/ai.module';
import { UserModule } from './modules/user/user.module';
import { ChatModule } from './modules/chat/chat.module';
import { SummaryModule } from './modules/summary/summary.module';
import { CounselingModule } from './modules/counseling/counseling.module';
import { WebexModule } from './modules/webex/webex.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_NAME', 'youth_support'),
        entities: [User, AISummary, CounselingSession],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
    AIModule,
    UserModule,
    ChatModule,
    SummaryModule,
    CounselingModule,
    WebexModule,
    AdminModule,
  ],
})
export class AppModule { }
