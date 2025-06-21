import {CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
import {TeamRole} from "@prisma/client";

@Injectable()
export class TeamAdminGuard implements CanActivate{

    constructor(private prisma: PrismaService) {
    }

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const request = ctx.switchToHttp().getRequest();
        const userId: number = request.user.id;
        const teamId = parseInt(request.params.teamId);

        if (!userId || !teamId) throw new ForbiddenException("");

        const membership = await this.prisma.team_membership.findFirst({
            where: {
                team_id: teamId,
                user_id: userId,
                role: TeamRole.admin
            },
            select: {
                team: true,
            }
        })

        if (!membership) throw new UnauthorizedException("")
        if (membership.team.archived_at) throw new ForbiddenException("Team is archived!")

        request.teamId = teamId;
        return true;
    }
}