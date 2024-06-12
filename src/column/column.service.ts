import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Column, ColumnDocument} from '../schemas/column.schema'
import {Model} from 'mongoose'
import {ColumnUpdateDto} from './dto/column-update.dto'

@Injectable()
export class ColumnService {
    constructor(
        @InjectModel(Column.name) private readonly columnModel: Model<Column>
    ) {}

    async create(
        userId: string,
        projectId: string,
        dto: ColumnUpdateDto
    ): Promise<ColumnDocument> {
        return new this.columnModel({
            ...dto,
            projectId,
            userId
        }).save()
    }

    async getById(
        userId: string,
        projectId: string,
        columnId: string
    ): Promise<ColumnDocument> {
        return this.columnModel.findOne({_id: columnId, userId, projectId})
    }

    async getByProjectId(
        userId: string,
        projectId: string
    ): Promise<ColumnDocument[]> {
        return this.columnModel.find({userId, projectId}).exec()
    }

    /**
     * Get default column for project
     */
    async getDCForProject(
        userId: string,
        projectId: string
    ): Promise<ColumnDocument> {
        return this.columnModel
            .findOne({userId, projectId})
            .sort({createdAt: 1})
            .exec()
    }
}
