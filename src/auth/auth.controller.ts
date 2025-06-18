import {AuthService} from "./auth.service";
import { UserDto } from '../user/dto';
import {Body, Controller, Post, UsePipes, ValidationPipe} from "@nestjs/common";

@UsePipes(ValidationPipe)
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {

    }

    @Post('register')
    async registerUser(@Body() dto: UserDto){
        return await this.authService.registerUser(dto)
    }

    @Post('login')
    async loginUser(@Body() data: {email: string, password: string}){
        return await this.authService.loginUser(data)
    }
}
