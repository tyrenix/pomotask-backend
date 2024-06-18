import {
    Body,
    Controller,
    Get,
    Post,
    UsePipes,
    ValidationPipe
} from '@nestjs/common'
import {Auth} from '../auth/decorators/auth.decorator'
import {GetUserIdDecorator} from '../auth/decorators/get-user-id.decorator'
import {SubscribeDto} from './dto/subscribe.dto'
import {NotificationService} from './notification.service'

@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post('subscribe')
    @UsePipes(new ValidationPipe({whitelist: true}))
    @Auth()
    async subscribe(
        @GetUserIdDecorator() userId: string,
        @Body() subscription: SubscribeDto
    ) {
        await this.notificationService.save(userId, subscription)
    }

    @Get('public-key')
    @Auth()
    getPublicKey(): {publicKey: string} {
        return {publicKey: this.notificationService.getPublicKey()}
    }
}
