import {Test, TestingModule} from '@nestjs/testing'
import {TaskController} from './task.controller'
import {TaskService} from './task.service'

describe('TaskController', () => {
    let controller: TaskController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TaskController],
            providers: [TaskService]
        }).compile()

        controller = module.get<TaskController>(TaskController)
    })

    it('should be defined', async () => {
        expect(controller).toBeDefined()
        expect(await controller.task()).toEqual({success: true})
    })
})
