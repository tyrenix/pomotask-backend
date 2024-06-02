import {IsOptional, IsString, MinLength} from 'class-validator'

export class CreateTaskDto {
    @MinLength(1)
    @IsString()
    title: string

    @IsOptional()
    @IsString()
    description: string
}
