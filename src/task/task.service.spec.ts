import {Test, TestingModule} from '@nestjs/testing'
import {TaskService} from './task.service'

describe('TaskService', () => {
    let service: TaskService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TaskService]
        }).compile()

        service = module.get<TaskService>(TaskService)
    })

    it('should be defined', async () => {
        expect(service).toBeDefined()
        expect(await service.task()).toEqual({success: true})
    })
})
