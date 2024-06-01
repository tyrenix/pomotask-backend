import {Model} from 'mongoose'
import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {
    PomodoroSettings,
    PomodoroSettingsDocument
} from '@src/schemas/pomodoro-settings.schema'

@Injectable()
export class PomodoroSettingsService {
    constructor(
        @InjectModel(PomodoroSettings.name)
        private readonly pomodoroSettingsModel: Model<PomodoroSettings>
    ) {}

    async create(userId: string): Promise<PomodoroSettingsDocument> {
        return new this.pomodoroSettingsModel({userId}).save()
    }
}
