import {
    Body,
    Controller,
    HttpCode,
    Post,
    Res,
    UsePipes,
    ValidationPipe
} from '@nestjs/common'
import type {Response} from 'express'
import {AuthService} from './auth.service'
import {toUserDto} from '@src/user/dto/user.dto'
import {AuthDto} from '@src/auth/dto/auth.dto'
import {CreatedDto, toCreatedDto} from '@src/auth/dto/created.dto'
import {Auth} from '@src/auth/decorators/auth.decorator'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @HttpCode(200)
    @UsePipes(new ValidationPipe())
    async register(
        @Res({passthrough: true}) res: Response,
        @Body() dto: AuthDto
    ): Promise<CreatedDto> {
        const {user, tokens} = await this.authService.register(dto)

        this.authService.addRefreshTokenToResponse(res, tokens.refreshToken)

        return toCreatedDto({
            ...toUserDto(user),
            accessToken: tokens.accessToken
        })
    }

    @Post('login')
    @Auth()
    @HttpCode(200)
    async login() {
        return 'Hello world'
    }
}
