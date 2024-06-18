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
        console.log(subscription)
        await this.notificationService.save(userId, subscription)
    }

    @Post('send')
    async sendNotification(@Body() body: {userId: string; payload: any}) {
        const {userId, payload} = body
        return this.notificationService.send(userId, payload)
    }

    @Get('publicKey')
    @Auth()
    getPublicKey() {
        return this.notificationService.getPublicKey()
    }
}
