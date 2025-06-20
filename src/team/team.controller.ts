import {Body, Controller, Param, Post, UseGuards} from '@nestjs/common';
import {TeamService} from "./team.service";
import {JwtGuard} from "../auth/guard";
import {TeamCreateDto, } from "./dto";
import {User} from "@prisma/client";
import {GetUser} from "../auth/decorator/get-user.decorator";
import {TeamAdminGuard} from "../auth/guard/admin.guard";

@Controller('teams')
export class TeamController {

    constructor(private readonly teamService: TeamService) {
    }

    @UseGuards(JwtGuard)
    @Post('create')
    async createNewTeam(@Body() body: TeamCreateDto, @GetUser() user: User) {
        return this.teamService.createNewTeam(body, user.id)
    }

    @UseGuards(JwtGuard, TeamAdminGuard)
    @Post(':teamId/archive')
    async updateTeamArchiveStatus(@Param('teamId') teamId: string, @Body() body: {archive: boolean}) {
        return this.teamService.updateTeamStatus(parseInt(teamId), body.archive)
    }
}

