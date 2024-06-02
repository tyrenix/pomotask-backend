import {IsBoolean, IsNumber, IsOptional} from 'class-validator'
import {Expose, plainToInstance} from 'class-transformer'

export class UpdatePtSessionDto {
    @Expose()
    @IsNumber()
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
