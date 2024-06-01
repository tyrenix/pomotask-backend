import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {
    PomodoroSession,
    PomodoroSessionSchema
} from '@src/schemas/pomodoro-session.schema'
import {PomodoroSessionController} from '@src/pomodoro-session/pomodoro-session.controller'
import {PomodoroSessionService} from '@src/pomodoro-session/pomodoro-session.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: PomodoroSession.name, schema: PomodoroSessionSchema}
        ])
    ],
    controllers: [PomodoroSessionController],
    providers: [PomodoroSessionService]
})
export class PomodoroSessionModule {}
