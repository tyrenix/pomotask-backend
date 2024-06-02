import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {
    PomodoroSettings,
    PomodoroSettingsSchema
} from '@src/schemas/pomodoro-settings.schema'
import {PomodoroSettingsService} from '@src/pomodoro-settings/pomodoro-settings.service'
import {PomodoroSettingsController} from '@src/pomodoro-settings/pomodoro-settings.controller'

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: PomodoroSettings.name,
                schema: PomodoroSettingsSchema
            }
        ])
    ],
    controllers: [PomodoroSettingsController],
    providers: [PomodoroSettingsService],
    exports: [PomodoroSettingsService]
})
export class PomodoroSettingsModule {}
