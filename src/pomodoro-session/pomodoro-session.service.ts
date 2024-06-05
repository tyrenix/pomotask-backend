import {Model} from 'mongoose'
import {
    BadRequestException,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import dateFns from 'date-fns'
import {
    PomodoroSession,
    PomodoroSessionDocument
} from '@src/schemas/pomodoro-session.schema'
import {CreatePtSessionDto} from '@src/pomodoro-session/dto/create-pt-session.dto'
import {UpdatePtSessionDto} from '@src/pomodoro-session/dto/update-pt-session.dto'
import {ListPtSessionDto} from '@src/pomodoro-session/dto/list-pt-session.dto'
import {IsBoolean} from 'class-validator'
import {PtSessionDto} from '@src/pomodoro-session/dto/pt-session.dto'

@Injectable()
export class PomodoroSessionService {
    constructor(
        @InjectModel(PomodoroSession.name)
        private readonly pomodoroSessionModel: Model<PomodoroSession>
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

        return new this.pomodoroSessionModel({userId, ...dto}).save()
    }

    async updateById(
        userId: string,
        ptSessionId: string,
        dto: UpdatePtSessionDto
    ): Promise<PomodoroSessionDocument> {
        const ptSession = await this.pomodoroSessionModel.findOne({
            _id: ptSessionId,
            userId
        })

        if (!ptSession) {
            throw new NotFoundException('Pomodoro session not found')
        }

        if (ptSession.isCompleted) {
            throw new BadRequestException(
                'You cannot update a completed pomodoro session'
            )
        }

        await ptSession.updateOne({...dto})

        return this.pomodoroSessionModel.findOne({_id: ptSessionId, userId})
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
            .find(query)
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
        filter: 'week' | 'month'
    ): Promise<number> {
        const createdAtFilters: any = {}
        if (filter === 'week') {
            createdAtFilters.$gte = dateFns.startOfWeek(new Date(), {
                weekStartsOn: 2
            })

            createdAtFilters.$lte = dateFns.endOfWeek(new Date(), {
                weekStartsOn: 2
            })
        } else {
            createdAtFilters.$gte = dateFns.startOfMonth(new Date())
            createdAtFilters.$lte = dateFns.endOfMonth(new Date())
        }

        const ptSessions = await this.pomodoroSessionModel.find({
            userId,
            isCompleted: true,
            createdAt: createdAtFilters
        })

        return ptSessions.reduce((sum, prev) => prev.totalSeconds + sum, 0)
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
