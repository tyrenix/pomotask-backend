import {
    BadRequestException,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {isValidObjectId, Model} from 'mongoose'
import {Task, TaskDocument} from '@src/schemas/task.schema'
import {CreateTaskDto} from '@src/task/dto/create-task.dto'
import {SearchFilterTypes} from '@src/task/types/search-filter.types'
import {UpdateTaskDto} from '@src/task/dto/update-task.dto'
import {ColumnService} from '../column/column.service'
import {ProjectService} from '../project/project.service'
import {PomodoroSessionService} from '../pomodoro-session/pomodoro-session.service'

@Injectable()
export class TaskService {
    constructor(
        @InjectModel(Task.name) private readonly taskModel: Model<Task>,
        private readonly ptSessionsService: PomodoroSessionService,
        private readonly columnService: ColumnService,
        private readonly projectService: ProjectService
    ) {}

    async create(userId: string, dto: CreateTaskDto): Promise<TaskDocument> {
        if (!dto.projectId) {
            const project = await this.projectService.getByType(
                userId,
                'all-tasks'
            )
            const column = await this.columnService.getDCForProject(
                userId,
                project.id
            )

            dto.projectId = project.id
            dto.columnId = column.id
        }

        if (!isValidObjectId(dto.projectId))
            throw new BadRequestException('Invalid project id')

        if (!(await this.projectService.getById(userId, dto.projectId)))
            throw new NotFoundException('Not found project')

        if (!dto.columnId) {
            const column = await this.columnService.getDCForProject(
                userId,
                dto.projectId
            )

            dto.columnId = column.id
        }

        if (!isValidObjectId(dto.columnId))
            throw new BadRequestException('Invalid column id')

        if (
            !(await this.columnService.getById(
                userId,
                dto.projectId,
                dto.columnId
            ))
        )
            throw new NotFoundException('Not found column')

        return new this.taskModel({
            userId,
            projectId: dto.projectId,
            columnId: dto.columnId,
            title: dto.title,
            description: dto.description,
            index:
                ((
                    await this.taskModel
                        .findOne({userId, isCompleted: false})
                        .select('index')
                        .sort({index: -1})
                )?.index || 0) + 1
        }).save()
    }

    async getCount(
        userId: string,
        filters?: SearchFilterTypes
    ): Promise<number> {
        return this.taskModel
            .find({userId, ...(filters || {})})
            .countDocuments()
            .exec()
    }

    async list(
        userId: string,
        filters?: SearchFilterTypes
    ): Promise<TaskDocument[]> {
        return this.taskModel
            .find({userId, ...(filters || {})})
            .sort({index: 1})
            .exec()
    }

    async getById(
        userId: string,
        taskId: string
    ): Promise<TaskDocument | null> {
        return this.taskModel.findOne({_id: taskId, userId}).exec()
    }

    async updateById(
        userId: string,
        taskId: string,
        dto: Partial<UpdateTaskDto>
    ): Promise<TaskDocument> {
        const task = await this.taskModel.findOne({_id: taskId, userId})
        if (!task) {
            throw new NotFoundException('Task not found')
        }

        if (
            typeof dto.isCompleted === 'boolean' &&
            dto.isCompleted !== task.isCompleted
        ) {
            dto.index =
                ((
                    await this.taskModel
                        .findOne({userId, isCompleted: dto.isCompleted})
                        .select('index')
                        .sort({index: -1})
                )?.index || 0) + 1
        }

        await task.updateOne(dto)
        return this.taskModel.findOne({_id: taskId, userId})
    }

    async updateIndex(userId: string, tasksIds: string[]) {
        for (let index = 0; index < tasksIds.length; index++) {
            await this.taskModel.updateOne(
                {
                    _id: tasksIds[index],
                    userId
                },
                {index}
            )
        }
    }

    async deleteById(userId: string, taskId: string) {
        await this.ptSessionsService.untieFromTask(userId, taskId)
        return this.taskModel.deleteOne({_id: taskId, userId})
    }
}
