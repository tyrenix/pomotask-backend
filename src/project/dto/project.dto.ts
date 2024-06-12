import {ProjectDocument, ProjectType} from '@/src/schemas/project.schema'
import {Expose, plainToInstance, Transform} from 'class-transformer'

export class ProjectDto {
    @Expose()
    @Transform(({obj}) => obj?._id.toString(), {})
    id: string

    @Expose()
    userId: string

    @Expose()
    title?: string

    @Expose()
    type?: ProjectType
}

export const toProjectDto = (project: ProjectDocument) =>
    plainToInstance(ProjectDto, project, {excludeExtraneousValues: true})
