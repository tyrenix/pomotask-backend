import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {HydratedDocument} from 'mongoose'

export type ProjectDocument = HydratedDocument<Project>

export type ProjectType = 'all-tasks'

@Schema({timestamps: true})
export class Project {
    @Prop({required: true})
    userId: string

    @Prop()
    title?: string

    @Prop({default: undefined})
    type?: ProjectType
}

export const ProjectSchema = SchemaFactory.createForClass(Project)
