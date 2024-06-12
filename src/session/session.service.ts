import {InjectRedis} from '@nestjs-modules/ioredis'
import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common'
import {SessionDto} from '@src/session/dto/session.dto'
import Redis from 'ioredis'
import {Types as MongooseTypes} from 'mongoose'

@Injectable()
export class SessionService {
    readonly SESSION_PREFIX = 'session'

    constructor(@InjectRedis() private readonly redisService: Redis) {}

    async create(sessionData: SessionDto, ttl: number): Promise<{id: string}> {
        const sessionId = new MongooseTypes.ObjectId().toString()

        sessionData.createdAt = Math.floor(Date.now() / 1e3)

        const result = await this.redisService.set(
            `${this.SESSION_PREFIX}:${sessionData.userId}:${sessionId}`,
            JSON.stringify(sessionData),
            'EX',
            ttl
        )
        if (result !== 'OK') {
            throw new InternalServerErrorException('Error when open session')
        }

        return {id: sessionId}
    }

    async getById(userId: string, sessionId: string): Promise<SessionDto> {
        const result: SessionDto | undefined | null = JSON.parse(
            await this.redisService.get(
                `${this.SESSION_PREFIX}:${userId}:${sessionId}`
            )
        )
        console.log(result, `${this.SESSION_PREFIX}:${userId}:${sessionId}`)

        if (!result) {
            throw new NotFoundException('Not found session')
        }

        return result
    }

    async validate(userId: string, sessionId: string): Promise<SessionDto> {
        const result: SessionDto | undefined | null = JSON.parse(
            await this.redisService.get(
                `${this.SESSION_PREFIX}:${userId}:${sessionId}`
            )
        )

        console.log(result)

        if (!result || !result.userId) {
            throw new UnauthorizedException('Not found session')
        }

        return result
    }

    async updateExpirationDate(userId: string, sessionId: string, ttl: number) {
        return this.redisService.expire(
            `${this.SESSION_PREFIX}:${userId}:${sessionId}`,
            ttl
        )
    }

    async close(userId: string, sessionId: string) {
        return this.redisService.del(
            `${this.SESSION_PREFIX}:${userId}:${sessionId}`
        )
    }

    async closeAll(userId: string) {
        const keys = Object.keys(await this.list(userId)).map(
            key => `${this.SESSION_PREFIX}:${userId}:${key}`
        )

        return this.redisService.del(keys)
    }

    async list(userId: string): Promise<Record<'string', SessionDto>> {
        const _pattern = `${this.SESSION_PREFIX}:${userId}:*` as const
        const sessions: Record<string, SessionDto> = {}

        const keys = await this.redisService.keys(_pattern)
        for (const key of keys) {
            const sessionData = await this.redisService.get(key)
            if (sessionData) {
                sessions[key.split(':').pop()] = JSON.parse(sessionData)
            }
        }

        return sessions
    }
}
