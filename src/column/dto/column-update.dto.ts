import {IsOptional, IsString, Max} from 'class-validator'

export class ColumnUpdateDto {
    @IsString()
    @IsOptional()
    @Max(32)
    title?: string
}
