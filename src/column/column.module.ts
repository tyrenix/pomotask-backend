import {Module} from '@nestjs/common'
import {ColumnService} from './column.service'
import {ColumnController} from './column.controller'
import {MongooseModule} from '@nestjs/mongoose'
import {Column, ColumnSchema} from '../schemas/column.schema'

@Module({
    imports: [
        MongooseModule.forFeature([{name: Column.name, schema: ColumnSchema}])
    ],
    controllers: [ColumnController],
    providers: [ColumnService],
    exports: [ColumnService]
})
export class ColumnModule {}
