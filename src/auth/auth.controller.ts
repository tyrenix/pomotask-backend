import {
    Body,
    Controller,
    HttpCode,
    Post,
    Res,
    Req,
    UsePipes,
    ValidationPipe,
    UnauthorizedException,
    BadRequestException
} from '@nestjs/common'
import type {Response, Request} from 'express'
import {AuthService, ETokens} from './auth.service'
import {toUserDto} from '@src/user/dto/user.dto'
import {AuthDto} from '@src/auth/dto/auth.dto'
import {AuthSuccessDto, toAuthSuccessDto} from '@src/auth/dto/auth-success.dto'
import {Auth} from './decorators/auth.decorator'
import {GetUserIdDecorator} from './decorators/get-user-id.decorator'
import {GetAuthDecorator} from './decorators/get-auth.decorator'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @HttpCode(200)
    @UsePipes(new ValidationPipe())
    async register(
        @Res({passthrough: true}) res: Response,
        @Req() req: Request,
        @Body() dto: AuthDto
    ): Promise<AuthSuccessDto> {
        const {user, tokens} = await this.authService.register({
            email: dto.email,
            password: dto.password,
            userAgent: req.headers['user-agent'],
            ip: (req.headers['x-real-ip'] as any) || req.ip || ''
        })

        this.authService.addRefreshTokenToResponse(res, tokens.refreshToken)

        return toAuthSuccessDto({
            ...toUserDto(user),
            accessToken: tokens.accessToken
        })
    }

    @Post('login')
    @HttpCode(200)
    @UsePipes(new ValidationPipe())
    async login(
        @Res({passthrough: true}) res: Response,
        @Req() req: Request,
        @Body() dto: AuthDto
    ): Promise<AuthSuccessDto> {
        const {user, tokens} = await this.authService.login({
            email: dto.email,
            password: dto.password,
            userAgent: req.headers['user-agent'],
            ip: (req.headers['x-real-ip'] as any) || req.ip || ''
        })

        this.authService.addRefreshTokenToResponse(res, tokens.refreshToken)

        return toAuthSuccessDto({
            ...toUserDto(user),
            accessToken: tokens.accessToken
        })
    }

    @Post('tokens')
    @HttpCode(200)
    async updateTokens(
        @Req() req: Request,
        @Res({passthrough: true}) res: Response
    ): Promise<{accessToken: string}> {
        const refreshTokenFromCookie = req.cookies?.[ETokens.refresh]
        if (!refreshTokenFromCookie) {
            this.authService.deleteRefreshTokenFromResponse(res)
            throw new UnauthorizedException('Refresh token not passed')
        }

        const {accessToken, refreshToken} = await this.authService.getNewTokens(
            refreshTokenFromCookie
        )

        this.authService.addRefreshTokenToResponse(res, refreshToken)

        return {accessToken}
    }

    @Post('logout')
    @HttpCode(200)
    @Auth()
    async logout(
        @Req() req: Request,
        @Res({passthrough: true}) res: Response,
        @GetUserIdDecorator() userId: string,
        @GetAuthDecorator() auth
    ): Promise<{success: true}> {
        this.authService.deleteRefreshTokenFromResponse(res)

        const sessionId: string = auth?.jwt?.sessionId
        if (!sessionId) {
            throw new BadRequestException('Invalid session id')
        }

        await this.authService.logout(userId, sessionId)
        return {success: true}
    }
}
