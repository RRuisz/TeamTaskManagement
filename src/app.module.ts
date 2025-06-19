import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TeamModule } from './team/team.module';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({isGlobal: true}), UserModule, AuthModule, TeamModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
