import {ConfigService} from '@nestjs/config'

export const getDomainConfig = (configService: ConfigService) => ({
    domain: configService.get('DOMAIN')
})
