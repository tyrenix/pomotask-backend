import {Expose, plainToInstance, Transform} from 'class-transformer'
import {
    PomodoroSessionDocument,
    PomodoroSessionType
} from '@src/schemas/pomodoro-session.schema'

export class PtSessionDto {
    @Expose()
    @Transform(({obj}) => obj?._id?.toString(), {toClassOnly: true})
    id: string

    @Expose()
    taskId: string

    @Expose()
    totalSeconds: number

    @Expose()
    isCompleted: boolean

    @Expose()
    isPaused: boolean

    @Expose()
    type: PomodoroSessionType
}

export const toPtSessionDto = (ptSession: PomodoroSessionDocument) =>
    plainToInstance(PtSessionDto, ptSession, {
        excludeExtraneousValues: true
    })
