import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {HydratedDocument} from 'mongoose'

export type PomodoroSessionDocument = HydratedDocument<PomodoroSession>
export type PomodoroSessionType = 'work' | 'shortBreak' | 'longBreak'

@Schema({timestamps: true})
export class PomodoroSession {
    @Prop({required: true})
    userId: string

    @Prop()
    taskId: string

    @Prop({default: 0})
    totalSeconds: number

    @Prop({default: false})
    isCompleted: boolean

    @Prop({default: false})
    isPaused: boolean

    @Prop({required: true})
    type: PomodoroSessionType
}

export const PomodoroSessionSchema =
    SchemaFactory.createForClass(PomodoroSession)
