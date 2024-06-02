import * as argon2 from 'argon2'
import {Model, ObjectId} from 'mongoose'
import {Injectable, NotFoundException} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {avatars} from '@src/user/data/avatars.data'
import {User, UserDocument} from '@src/schemas/user.schema'
import {AuthDto} from '@src/auth/dto/auth.dto'
import {UpdateUserDto} from '@src/user/dto/update-user.dto'

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>
    ) {}

    async getById(id: string | ObjectId) {
        return this.userModel.findById(id).exec()
    }

    async getByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({email}).exec()
    }

    async create(dto: AuthDto) {
        const user: User = {
            email: dto.email,
            password: await argon2.hash(dto.password),
            avatar: avatars[Math.floor(Math.random() * avatars.length)]
        }

        return new this.userModel(user).save()
    }

    async updateById(
        userId: string,
        dto: Partial<UpdateUserDto>
    ): Promise<UserDocument> {
        const user = await this.userModel.findById(userId)
        if (!user) {
            throw new NotFoundException('Not found user')
        }

        if (dto.password) {
            dto.password = await argon2.hash(dto.password)
        }

        await user.updateOne(dto)
        return this.userModel.findById(userId)
    }
}
