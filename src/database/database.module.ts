import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {getDatabaseConfig} from '@src/config/database.config'

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getDatabaseConfig
        })
    ]
})
export class DatabaseModule {}
