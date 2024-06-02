import {createParamDecorator, ExecutionContext} from '@nestjs/common'

export const GetUserIdDecorator = createParamDecorator(
    (_any, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()
        return request?.user?.user?.userId
    }
)
