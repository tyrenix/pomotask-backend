import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {Task, TaskSchema} from '@src/schemas/task.schema'
import {TaskController} from '@src/task/task.controller'
import {TaskService} from '@src/task/task.service'
import {ColumnModule} from '../column/column.module'
import {PomodoroSessionModule} from '../pomodoro-session/pomodoro-session.module'
import {ProjectModule} from '../project/project.module'

@Module({
    imports: [
        ProjectModule,
        ColumnModule,
        PomodoroSessionModule,
        MongooseModule.forFeature([{name: Task.name, schema: TaskSchema}])
    ],
    controllers: [TaskController],
    providers: [TaskService],
    exports: [TaskService]
})
export class TaskModule {}
