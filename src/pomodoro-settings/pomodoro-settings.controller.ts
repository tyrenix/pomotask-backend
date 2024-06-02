import {
    Body,
    Controller,
    HttpCode,
    Patch,
    UsePipes,
    ValidationPipe
} from '@nestjs/common'
import {PomodoroSettingsService} from '@src/pomodoro-settings/pomodoro-settings.service'
import {Auth} from '@src/auth/decorators/auth.decorator'
import {GetUserIdDecorator} from '@src/auth/decorators/get-user-id.decorator'
import {
    PtSettingsDto,
    toPtSettingsDto
} from '@src/pomodoro-settings/dto/pt-settings.dto'
import {UpdatePtSettingsDto} from '@src/pomodoro-settings/dto/update-pt-settings.dto'

@Controller('pomodoro-settings')
export class PomodoroSettingsController {
    constructor(
        private readonly pomodoroSettingsService: PomodoroSettingsService
    ) {}

    @Patch('update')
    @HttpCode(200)
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    @Auth()
    async updateByUserId(
        @GetUserIdDecorator() userId: string,
        @Body() dto: UpdatePtSettingsDto
    ): Promise<PtSettingsDto> {
        const updatedPtSettings =
            await this.pomodoroSettingsService.updateByUserId(userId, dto)

        return toPtSettingsDto(updatedPtSettings)
    }
}
