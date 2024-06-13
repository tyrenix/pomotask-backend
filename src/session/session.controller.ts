import {
    Body,
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    Param
} from '@nestjs/common'
import {Auth} from '@src/auth/decorators/auth.decorator'
import {GetUserIdDecorator} from '@src/auth/decorators/get-user-id.decorator'
import {SessionDto, toSessionDto} from './dto/session.dto'
import {SessionService} from './session.service'

@Controller('session')
export class SessionController {
    constructor(private readonly sessionService: SessionService) {}

    // FIXME: delete this
    @Get('hello')
    async hello() {
        return 'Hello world!'
    }

    @Get('list')
    @Auth()
    async list(@GetUserIdDecorator() userId: string) {
        return this.sessionService.list(userId)
    }

    @Get(':sessionId')
    @Auth()
    async getById(
        @GetUserIdDecorator() userId: string,
        @Param('sessionId') sessionId: string
    ): Promise<SessionDto> {
        const session = await this.sessionService.getById(userId, sessionId)
        return toSessionDto(session)
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
    ): Promise<{success: true}> {
        const result = await this.sessionService.close(userId, sessionId)
        if (result === 0) {
            throw new InternalServerErrorException('Error when close session')
        }

        return {success: true}
    }
}
