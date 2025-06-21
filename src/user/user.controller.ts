import {UserService} from "./user.service";
import {Body, Controller, Get, Patch, UseGuards} from "@nestjs/common";
import {JwtGuard} from "../auth/guard";
import {UserResponseDto, userUpdateDto} from "./dto";
import {User} from "@prisma/client";
import {GetUser} from "../auth/decorator/get-user.decorator";

@Controller('users')
export class UserController
{
    constructor(private readonly userService: UserService) {
    }

    @UseGuards(JwtGuard)
    @Get('profile')
    async getUserProfile(@GetUser() user: User): Promise<UserResponseDto> {
        return await this.userService.getUserProfile(user);
    }

    @UseGuards(JwtGuard)
    @Patch('update')
    async updateUser(@Body() userDto: userUpdateDto, @GetUser() user: User) {
        return this.userService.updateUser(userDto, user.id)
    }
}