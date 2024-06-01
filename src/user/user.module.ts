import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {User, UserSchema} from '@src/schemas/user.schema'
import {UserService} from '@src/user/user.service'

@Module({
    imports: [
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}])
    ],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}
