import {Controller} from '@nestjs/common'
import {PomodoroSessionService} from '@src/pomodoro-session/pomodoro-session.service'

@Controller('pomodoro-session')
export class PomodoroSessionController {
    constructor(
        private readonly pomodoroSessionService: PomodoroSessionService
    ) {}
}
