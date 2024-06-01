import Redis from 'ioredis'
import {Types as MongooseTypes} from 'mongoose'
import {
    Injectable,
    InternalServerErrorException,
    UnauthorizedException
} from '@nestjs/common'
import {InjectRedis} from '@nestjs-modules/ioredis'

@Injectable()
export class SessionService {
    constructor(@InjectRedis() private readonly redisService: Redis) {}

    async create(userId: string): Promise<string> {
        const sessionId = new MongooseTypes.ObjectId().toString()

        const result = await this.redisService.set(
            `session:${sessionId}`,
            JSON.stringify({userId}),
            'EX',
            100
        )
        if (result !== 'OK') {
            throw new InternalServerErrorException('Error when open session')
        }

        return sessionId
    }

    async validate(sessionId: string) {
        const result = JSON.parse(
            await this.redisService.get(`session:${sessionId}`)
        )

        if (!result || !result.userId) {
            throw new UnauthorizedException('Session expire')
        }

        return result
    }
}
