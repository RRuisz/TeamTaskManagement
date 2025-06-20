import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {TeamService} from "./team.service";
import {JwtGuard} from "../auth/guard";
import {TeamCreateDto, } from "./dto";
import {User} from "@prisma/client";
import {GetUser} from "../auth/decorator/get-user.decorator";

@Controller('teams')
export class TeamController {

    constructor(private readonly teamService: TeamService) {
    }

    @UseGuards(JwtGuard)
    @Post('create')
    async createNewTeam(@Body() body: TeamCreateDto, @GetUser() user: User) {
        return this.teamService.createNewTeam(body, user.id)
    }

}

