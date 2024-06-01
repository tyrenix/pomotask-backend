import {Module} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {AuthModule} from '@src/auth/auth.module'
import {TaskModule} from '@src/task/task.module'
import {DatabaseModule} from '@src/database/database.module'
import {RedisModule} from '@src/redis/redis.module'
import {SessionModule} from '@src/session/session.module'

@Module({
    imports: [
        ConfigModule.forRoot(),
        DatabaseModule,
        RedisModule,
        SessionModule,
        AuthModule,
        TaskModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
