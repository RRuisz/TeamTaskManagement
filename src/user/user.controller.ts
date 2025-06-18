import {UserService} from "./user.service";
import {Body, Controller, Get, Post} from "@nestjs/common";
import {UserDto} from "./dto";

@Controller('users')
export class UserController
{
    constructor(private readonly userService: UserService) {
    }

    @Get('get')
    getUsers() {
        return "Alle User"
    }
}