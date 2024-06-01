import {isValidObjectId} from 'mongoose'
import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    InternalServerErrorException,
    Param,
    Patch,
    Post,
    UsePipes,
    ValidationPipe
} from '@nestjs/common'
import {PomodoroSessionService} from '@src/pomodoro-session/pomodoro-session.service'
import {Auth} from '@src/auth/decorators/auth.decorator'
import {GetUserIdDecorator} from '@src/auth/decorators/get-user-id.decorator'
import {
    CreatePtSessionDto,
    toCreatePtSessionDto
} from '@src/pomodoro-session/dto/create-pt-session.dto'
import {
    PtSessionDto,
    toPtSessionDto
} from '@src/pomodoro-session/dto/pt-session.dto'
import {PomodoroSessionType} from '@src/schemas/pomodoro-session.schema'
import {
    UpdatePtSessionDto,
    toUpdatePtSessionDto
} from '@src/pomodoro-session/dto/update-pt-session.dto'

@Controller('pomodoro-session')
export class PomodoroSessionController {
    constructor(
        private readonly pomodoroSessionService: PomodoroSessionService
    ) {}

    @Post('create')
    @HttpCode(200)
    @UsePipes(new ValidationPipe())
    @Auth()
    async create(
        @GetUserIdDecorator() userId: string,
        @Body() dto: CreatePtSessionDto
    ): Promise<PtSessionDto> {
        if (
            !(
                ['work', 'shortBreak', 'longBreak'] as PomodoroSessionType[]
            ).includes(dto.type)
        ) {
            throw new BadRequestException(
                'Pomodoro session type, may be only "work" | "shortBreak" | "longBreak"'
            )
        }

        const ptSession = await this.pomodoroSessionService.create(
            userId,
            toCreatePtSessionDto(dto)
        )

        if (!ptSession) {
            throw new InternalServerErrorException(
                'Error create pomodoro session'
            )
        }

        return toPtSessionDto(ptSession)
    }

    @Patch(':ptSessionId')
    @HttpCode(200)
    @UsePipes(new ValidationPipe())
    @Auth()
    async updateById(
        @GetUserIdDecorator() userId: string,
        @Param('ptSessionId') ptSessionId: string,
        @Body() dto: UpdatePtSessionDto
    ): Promise<PtSessionDto> {
        if (!isValidObjectId(ptSessionId)) {
            throw new BadRequestException('Invalid pomodoro session id')
        }

        const ptSession = await this.pomodoroSessionService.updateById(
            userId,
            ptSessionId,
            toUpdatePtSessionDto(dto)
        )

        return toPtSessionDto(ptSession)
    }
}