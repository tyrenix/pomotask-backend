import {
    Body,
    Controller,
    Get,
    HttpCode,
    Patch,
    UsePipes,
    ValidationPipe
} from '@nestjs/common'
import {UserService} from '@src/user/user.service'
import {Auth} from '@src/auth/decorators/auth.decorator'
import {GetUserIdDecorator} from '@src/auth/decorators/get-user-id.decorator'
import {UpdateUserDto} from '@src/user/dto/update-user.dto'
import {toUserDto, UserDto} from '@src/user/dto/user.dto'

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Patch('update')
    @HttpCode(200)
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    @Auth()
    async updateById(
        @GetUserIdDecorator() userId: string,
        @Body() dto: UpdateUserDto
    ): Promise<UserDto> {
        const updatedUser = await this.userService.updateById(userId, dto)
        return toUserDto(updatedUser)
    }

    @Get()
    @HttpCode(200)
    @Auth()
    async getById(@GetUserIdDecorator() userId: string): Promise<UserDto> {
        const user = await this.userService.getById(userId)
        return toUserDto(user)
    }
}
