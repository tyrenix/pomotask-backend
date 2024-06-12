import {IsOptional, IsString, MinLength} from 'class-validator'

export class CreateTaskDto {
    @IsString()
    @IsOptional()
    projectId?: string

    @IsString()
    @IsOptional()
    columnId?: string

    @MinLength(1)
    @IsString()
    title: string

    @IsOptional()
    @IsString()
    description: string
}
