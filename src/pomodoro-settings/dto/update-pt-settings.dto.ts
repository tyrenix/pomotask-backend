import {IsNumber, IsOptional} from 'class-validator'
import {Expose} from 'class-transformer'

export class UpdatePtSettingsDto {
    @Expose()
    @IsNumber()
    @IsOptional()
    length: number

    @Expose()
    @IsNumber()
    @IsOptional()
    longBreak: number

    @Expose()
    @IsNumber()
    @IsOptional()
    shortBreak: number

    @Expose()
    @IsNumber()
    @IsOptional()
    longBreakFrequency: number

    @Expose()
    @IsNumber()
    @IsOptional()
    workingTime: number
}
