import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {HydratedDocument} from 'mongoose'

export type ColumnDocument = HydratedDocument<Column>

@Schema({timestamps: true})
export class Column {
    @Prop({required: true})
    userId: string

    @Prop({required: true})
    projectId: string

    @Prop()
    title?: boolean
}

export const ColumnSchema = SchemaFactory.createForClass(Column)
