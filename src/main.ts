import {NestFactory} from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import {AppModule} from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.use(cookieParser())
    app.enableCors({
        credentials: true,
        origin: ['localhost:3000', 'http://localhost:3000', 'localhost'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
    })

    await app.listen(3000)
}

bootstrap()
