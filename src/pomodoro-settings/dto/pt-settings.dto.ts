import {Expose, plainToInstance} from 'class-transformer'
import {PomodoroSettingsDocument} from '@src/schemas/pomodoro-settings.schema'

export class PtSettingsDto {
    @Expose()
    length: number

    @Expose()
    longBreak: number

    @Expose()
    shortBreak: number

    @Expose()
    longBreakFrequency: number

    @Expose()
    workingTime: number
}

export const toPtSettingsDto = (ptSettings: PomodoroSettingsDocument) =>
    plainToInstance(PtSettingsDto, ptSettings, {excludeExtraneousValues: true})
