import {IsOptional, IsString, Max} from 'class-validator'

export class ProjectUpdateDto {
    @IsOptional()
    @IsString()
    @Max(32)
    title?: string
}
