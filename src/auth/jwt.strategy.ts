import {getJwtConfig} from '@config/jwt.config'
import {Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {PassportStrategy} from '@nestjs/passport'
import {JwtDto} from '@src/auth/dto/jwt.dto'
import {ExtractJwt, Strategy} from 'passport-jwt'
import {SessionService} from '../session/session.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly sessionService: SessionService
    ) {
        super({
            ignoreExpiration: false,
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
