import {
    BadRequestException,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {CreatePtSessionDto} from '@src/pomodoro-session/dto/create-pt-session.dto'
import {ListPtSessionDto} from '@src/pomodoro-session/dto/list-pt-session.dto'
import {
    PomodoroSession,
    PomodoroSessionDocument
} from '@src/schemas/pomodoro-session.schema'
import * as dateFns from 'date-fns'
import {Model} from 'mongoose'
import {PomodoroSettingsService} from '../pomodoro-settings/pomodoro-settings.service'
import {ActivityFiltersPtSessionDto} from './dto/activity-filters-pt-session.dto'
import {PtSessionDto} from './dto/pt-session.dto'

@Injectable()
export class PomodoroSessionService {
    constructor(
        @InjectModel(PomodoroSession.name)
        private readonly pomodoroSessionModel: Model<PomodoroSession>,
        private readonly pomodoroSettingsService: PomodoroSettingsService
    ) {}

    async create(
        userId: string,
        dto: CreatePtSessionDto
    ): Promise<PomodoroSessionDocument | null> {
        const isExistOpeningSession = await this.pomodoroSessionModel.findOne({
            userId,
            isCompleted: false
        })

        if (isExistOpeningSession) {
            throw new BadRequestException('Exist opening pomodoro session')
        }

        const ptSettings = await this.pomodoroSettingsService.get(userId)
        const [type] = await this.upcoming(userId, 1)

        const totalSeconds =
            type === 'longBreak'
                ? ptSettings.longBreak
                : type === 'shortBreak'
                  ? ptSettings.shortBreak
                  : ptSettings.pomodoro

        const completionTime = new Date()
        completionTime.setSeconds(completionTime.getSeconds() + totalSeconds)

        return new this.pomodoroSessionModel({
            userId,
            taskId: dto.taskId,
            totalSeconds,
            completionTime,
            type
        }).save()
    }

    async getActivePomodoro(userId: string): Promise<PomodoroSessionDocument> {
        const pomodoro = await this.pomodoroSessionModel
            .findOne({userId, isCompleted: false})
            .exec()

        if (!pomodoro) return null

        if (!pomodoro.isPaused) {
            let completedSeconds: number =
                pomodoro.totalSeconds -
                Math.abs(
                    Math.floor(
                        (new Date(pomodoro.completionTime).getTime() -
                            Date.now()) /
                            1e3
                    )
                )

            if (completedSeconds < 0) {
                completedSeconds = pomodoro.totalSeconds
            }

            pomodoro.completedSeconds = completedSeconds
            await pomodoro.save()
        }

        return pomodoro
    }

    async pause(
        userId: string,
        ptSessionId: string
    ): Promise<PomodoroSessionDocument> {
        const ptSession = await this.pomodoroSessionModel.findOne({
            _id: ptSessionId,
            isCompleted: false,
            userId
        })

        if (!ptSession) {
            throw new NotFoundException('Pomodoro session not found')
        }

        ptSession.isPaused = !ptSession.isPaused
        if (ptSession.isPaused) {
            let completedSeconds: number =
                ptSession.totalSeconds -
                Math.abs(
                    Math.floor(
                        (new Date(ptSession.completionTime).getTime() -
                            Date.now()) /
                            1e3
                    )
                )

            if (completedSeconds < 0) {
                completedSeconds = ptSession.totalSeconds
            }

            ptSession.completedSeconds = completedSeconds
        } else {
            const completionTime = new Date()
            completionTime.setSeconds(
                completionTime.getSeconds() +
                    (ptSession.totalSeconds - ptSession.completedSeconds)
            )

            ptSession.completionTime = completionTime
        }

        await ptSession.save()

        return ptSession
    }

    async completion(
        userId: string,
        ptSessionId: string
    ): Promise<PomodoroSessionDocument> {
        const ptSession = await this.pomodoroSessionModel.findOne({
            _id: ptSessionId,
            isCompleted: false,
            userId
        })

        if (!ptSession) {
            throw new NotFoundException('Pomodoro session not found')
        }

        let completedSeconds: number =
            ptSession.totalSeconds -
            Math.abs(
                Math.floor(
                    (new Date(ptSession.completionTime).getTime() -
                        Date.now()) /
                        1e3
                )
            )

        if (
            completedSeconds < 0 ||
            ptSession.totalSeconds - completedSeconds < 10
        ) {
            completedSeconds = ptSession.totalSeconds
        }

        ptSession.completedSeconds = completedSeconds
        ptSession.completionTime = new Date()
        ptSession.isCompleted = true
        ptSession.isPaused = false

        await ptSession.save()

        return ptSession
    }

    async upcoming(
        userId: string,
        numberOfPredictions: number = 5
    ): Promise<PtSessionDto['type'][]> {
        const ptSettings = await this.pomodoroSettingsService.get(userId)
        const ptSessions = await this.pomodoroSessionModel
            .find({userId, isCompleted: true})
            .sort({createdAt: -1})
            .select('type')
            .limit(ptSettings.longBreakFrequency * 3)

        return this.predictNextSessions({
            initialSessions: ptSessions
                .map(ptSession => ptSession.type)
                .reverse(),
            longBreakFrequency: ptSettings.longBreakFrequency,
            numberOfPredictions
        })
    }

    private predictNextSessions({
        initialSessions,
        shortBreakFrequency = 1,
        longBreakFrequency,
        numberOfPredictions
    }: {
        initialSessions: PtSessionDto['type'][]
        shortBreakFrequency?: number
        longBreakFrequency: number
        numberOfPredictions: number
    }): PtSessionDto['type'][] {
        const predictedSessions: PtSessionDto['type'][] = []
        let workCount = 0
        let lastSession: PtSessionDto['type'] | null = null

        initialSessions.forEach(session => {
            if (session === 'work') {
                workCount++
            } else if (session === 'longBreak') {
                workCount = 0
            }

            lastSession = session
        })

        for (let i = 0; i < numberOfPredictions; i++) {
            if (lastSession === 'work') {
                if (workCount > 0 && workCount % longBreakFrequency === 0) {
                    predictedSessions.push('longBreak')
                    workCount = 0
                } else if (
                    workCount > 0 &&
                    workCount % shortBreakFrequency === 0
                ) {
                    predictedSessions.push('shortBreak')
                } else {
                    predictedSessions.push('work')
                    workCount++
                }
            } else {
                predictedSessions.push('work')
                workCount++
            }

            lastSession = predictedSessions[predictedSessions.length - 1]
        }

        return predictedSessions
    }

    async findCompletions() {
        const ptSessions = await this.pomodoroSessionModel.find({
            isCompleted: false,
            isPaused: false,
            completionTime: {$lte: new Date()}
        })

        for (const ptSession of ptSessions) {
            await this.completion(ptSession.userId, ptSession.id)
        }
    }

    async list(
        userId: string,
        filters: ListPtSessionDto
    ): Promise<PomodoroSessionDocument[]> {
        const query: any = {userId}
        if (typeof filters.isCompleted === 'boolean') {
            query.isCompleted = filters.isCompleted
        }

        if (filters.taskId) {
            query.taskId = filters.taskId
        }

        return this.pomodoroSessionModel
            .find({...query, isCompleted: true})
            .sort({createdAt: -1})
            .skip(filters.page * filters.limit)
            .limit(filters.limit)
            .exec()
    }

    async getById(
        userId: string,
        ptSessionId: string
    ): Promise<PomodoroSessionDocument> {
        const ptSession = await this.pomodoroSessionModel.findOne({
            _id: ptSessionId,
            userId
        })

        if (!ptSession) {
            throw new NotFoundException('Not found pomodoro session')
        }

        return ptSession
    }

    async getActivity(
        userId: string,
        filters: ActivityFiltersPtSessionDto
    ): Promise<number> {
        const queryFilters: any = {}
        const dateNow = new Date()

        if (filters.taskId) queryFilters.taskId = filters.taskId

        if (filters.filter === 'week') {
            queryFilters.createdAt = {
                $gte: dateFns.startOfWeek(dateNow, {
                    weekStartsOn: 2
                }),
                $lte: dateFns.endOfWeek(dateNow, {
                    weekStartsOn: 2
                })
            }
        } else if (filters.filter === 'day') {
            queryFilters.createdAt = {
                $gte: dateFns.startOfDay(dateNow),
                $lte: dateFns.endOfDay(dateNow)
            }
        }

        const ptSessions = await this.pomodoroSessionModel.find({
            ...queryFilters,
            userId,
            isCompleted: true,
            type: 'work'
        })

        return ptSessions.reduce((sum, prev) => prev.completedSeconds + sum, 0)
    }

    async untieFromTask(userId: string, taskId: string) {
        return this.pomodoroSessionModel
            .updateMany({userId, taskId}, {taskId: null})
            .exec()
    }

    async deleteById(userId: string, ptSessionId: string) {
        const isCompleted = await this.pomodoroSessionModel.findOne({
            _id: ptSessionId,
            isCompleted: true,
            userId
        })

        if (isCompleted) {
            throw new BadRequestException(
                'You cannot delete a completed pomodoro session'
            )
        }

        return this.pomodoroSessionModel
            .deleteOne({_id: ptSessionId, userId})
            .exec()
    }
}
