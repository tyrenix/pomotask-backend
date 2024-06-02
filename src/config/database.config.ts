import {ConfigService} from '@nestjs/config'

export const getDatabaseConfig = (
    configService: ConfigService
): {uri: string} => ({
    uri: configService.get('MONGODB_URI')
})
