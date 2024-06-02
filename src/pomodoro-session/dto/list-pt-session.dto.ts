import {Expose, plainToInstance, Transform} from 'class-transformer'
import {IsBoolean, IsNumber, IsOptional, IsString} from 'class-validator'
import {isValidObjectId} from 'mongoose'

export class ListPtSessionDto {
    @Expose()
    @Transform(({value}) => (isValidObjectId(value) ? value : undefined))
    @IsString()
    @IsOptional()
    taskId?: string

    @Expose()
    @Transform(({value}) => value ?? 20)
    @IsNumber()
    @IsOptional()
    limit: number

    @Expose()
    @Transform(({value}) => value ?? 0)
    @IsNumber()
    @IsOptional()
    page: number

    @Expose()
    @Transform(({value}) => {
        if (value === 'true') return true
        if (value === 'false') return false
        return value
    })
    @IsBoolean()
    @IsOptional()
    isCompleted?: boolean
}

export const toListPtSessionDto = (listPtSession: ListPtSessionDto) =>
    plainToInstance(ListPtSessionDto, listPtSession, {
        excludeExtraneousValues: true
    })
