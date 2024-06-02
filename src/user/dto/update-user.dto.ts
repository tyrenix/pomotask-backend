import {IsOptional, IsString, MaxLength, MinLength} from 'class-validator'
import {Expose} from 'class-transformer'

export class UpdateUserDto {
    @Expose()
    @IsString()
    @MinLength(8)
    @MaxLength(16)
    @IsOptional()
    password: string
}
