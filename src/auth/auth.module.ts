import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./strategy";
import {PrismaModule} from "../prisma/prisma.module";
import {UserService} from "../user/user.service";
import {UserModule} from "../user/user.module";

@Module({
  imports: [PrismaModule, JwtModule.register({}), UserModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy]
})
export class AuthModule {}
