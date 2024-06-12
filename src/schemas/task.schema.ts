import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {HydratedDocument} from 'mongoose'

export type TaskDocument = HydratedDocument<Task>

@Schema({timestamps: true})
export class Task {
    @Prop({required: true})
    userId: string

    @Prop({required: true})
    title: string

    @Prop()
    description: string

    @Prop()
    index: number

    @Prop({default: false})
    isCompleted: boolean

    @Prop({required: true})
    projectId: string

    @Prop({required: true})
    columnId: string
}

export const TaskSchema = SchemaFactory.createForClass(Task)
