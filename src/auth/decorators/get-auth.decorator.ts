import {SessionDto} from '@/src/session/dto/session.dto'
import {createParamDecorator, ExecutionContext} from '@nestjs/common'
import {JwtDto} from '../dto/jwt.dto'

export const GetAuthDecorator = createParamDecorator(
    (
        _any,
        ctx: ExecutionContext
    ): {
        jwt: JwtDto
        session: SessionDto
        user: {
            userId: string
        }
    } => {
        const request = ctx.switchToHttp().getRequest()
        return request.user
    }
)
