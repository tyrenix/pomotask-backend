import {UserDto} from '@src/user/dto/user.dto'
import {Expose, plainToInstance} from 'class-transformer'

export class AuthSuccessDto extends UserDto {
    @Expose()
    accessToken: string
}

export const toAuthSuccessDto = (createdDto: AuthSuccessDto) =>
    plainToInstance(AuthSuccessDto, createdDto, {excludeExtraneousValues: true})
