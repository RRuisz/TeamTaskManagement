import {UserService} from "./user.service";
import {Body, Controller, Get, Patch, Post, Req, UseGuards} from "@nestjs/common";
import {Request} from "express";
import {JwtGuard} from "../auth/guard";
import {UserResponseDto, userUpdateDto} from "./dto";
import {AuthRequest} from "../common/AuthRequest";

@Controller('users')
export class UserController
{
    constructor(private readonly userService: UserService) {
    }

    @UseGuards(JwtGuard)
    @Get('profile')
    async getUserProfile(@Req() req: Request): Promise<UserResponseDto> {
        console.log(req.user)
        return await this.userService.getUserProfile(req.user as any);
    }

    @UseGuards(JwtGuard)
    @Patch('update')
    async updateUser(@Body() userDto: userUpdateDto, @Req() req: AuthRequest) {
        return this.userService.updateUser(userDto, req.user.id)
    }
}