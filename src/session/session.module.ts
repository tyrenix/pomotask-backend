import {Module} from '@nestjs/common'
import {SessionService} from '@src/session/session.service'
import {SessionController} from '@src/session/session.controller'

@Module({
    controllers: [SessionController],
    providers: [SessionService],
    exports: [SessionService]
})
export class SessionModule {}
