import {
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength
} from 'class-validator'

export class UpdateTaskDto {
    @IsString()
    @IsOptional()
    @MaxLength(32)
    title: string

    @IsString()
    @IsOptional()
    @MaxLength(128)
    description: string

    @IsBoolean()
    @IsOptional()
    isCompleted: boolean

    @IsNumber()
    @IsOptional()
    index: number
}
