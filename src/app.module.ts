import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TeamModule } from './team/team.module';
import {TeamMembershipModule} from "./teamMembership/team-membership.module";
import { TaskController } from './task/task.controller';
import { TaskService } from './task/task.service';
import { TaskModule } from './task/task.module';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({isGlobal: true}), UserModule, AuthModule, TeamModule, TeamMembershipModule, TaskModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class AppModule {}
