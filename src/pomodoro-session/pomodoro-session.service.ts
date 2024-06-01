import {Model} from 'mongoose'
import {
    BadRequestException,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {
    PomodoroSession,
    PomodoroSessionDocument
} from '@src/schemas/pomodoro-session.schema'
import {CreatePtSessionDto} from '@src/pomodoro-session/dto/create-pt-session.dto'
import {UpdatePtSessionDto} from '@src/pomodoro-session/dto/update-pt-session.dto'

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

        await ptSession.updateOne({...dto})

        return this.pomodoroSessionModel.findOne({_id: ptSessionId, userId})
    }
}
