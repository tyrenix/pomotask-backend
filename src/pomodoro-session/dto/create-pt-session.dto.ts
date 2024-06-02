import {IsOptional, IsString} from 'class-validator'
import {Expose, plainToInstance} from 'class-transformer'
import {PomodoroSessionType} from '@src/schemas/pomodoro-session.schema'

export class CreatePtSessionDto {
    @Expose()
    @IsString()
    @IsOptional()
    taskId: string

    @Expose()
    @IsString()
    type: PomodoroSessionType
}

export const toCreatePtSessionDto = (ptSession: CreatePtSessionDto) =>
    plainToInstance(CreatePtSessionDto, ptSession, {
        excludeExtraneousValues: true
    })
