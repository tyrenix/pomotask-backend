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
            index: await this.getCount(userId, {isCompleted: false})
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
        return this.taskModel.find({userId, ...(filters || {})}).exec()
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

        await task.updateOne(dto)
        return this.taskModel.findOne({_id: taskId, userId})
    }

    async deleteById(userId: string, taskId: string) {
        return this.taskModel.deleteOne({_id: taskId, userId})
    }
}
