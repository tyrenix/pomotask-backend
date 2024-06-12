import {getJwtConfig} from '@config/jwt.config'
import {Module} from '@nestjs/common'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {JwtModule} from '@nestjs/jwt'
import {AuthController} from '@src/auth/auth.controller'
import {AuthService} from '@src/auth/auth.service'
import {JwtStrategy} from '@src/auth/jwt.strategy'
import {PomodoroSettingsModule} from '@src/pomodoro-settings/pomodoro-settings.module'
import {SessionModule} from '@src/session/session.module'
import {TaskModule} from '@src/task/task.module'
import {UserModule} from '@src/user/user.module'
import {ProjectModule} from '@src/project/project.module'

@Module({
    imports: [
        UserModule,
        ConfigModule,
        SessionModule,
        PomodoroSettingsModule,
        ProjectModule,
        TaskModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getJwtConfig
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
