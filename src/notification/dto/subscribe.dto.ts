import {Type} from 'class-transformer'
import {IsObject, IsString, ValidateNested} from 'class-validator'

class KeysDto {
    @IsString()
    p256dh: string

    @IsString()
    auth: string
}

export class SubscribeDto {
    @IsString()
    endpoint: string

    @IsObject()
    @ValidateNested()
    @Type(() => KeysDto)
    keys: KeysDto
}
