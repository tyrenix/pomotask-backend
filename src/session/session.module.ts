import {Module} from '@nestjs/common'
import {SessionController} from '@src/session/session.controller'
import {SessionService} from './session.service'

@Module({
    controllers: [SessionController],
    providers: [SessionService],
    exports: [SessionService]
})
export class SessionModule {}
