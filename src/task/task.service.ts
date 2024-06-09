import {Injectable, NotFoundException} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model} from 'mongoose'
import {Task, TaskDocument} from '@src/schemas/task.schema'
import {CreateTaskDto} from '@src/task/dto/create-task.dto'
import {SearchFilterTypes} from '@src/task/types/search-filter.types'
import {UpdateTaskDto} from '@src/task/dto/update-task.dto'

@Injectable()
export class TaskService {
    constructor(
        @InjectModel(Task.name) private readonly taskModel: Model<Task>
    ) {}

    async create(userId: string, dto: CreateTaskDto): Promise<TaskDocument> {
        return new this.taskModel({
            userId,
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
        return this.taskModel.deleteOne({_id: taskId, userId})
    }
}
