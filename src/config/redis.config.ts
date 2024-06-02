import {ConfigService} from '@nestjs/config'
import {RedisModuleOptions} from '@nestjs-modules/ioredis/dist/redis.interfaces'

export const getRedisConfig = (
    configService: ConfigService
): RedisModuleOptions => ({
    type: 'single',
    url: configService.get('REDIS_URI')
})
