import {JwtModule} from '@nestjs/jwt'
import {Module} from '@nestjs/common'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {AuthController} from '@src/auth/auth.controller'
import {AuthService} from '@src/auth/auth.service'
import {UserModule} from '@src/user/user.module'
import {JwtStrategy} from '@src/auth/jwt.strategy'
import {SessionModule} from '@src/session/session.module'
import {getJwtConfig} from '@config/jwt.config'

@Module({
    imports: [
        UserModule,
        ConfigModule,
        SessionModule,
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
