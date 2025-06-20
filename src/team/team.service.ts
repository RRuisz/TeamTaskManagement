import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class TeamService {
    constructor(private prisma: PrismaService) {}

    async createNewTeam(data: any, userId: number) {
        const team = await this.prisma.team.create({
            data: {
                name: data.name,
                description: data.description,
            }
        })

        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) throw new Error('User not found')

        await this.prisma.team_membership.create({
            data: {
                team: {
                    connect: {
                        id: team.id
                    }
                },
                user: {
                    connect: {
                        id: user.id
                    }
                },
                role: "admin"
            }
        })

        return team;
    }

}
