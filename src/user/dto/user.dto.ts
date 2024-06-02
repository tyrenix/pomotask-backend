import {Expose, plainToInstance, Transform} from 'class-transformer'
import {UserDocument} from '@src/schemas/user.schema'

export class UserDto {
    @Expose()
    @Transform(({obj}) => obj?._id?.toString(), {toClassOnly: true})
    id: string

    @Expose()
    email: string

    @Expose()
    avatar: string
}

export const toUserDto = (user: UserDocument) =>
    plainToInstance(UserDto, user.toObject(), {excludeExtraneousValues: true})
