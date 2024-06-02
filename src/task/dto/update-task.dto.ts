import {
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength
} from 'class-validator'
import {Expose, plainToInstance} from 'class-transformer'

export class UpdateTaskDto {
    @IsString()
    @IsOptional()
    @MaxLength(32)
    @Expose()
    title: string

    @IsString()
    @IsOptional()
    @MaxLength(128)
    @Expose()
    description: string

    @IsBoolean()
    @IsOptional()
    @Expose()
    isCompleted: boolean

    @IsNumber()
    @IsOptional()
    @Expose()
    index: number
}

export const toUpdateTaskDto = (task: UpdateTaskDto) =>
    plainToInstance(UpdateTaskDto, task, {excludeExtraneousValues: true})
