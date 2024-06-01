import {createParamDecorator, ExecutionContext} from '@nestjs/common'

export const GetAuthDecorator = createParamDecorator(
    (_any, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()
        return request.user
    }
)
