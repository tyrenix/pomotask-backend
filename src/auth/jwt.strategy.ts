import {Injectable, UnauthorizedException} from '@nestjs/common'
import {PassportStrategy} from '@nestjs/passport'
import {ExtractJwt, Strategy} from 'passport-jwt'
import {SessionService} from '@src/session/session.service'
import {ConfigService} from '@nestjs/config'
import {UserService} from '@src/user/user.service'
import {getJwtConfig} from '@config/jwt.config'
import {JwtDto} from '@src/auth/dto/jwt.dto'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
        private readonly sessionService: SessionService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: getJwtConfig(configService).secret
        })
    }

    async validate(jwt: JwtDto) {
        const session = await this.sessionService.validate(
            jwt.userId,
            jwt.sessionId
        )
        return {jwt, session, user: {userId: jwt.userId}}
    }
}
