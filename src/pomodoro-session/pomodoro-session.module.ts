import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {ScheduleModule} from '@nestjs/schedule'
import {PomodoroSessionController} from '@src/pomodoro-session/pomodoro-session.controller'
import {PomodoroSessionService} from '@src/pomodoro-session/pomodoro-session.service'
import {PomodoroSettingsModule} from '@src/pomodoro-settings/pomodoro-settings.module'
import {
    PomodoroSession,
    PomodoroSessionSchema
} from '@src/schemas/pomodoro-session.schema'
import {PomodoroSessionScheduler} from './pomodoro-session.scheduler'

@Module({
    imports: [
        PomodoroSettingsModule,
        ScheduleModule.forRoot(),
        MongooseModule.forFeature([
            {name: PomodoroSession.name, schema: PomodoroSessionSchema}
        ])
    ],
    controllers: [PomodoroSessionController],
    providers: [PomodoroSessionService, PomodoroSessionScheduler],
    exports: [PomodoroSessionService]
})
export class PomodoroSessionModule {}
