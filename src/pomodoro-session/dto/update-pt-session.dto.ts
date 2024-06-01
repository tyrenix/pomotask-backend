import {IsBoolean, IsOptional, IsString} from 'class-validator'
import {Expose, plainToInstance} from 'class-transformer'

export class UpdatePtSessionDto {
    @Expose()
    @IsString()
    @IsOptional()
    totalSeconds: number

    @Expose()
    @IsBoolean()
    @IsOptional()
    isCompleted: boolean

    @Expose()
    @IsBoolean()
    @IsOptional()
    isPaused: boolean
}

export const toUpdatePtSessionDto = (updatePtSession: UpdatePtSessionDto) =>
    plainToInstance(UpdatePtSessionDto, updatePtSession, {
        excludeExtraneousValues: true
    })
