import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {HydratedDocument} from 'mongoose'

export type PomodoroSettingsDocument = HydratedDocument<PomodoroSettings>

@Schema()
export class PomodoroSettings {
    @Prop({required: true, unique: true})
    userId: string

    @Prop({default: 1500})
    length: number

    @Prop({default: 900})
    longBreak: number

    @Prop({default: 300})
    shortBreak: number

    @Prop({default: 4})
    longBreakFrequency: number

    @Prop({default: 28800})
    workingTime: number
}

export const PomodoroSettingsSchema =
    SchemaFactory.createForClass(PomodoroSettings)
