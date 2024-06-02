import {UseGuards} from '@nestjs/common'
import {JwtGuard} from '@src/auth/guards/jwt.guard'

export const Auth = () => UseGuards(JwtGuard)
