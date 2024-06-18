import {Module} from '@nestjs/common'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {MongooseModule} from '@nestjs/mongoose'
import {Notification, NotificationSchema} from '../schemas/notification.schema'
import {NotificationController} from './notification.controller'
import {NotificationService} from './notification.service'

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([
            {name: Notification.name, schema: NotificationSchema}
        ])
    ],
    controllers: [NotificationController],
    providers: [NotificationService, ConfigService],
    exports: [NotificationService]
})
export class NotificationModule {}
