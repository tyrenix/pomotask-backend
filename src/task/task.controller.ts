import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
    UsePipes,
    ValidationPipe
} from '@nestjs/common'
import {Auth} from '@src/auth/decorators/auth.decorator'
import {GetUserIdDecorator} from '@src/auth/decorators/get-user-id.decorator'
import {CreateTaskDto} from '@src/task/dto/create-task.dto'
import {TaskDto, toTaskDto} from '@src/task/dto/task.dto'
import {UpdateTaskDto} from '@src/task/dto/update-task.dto'
import {TaskService} from '@src/task/task.service'
import {SearchFilterTypes} from '@src/task/types/search-filter.types'
import {isValidObjectId} from 'mongoose'

@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Post('create')
    @HttpCode(200)
    @UsePipes(new ValidationPipe())
    @Auth()
    async create(
        @GetUserIdDecorator() userId: string,
        @Body() dto: CreateTaskDto
    ): Promise<TaskDto> {
        const task = await this.taskService.create(userId, dto)
        return toTaskDto(task)
    }

    @Get('list')
    @HttpCode(200)
    @Auth()
    async list(
        @GetUserIdDecorator() userId: string,
        @Query() filters: SearchFilterTypes
    ): Promise<TaskDto[]> {
        const tasks = await this.taskService.list(userId, filters)
        return tasks.map(task => toTaskDto(task))
    }

    @Get(':taskId')
    @HttpCode(200)
    @Auth()
    async getById(
        @GetUserIdDecorator() userId: string,
        @Param('taskId') taskId: string
    ): Promise<TaskDto> {
        if (!isValidObjectId(taskId)) {
            throw new BadRequestException('Invalid task id')
        }

        const task = await this.taskService.getById(userId, taskId)
        if (!task) {
            throw new NotFoundException('Task not found')
        }

        return toTaskDto(task)
    }

    @Patch('update-index')
    @HttpCode(200)
    @Auth()
    async updateIndex(
        @GetUserIdDecorator() userId: string,
        @Body('tasksIds') tasksIds: string[]
    ): Promise<{success: true}> {
        for (const taskId of tasksIds) {
            if (!isValidObjectId(taskId))
                throw new BadRequestException(`Invalid task id: ${taskId}`)
        }

        await this.taskService.updateIndex(userId, tasksIds)
        return {success: true}
    }

    @Patch(':taskId')
    @HttpCode(200)
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    @Auth()
    async updateById(
        @GetUserIdDecorator() userId: string,
        @Param('taskId') taskId: string,
        @Body() dto: UpdateTaskDto
    ): Promise<TaskDto> {
        const task = await this.taskService.updateById(userId, taskId, dto)
        return toTaskDto(task)
    }

    @Delete(':taskId')
    @HttpCode(200)
    @Auth()
    async deleteById(
        @GetUserIdDecorator() userId: string,
        @Param('taskId') taskId: string
    ): Promise<{success: true}> {
        await this.taskService.deleteById(userId, taskId)
        return {success: true}
    }
}
