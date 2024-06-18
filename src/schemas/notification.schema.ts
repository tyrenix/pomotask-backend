import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {HydratedDocument} from 'mongoose'

export type NotificationDocument = HydratedDocument<Notification>

export interface ISubscriptionNotification {
    endpoint: string
    keys: {
        p256dh: string
        auth: string
    }
}

@Schema({timestamps: true})
export class Notification {
    @Prop({required: true})
    userId: string

    @Prop({required: true, type: Object})
    subscription: ISubscriptionNotification
}

export const NotificationSchema = SchemaFactory.createForClass(Notification)
