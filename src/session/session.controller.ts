import {Controller, Delete, Get, Body} from '@nestjs/common'
import {Auth} from '@src/auth/decorators/auth.decorator'
import {SessionService} from '@src/session/session.service'
import {GetUserIdDecorator} from '@src/auth/decorators/get-user-id.decorator'

@Controller('session')
export class SessionController {
    constructor(private readonly sessionService: SessionService) {}

    @Auth()
    @Get('list')
    async list(@GetUserIdDecorator() userId: string) {
        return this.sessionService.list(userId)
    }

    @Auth()
    @Delete('closeAll')
    async closeAll(@GetUserIdDecorator() userId: string) {
        await this.sessionService.closeAll(userId)
        return {success: true}
    }

    @Auth()
    @Delete('close')
    async close(
        @GetUserIdDecorator() userId: string,
        @Body('sessionId') sessionId: string
    ) {
        await this.sessionService.close(userId, sessionId)
        return {success: true}
    }
}
