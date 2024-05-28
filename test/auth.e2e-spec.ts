import {Test, TestingModule} from '@nestjs/testing'
import {INestApplication} from '@nestjs/common'
import * as request from 'supertest'
import {AppModule} from '@src/app.module'

describe('AuthModule (e2e)', () => {
    let app: INestApplication

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile()

        app = moduleFixture.createNestApplication()
        await app.init()
    })

    describe('/ (GET)', () => {
        it('should return "success"', async () => {
            const response = await request(app.getHttpServer()).get('/auth')
            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual({success: true})
        })
    })

    afterAll(async () => {
        await app.close()
    })
})
