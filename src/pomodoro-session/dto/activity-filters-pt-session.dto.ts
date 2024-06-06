import {Expose, plainToInstance} from 'class-transformer'
import {IsIn, IsOptional, IsString} from 'class-validator'

export class ActivityFiltersPtSessionDto {
    @Expose()
    @IsOptional()
    @IsIn(['day', 'week', 'total'])
    filter?: 'day' | 'week' | 'total'
}

export const toActivityFiltersPtSessionDto = (
    activityFiltersPtSession: ActivityFiltersPtSessionDto
) =>
    plainToInstance(ActivityFiltersPtSessionDto, activityFiltersPtSession, {
        excludeExtraneousValues: true
    })
