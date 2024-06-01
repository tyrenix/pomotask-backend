import {Expose, plainToInstance, Transform} from 'class-transformer'
import {TaskDocument} from '@src/schemas/task.schema'

export class TaskDto {
    @Expose()
    @Transform(({obj}) => obj?._id?.toString())
    id: string

    @Expose()
    title: string

    @Expose()
    description: string | undefined

    @Expose()
    isCompleted: boolean

    @Expose()
    index: number

    @Expose()
    createdAt: Date

    @Expose()
    updatedAt: Date
}

export const toTaskDto = (task: TaskDocument) =>
    plainToInstance(TaskDto, task.toObject(), {excludeExtraneousValues: true})
