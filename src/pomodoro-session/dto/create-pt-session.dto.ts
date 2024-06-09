import {Expose, plainToInstance} from 'class-transformer'
import {IsOptional, IsString} from 'class-validator'

export class CreatePtSessionDto {
    @Expose()
    @IsString()
    @IsOptional()
    taskId: string
}

export const toCreatePtSessionDto = (ptSession: CreatePtSessionDto) =>
    plainToInstance(CreatePtSessionDto, ptSession, {
        excludeExtraneousValues: true
    })
