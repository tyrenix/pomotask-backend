import {Module} from '@nestjs/common'
import {RedisModule as IoRedisModule} from '@nestjs-modules/ioredis'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {getRedisConfig} from '@config/redis.config'

@Module({
    imports: [
        IoRedisModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getRedisConfig
        })
    ]
})
export class RedisModule {}
