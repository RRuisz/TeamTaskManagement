import {TeamRole} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";
import {TeamJoinUserDto} from "./dto";
import {Injectable} from "@nestjs/common";

@Injectable()
export class TeamMembershipService {
    constructor(private prisma: PrismaService) {}

    async addTeamUser(body: TeamJoinUserDto, teamId: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: body.email
            }
        })

        if (!user) throw new Error('User not found')

        const existing = await this.prisma.team_membership.findUnique({
            where: {
                team_id_user_id: {
                    team_id: teamId,
                    user_id: user.id
                }
            }
        })

        if (existing) throw new Error('User already in team!')

        await this.prisma.team_membership.create({
            data: {
                team: {
                    connect: {
                        id: teamId
                    }
                },
                user: {
                    connect: {
                        id: user.id
                    }
                },
                role: body.role as TeamRole
            }
        })

        return "User successfully added to team!"
    }

    async removeUserFromTeam(teamId: number, userId: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) throw new Error('User not found')

        const existing = await this.prisma.team_membership.findUnique({
            where: {
                team_id_user_id: {
                    team_id: teamId,
                    user_id: user.id
                }
            }
        })

        if (!existing) throw new Error('User in Team not found')

        //todo: check if user is last Admin User of Team!
        await this.prisma.team_membership.delete({
            where: {
                team_id_user_id: {
                    team_id: teamId,
                    user_id: user.id
                }
            }
        })

        return "User successfully removed from team!"
    }

    async updateUserRole(teamId: number, userId: number, role: TeamRole) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) throw new Error('User not found')

        const team = await this.prisma.team.findUnique({
            where: {
                id: teamId
            }
        })

        if (!team) throw new Error('Team not found')

        const existing = await this.prisma.team_membership.findUnique({
            where: {
                team_id_user_id: {
                    team_id: team.id,
                    user_id: user.id
                }
            }
        })

        if (!existing) throw new Error("User is not a member of this team!")

        if (existing.role === role) throw new Error("User already has this role!")

        await this.prisma.team_membership.update({
            where: {
                team_id_user_id: {
                    team_id: team.id,
                    user_id: user.id
                }
            },
            data: {
                role: role
            }
        })

        return "User role successfully updated!"
    }

    async getTeamMembers(teamId: number) {
        const memberships = await this.prisma.team_membership.findMany({
            where: {
                team_id: teamId
            }, include: {
                user: true
            }
        })

        return memberships.map(m => ({
            id: m.user.id,
            email: m.user.email,
            firstName: m.user.firstName,
            lastName: m.user.lastName,
            role: m.role,
            joinedAt: m.joined_at,
        }));
    }

}