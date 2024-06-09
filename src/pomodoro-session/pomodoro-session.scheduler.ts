import {Injectable} from '@nestjs/common'
import {PomodoroSessionService} from './pomodoro-session.service'
import {Cron} from '@nestjs/schedule'

@Injectable()
export class PomodoroSessionScheduler {
    constructor(
        private readonly pomodoroSessionService: PomodoroSessionService
    ) {}

    @Cron('*/10 * * * * *')
    async findCompletions() {
        this.pomodoroSessionService.findCompletions()
    }
}
