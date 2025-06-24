import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {JwtGuard} from "../auth/guard";
import {TeamJoinUserDto, UserRoleUpdateDto} from "./dto";
import {TeamAdminGuard} from "../auth/guard/admin.guard";
import {TeamMembershipService} from "./team-membership.service";

@Controller('teams/:teamId/member')
export class TeamMembershipController {

    constructor(private readonly membershipService: TeamMembershipService) {
    }

    @UseGuards(JwtGuard, TeamAdminGuard)
    @Post('')
    async updateTeam(@Body() body: TeamJoinUserDto, @Param('teamId') teamId: string) {
        return this.membershipService.addTeamUser(body, parseInt(teamId))
    }

    @UseGuards(JwtGuard, TeamAdminGuard)
    @Delete(':userId')
    async removeUserFromTeam(@Param('teamId') teamId: string, @Param('userId') userId: string) {
        return this.membershipService.removeUserFromTeam(parseInt(teamId), parseInt(userId))
    }

    @UseGuards(JwtGuard, TeamAdminGuard)
    @Patch(':userId')
    async updateUserRole(@Param('teamId') teamId: string, @Param('userId') userId: string, @Body() body: UserRoleUpdateDto) {
        return this.membershipService.updateUserRole(parseInt(teamId), parseInt(userId), body.role)
    }

    @UseGuards(JwtGuard, TeamAdminGuard)
    @Get()
    async getTeamMembers(@Param('teamId') teamId: string) {
        return this.membershipService.getTeamMembers(parseInt(teamId))
    }
}

