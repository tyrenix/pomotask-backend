import {UserDto} from '@src/user/dto/user.dto'
import {Expose, plainToInstance} from 'class-transformer'

export class CreatedDto extends UserDto {
    @Expose()
    accessToken: string
}

export const toCreatedDto = (createdDto: CreatedDto) =>
    plainToInstance(CreatedDto, createdDto, {excludeExtraneousValues: true})
