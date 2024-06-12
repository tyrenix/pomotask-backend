import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model} from 'mongoose'
import {ColumnService} from '../column/column.service'
import {Project, ProjectDocument, ProjectType} from '../schemas/project.schema'
import {ProjectUpdateDto} from './dto/project-update.dto'

@Injectable()
export class ProjectService {
    constructor(
        @InjectModel(Project.name)
        private readonly projectModel: Model<Project>,
        private readonly columnService: ColumnService
    ) {}

    async create(
        userId: string,
        dto: ProjectUpdateDto,
        type?: ProjectType
    ): Promise<ProjectDocument> {
        const project = await new this.projectModel({
            ...dto,
            userId,
            type
        }).save()

        await this.columnService.create(userId, project.id, {})

        return project
    }

    async getById(userId: string, projectId: string): Promise<ProjectDocument> {
        return this.projectModel.findOne({_id: projectId, userId}).exec()
    }

    async getByType(
        userId: string,
        type: ProjectType
    ): Promise<ProjectDocument> {
        return this.projectModel.findOne({userId, type}).exec()
    }

    async getAll(userId: string): Promise<ProjectDocument[]> {
        return this.projectModel.find({userId}).exec()
    }
}
