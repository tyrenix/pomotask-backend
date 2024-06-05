import {Module} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {AuthModule} from '@src/auth/auth.module'
import {TaskModule} from '@src/task/task.module'
import {DatabaseModule} from '@src/database/database.module'
import {RedisModule} from '@src/redis/redis.module'
import {SessionModule} from '@src/session/session.module'
import {PomodoroSettingsModule} from '@src/pomodoro-settings/pomodoro-settings.module'
import {PomodoroSessionModule} from '@src/pomodoro-session/pomodoro-session.module'
import {UserModule} from '@src/user/user.module'

@Module({
    imports: [
        ConfigModule.forRoot(),
        DatabaseModule,
        RedisModule,
        SessionModule,
        AuthModule,
        UserModule,
        PomodoroSettingsModule,
        PomodoroSessionModule,
        TaskModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
