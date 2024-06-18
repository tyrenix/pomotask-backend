import {Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {InjectModel} from '@nestjs/mongoose'
import {Model} from 'mongoose'
import * as webPush from 'web-push'
import {getWebPushConfig} from '../config/web-push.config'
import {
    ISubscriptionNotification,
    Notification,
    NotificationDocument
} from '../schemas/notification.schema'
import {IPayloadType} from './types/payload.types'

@Injectable()
export class NotificationService {
    constructor(
        @InjectModel(Notification.name)
        private readonly notificationModel: Model<Notification>,
        private readonly configService: ConfigService
    ) {
        const vapidKeys = getWebPushConfig(configService)
        webPush.setVapidDetails(
            'mailto:ask@pt.dilacraft.ru',
            vapidKeys.publicKey,
            vapidKeys.privateKey
        )
    }

    async save(
        userId: string,
        subscription: ISubscriptionNotification
    ): Promise<NotificationDocument> {
        return new this.notificationModel({
            userId,
            subscription
        }).save()
    }

    async send(userId: string, payload: IPayloadType) {
        const subscriptions = await this.notificationModel.find({userId}).exec()
        const results = []

        for (const sub of subscriptions) {
            try {
                await webPush.sendNotification(
                    sub.subscription,
                    JSON.stringify(payload)
                )

                results.push({status: 'success', subscription: sub})
            } catch (error) {
                if (error.statusCode === 410 || error.statusCode === 404) {
                    await this.notificationModel
                        .deleteOne({_id: sub._id})
                        .exec()
                }

                results.push({status: 'failed', subscription: sub, error})
            }
        }
        return results
    }

    getPublicKey() {
        return getWebPushConfig(this.configService).publicKey
    }
}
