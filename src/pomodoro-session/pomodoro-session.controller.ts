import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    InternalServerErrorException,
    Param,
    Patch,
    Post,
    Query,
    UsePipes,
    ValidationPipe
} from '@nestjs/common'
import {Auth} from '@src/auth/decorators/auth.decorator'
import {GetUserIdDecorator} from '@src/auth/decorators/get-user-id.decorator'
import {CreatePtSessionDto} from '@src/pomodoro-session/dto/create-pt-session.dto'
import {ListPtSessionDto} from '@src/pomodoro-session/dto/list-pt-session.dto'
import {
    PtSessionDto,
    toPtSessionDto
} from '@src/pomodoro-session/dto/pt-session.dto'

import {PomodoroSessionService} from '@src/pomodoro-session/pomodoro-session.service'
import {isValidObjectId} from 'mongoose'
import {ActivityFiltersPtSessionDto} from './dto/activity-filters-pt-session.dto'
import {UpdatePtSessionDto} from './dto/update-pt-session.dto'

@Controller('pomodoro-session')
export class PomodoroSessionController {
    constructor(
        private readonly pomodoroSessionService: PomodoroSessionService
    ) {}

    @Post('create')
    @HttpCode(200)
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    @Auth()
    async create(
        @GetUserIdDecorator() userId: string,
        @Body() dto: CreatePtSessionDto
    ): Promise<PtSessionDto> {
        const ptSession = await this.pomodoroSessionService.create(userId, dto)

        if (!ptSession) {
            throw new InternalServerErrorException(
                'Error create pomodoro session'
            )
        }

        return toPtSessionDto(ptSession)
    }

    @Get('active')
    @HttpCode(200)
    @Auth()
    async getActivePomodoro(
        @GetUserIdDecorator() userId: string
    ): Promise<PtSessionDto | null> {
        const ptSession =
            await this.pomodoroSessionService.getActivePomodoro(userId)

        return !ptSession ? null : toPtSessionDto(ptSession)
    }

    @Patch('pause')
    @HttpCode(200)
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    @Auth()
    async pause(
        @GetUserIdDecorator() userId: string,
        @Body() dto: UpdatePtSessionDto
    ): Promise<PtSessionDto> {
        if (!isValidObjectId(dto.id)) {
            throw new BadRequestException('Invalid pomodoro session id')
        }

        const ptSession = await this.pomodoroSessionService.pause(
            userId,
            dto.id
        )

        return toPtSessionDto(ptSession)
    }

    @Patch('completion')
    @HttpCode(200)
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    @Auth()
    async completion(
        @GetUserIdDecorator() userId: string,
        @Body() dto: UpdatePtSessionDto
    ): Promise<PtSessionDto> {
        if (!isValidObjectId(dto.id)) {
            throw new BadRequestException('Invalid pomodoro session id')
        }

        const ptSession = await this.pomodoroSessionService.completion(
            userId,
            dto.id
        )

        return toPtSessionDto(ptSession)
    }

    @Get('list')
    @HttpCode(200)
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    @Auth()
    async list(
        @GetUserIdDecorator() userId: string,
        @Query() filters: ListPtSessionDto
    ): Promise<PtSessionDto[]> {
        const ptSessions = await this.pomodoroSessionService.list(
            userId,
            filters
        )

        return ptSessions.map(ptSession => toPtSessionDto(ptSession))
    }

    @Get('activity')
    @HttpCode(200)
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    @Auth()
    async getActivity(
        @GetUserIdDecorator() userId: string,
        @Query() filters: ActivityFiltersPtSessionDto
    ): Promise<{activity: number}> {
        const activity = await this.pomodoroSessionService.getActivity(
            userId,
            filters
        )

        return {activity}
    }

    @Get(':ptSessionId')
    @HttpCode(200)
    @Auth()
    async getById(
        @GetUserIdDecorator() userId: string,
        @Param('ptSessionId') ptSessionId: string
    ): Promise<PtSessionDto> {
        if (!isValidObjectId(ptSessionId)) {
            throw new BadRequestException('Invalid pomodoro session id')
        }

        const ptSession = await this.pomodoroSessionService.getById(
            userId,
            ptSessionId
        )

        return toPtSessionDto(ptSession)
    }

    @Delete(':ptSessionId')
    @HttpCode(200)
    @Auth()
    async deleteById(
        @GetUserIdDecorator() userId: string,
        @Param('ptSessionId') ptSessionId: string
    ): Promise<{success: true}> {
        if (!isValidObjectId(ptSessionId)) {
            throw new BadRequestException('Invalid pomodoro session id')
        }

        await this.pomodoroSessionService.deleteById(userId, ptSessionId)
        return {success: true}
    }
}
