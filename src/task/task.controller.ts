import {BadRequestException, Body, Controller, Param, Patch, Post, Req, UseGuards} from '@nestjs/common';
import {TeamGuard} from "../auth/guard/team.guard";
import {JwtGuard} from "../auth/guard";
import {TaskService} from "./task.service";
import {TaskCreateDto, TaskUpdateDto} from "./dto";
import {GetUser} from "../auth/decorator/get-user.decorator";
import {TaskStatus, User} from "@prisma/client";

@Controller('teams/:teamId/task')
export class TaskController {
    constructor(private readonly taskService: TaskService) {
    }

    @UseGuards(JwtGuard, TeamGuard)
    @Post('')
    async createNewTask(@Body() body: TaskCreateDto, @Param('teamId') teamId: string, @GetUser() user: User) {
        return this.taskService.createNewTask(parseInt(teamId), body, user.id)
    }


    @UseGuards(JwtGuard, TeamGuard)
    @Patch(':taskId/assign')
    async assignTask(@Param('teamId') teamId: string, @Param('taskId') taskId: string, @Body() body: {userId: number | null}) {
        return this.taskService.assignTaskToUser(parseInt(teamId), parseInt(taskId), body.userId)
    }

    @UseGuards(JwtGuard, TeamGuard)
    @Patch(':taskId/status/:status')
    async updateTaskStatus(@Param("teamId") teamId: string,@Param('taskId') taskId: string, @Param("status") status: string) {
        const parsedStatus = status as TaskStatus;
        if (!Object.values(TaskStatus).includes(parsedStatus)) {
            throw new BadRequestException('Invalid status value');
        }
        return this.taskService.updateTaskStatus(parseInt(taskId), parsedStatus, parseInt(teamId))
    }

    @UseGuards(JwtGuard, TeamGuard)
    @Patch(':taskId')
    async updateTask(@Param("teamId") teamId: string,@Param('taskId') taskId: string, @Body() data: TaskUpdateDto) {
        return this.taskService.updateTask(parseInt(taskId), parseInt(teamId), data)
    }



}
