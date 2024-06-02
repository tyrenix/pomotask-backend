import {
    IsEmail,
    IsOptional,
    IsString,
    MaxLength,
    MinLength
} from 'class-validator'

export class AuthDto {
    @IsEmail()
    email: string

    @MinLength(8)
    @MaxLength(16)
    @IsString()
    password: string

    @IsOptional()
    userAgent?: string

    @IsOptional()
    ip?: string
}
