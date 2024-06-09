import {IsString} from 'class-validator'

export class UpdatePtSessionDto {
    @IsString()
    id: string
}
