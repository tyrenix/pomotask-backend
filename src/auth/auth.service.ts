import * as argon2 from 'argon2'
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException
} from '@nestjs/common'
import type {Response} from 'express'
import {UserService} from '@src/user/user.service'
import {AuthDto} from '@src/auth/dto/auth.dto'
import {JwtService} from '@nestjs/jwt'
import {JwtDto} from '@src/auth/dto/jwt.dto'
import {UserDocument} from '@src/schemas/user.schema'
import {ConfigService} from '@nestjs/config'
import {getDomainConfig} from '@config/domain.config'
import {SessionService} from '@src/session/session.service'

export enum ETokens {
    access = 'accessToken',
    refresh = 'refreshToken'
}

@Injectable()
export class AuthService {
    readonly EXPIRE_DAY_REFRESH_TOKEN = 30
    readonly REFRESH_TOKEN_NAME = ETokens.refresh

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly sessionService: SessionService
    ) {}

    async register(
        dto: AuthDto
    ): Promise<{user: UserDocument; tokens: Record<ETokens, string>}> {
        const isExist = await this.userService.getByEmail(dto.email)
        if (isExist) {
            throw new BadRequestException('User already exist')
        }

        const user = await this.userService.create(dto)
        if (!user) {
            throw new InternalServerErrorException('Error when created user')
        }

        const session = await this.sessionService.create(
            {
                userId: user.id,
                userAgent: dto.userAgent,
                ip: dto.ip
            },
            this.EXPIRE_DAY_REFRESH_TOKEN * 24 * 60 * 60
        )

        const tokens = this.issueTokens({
            userId: user.id,
            sessionId: session.id
        })

        return {
            user,
            tokens
        }
    }

    async login(
        dto: AuthDto
    ): Promise<{user: UserDocument; tokens: Record<ETokens, string>}> {
        const findUser = await this.userService.getByEmail(dto.email)
        if (!findUser) {
            throw new BadRequestException('Invalid password or email')
        }

        const isVerify = await argon2.verify(findUser.password, dto.password)
        if (!isVerify) {
            throw new BadRequestException('Invalid password or email')
        }

        const session = await this.sessionService.create(
            {
                userId: findUser.id,
                userAgent: dto.userAgent,
                ip: dto.ip
            },
            this.EXPIRE_DAY_REFRESH_TOKEN * 24 * 60 * 60
        )

        const tokens = this.issueTokens({
            userId: findUser.id,
            sessionId: session.id
        })

        return {user: findUser, tokens}
    }

    private issueTokens(data: Omit<JwtDto, 'type'>): Record<ETokens, string> {
        const accessPayload: JwtDto = {...data, type: 'access'}
        const accessToken = this.jwtService.sign(accessPayload, {
            expiresIn: '15min'
        })

        const refreshPayload: JwtDto = {...data, type: 'refresh'}
        const refreshToken = this.jwtService.sign(refreshPayload, {
            expiresIn: `${this.EXPIRE_DAY_REFRESH_TOKEN}day`
        })

        return {accessToken, refreshToken}
    }

    async getNewTokens(refreshToken: string): Promise<Record<ETokens, string>> {
        const result: JwtDto | undefined | null = await this.jwtService
            .verifyAsync(refreshToken)
            .catch(() => {})

        if (!result || result.type !== 'refresh') {
            throw new UnauthorizedException('Invalid refresh token')
        }

        await this.sessionService.validate(result.userId, result.sessionId)
        await this.sessionService.updateExpirationDate(
            result.userId,
            result.sessionId,
            this.EXPIRE_DAY_REFRESH_TOKEN * 24 * 60 * 60
        )

        const tokens = this.issueTokens({
            userId: result.userId,
            sessionId: result.sessionId
        })

        return tokens
    }

    async logout(refreshToken: string) {
        const result: JwtDto | undefined | null = await this.jwtService
            .verifyAsync(refreshToken)
            .catch(() => {})

        if (!result || result.type !== 'refresh') {
            throw new UnauthorizedException('Invalid refresh token')
        }

        return this.sessionService.close(result.userId, result.sessionId)
    }

    addRefreshTokenToResponse(res: Response, refreshToken: string) {
        const expiresIn = new Date()
        expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

        res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
            httpOnly: true,
            // domain: getDomainConfig(this.configService).domain,
            // sameSite: 'lax',
            // secure: true,
            expires: expiresIn
        })
    }

    deleteRefreshTokenFromResponse(res: Response) {
        res.cookie(this.REFRESH_TOKEN_NAME, '', {expires: new Date(0)})
    }
}
