import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {TaskCreateDto, TaskUpdateDto} from "./dto";
import {Task, TaskStatus} from "@prisma/client";

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

    async updateTask(taskId: number, teamId: number, dto: TaskUpdateDto) {
        await this.verifyTaskIsInTeam(teamId, taskId)
        const data: Partial<Pick<Task, 'title' | 'description' | 'status' | 'due_date' | 'assigned_user_id'>> = {};

        if (dto.title) data.title = dto.title;
        if (dto.description) data.description = dto.description;
        if (dto.status) data.status = dto.status as TaskStatus;
        if (dto.due_date) data.due_date = dto.due_date;
        if (dto.assignee_id) data.assigned_user_id = parseInt(dto.assignee_id);

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
