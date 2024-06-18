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
import { ProjectModule } from './project/project.module';
import { ColumnModule } from './column/column.module';
import { NotificationModule } from './notification/notification.module';

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
        TaskModule,
        ProjectModule,
        ColumnModule,
        NotificationModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
