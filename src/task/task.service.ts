import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {TaskCreateDto} from "./dto";
import {TaskStatus} from "@prisma/client";

@Injectable()
export class TaskService {
    constructor(private readonly prisma: PrismaService) {}

    async createNewTask(teamId: number, data: TaskCreateDto, userId: number) {
        try {
            return this.prisma.task.create({
                data: {
                    title: data.title,
                    description: data.description,
                    status: "new",
                    team: {
                        connect: {
                            id: teamId
                        }
                    },
                    reported_user: {
                        connect: {
                            id: userId
                        }
                    }
                }
            })
        } catch (e) {
            return new Error("Something went wrong!")
        }
    }

    async assignTaskToUser(teamId: number, taskId: number, assignToUserId: number | null) {
        if (assignToUserId) {
            const membership = await this.prisma.team_membership.findFirst({
                where: {
                    team_id: teamId,
                    user_id: assignToUserId
                }
            })

            if (!membership) throw new Error("User is not a member of this team!")

        }

        //todo: (for the future) notification if a user got assigned?
        await this.prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                assigned_user: assignToUserId !== null
                    ? { connect: { id: assignToUserId } }
                    : { disconnect: true }
            }
        })
    }

    async updateTaskStatus(taskId: number, status: TaskStatus, teamId: number) {
        await this.verifyTaskIsInTeam(teamId, taskId)

        return this.prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                status: status
            }
        })
    }

    async updateTask(taskId: number, teamId: number, data: TaskCreateDto) {
        await this.verifyTaskIsInTeam(teamId, taskId)

        return this.prisma.task.update({
            where: {
                id: taskId
            },
            data: data
        })
    }



    private async verifyTaskIsInTeam(teamId: number, taskId: number) {
        const task = await this.prisma.task.findUnique({
            where: {
                id: taskId
            }
        })

        if (!task || task.team_id !== teamId) throw new Error('')
    }
}
