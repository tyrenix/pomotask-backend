import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {Project, ProjectSchema} from '@src/schemas/project.schema'
import {ProjectController} from './project.controller'
import {ProjectService} from './project.service'
import {ColumnModule} from '../column/column.module'

@Module({
    imports: [
        ColumnModule,
        MongooseModule.forFeature([{name: Project.name, schema: ProjectSchema}])
    ],
    controllers: [ProjectController],
    providers: [ProjectService],
    exports: [ProjectService]
})
export class ProjectModule {}
