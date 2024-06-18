import type {ConfigService} from '@nestjs/config'

export const getWebPushConfig = (configService: ConfigService) => ({
    publicKey: configService.get('WEB_PUSH_PUBLIC_KEY'),
    privateKey: configService.get('WEB_PUSH_PRIVATE_KEY')
})
