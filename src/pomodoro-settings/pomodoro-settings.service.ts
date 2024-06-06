import {Model} from 'mongoose'
import {Injectable, NotFoundException} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {
    PomodoroSettings,
    PomodoroSettingsDocument
} from '@src/schemas/pomodoro-settings.schema'
import {UpdatePtSettingsDto} from '@src/pomodoro-settings/dto/update-pt-settings.dto'

@Injectable()
export class PomodoroSettingsService {
    constructor(
        @InjectModel(PomodoroSettings.name)
        private readonly pomodoroSettingsModel: Model<PomodoroSettings>
    ) {}

    async create(userId: string): Promise<PomodoroSettingsDocument> {
        return new this.pomodoroSettingsModel({userId}).save()
    }

    async get(userId: string): Promise<PomodoroSettingsDocument> {
        return this.pomodoroSettingsModel.findOne({userId}).exec()
    }

    async updateByUserId(
        userId: string,
        dto: UpdatePtSettingsDto
    ): Promise<PomodoroSettingsDocument> {
        const ptSettings = await this.pomodoroSettingsModel.findOne({
            userId
        })

        if (!ptSettings) {
            throw new NotFoundException('Not found pomodoro settings')
        }

        await ptSettings.updateOne({...dto})
        return this.pomodoroSettingsModel.findOne({userId})
    }
}
