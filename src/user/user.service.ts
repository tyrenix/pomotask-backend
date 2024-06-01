import * as argon2 from 'argon2'
import {Model, ObjectId} from 'mongoose'
import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {avatars} from '@src/user/data/avatars.data'
import {User} from '@src/schemas/user.schema'
import {AuthDto} from '@src/auth/dto/auth.dto'

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>
    ) {}

    async getById(id: string | ObjectId) {
        return this.userModel.findById(id).exec()
    }

    async getByEmail(email: string) {
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
}
