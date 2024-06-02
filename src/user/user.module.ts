import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {User, UserSchema} from '@src/schemas/user.schema'
import {UserService} from '@src/user/user.service'
import {UserController} from '@src/user/user.controller'

@Module({
    imports: [
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}])
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}
