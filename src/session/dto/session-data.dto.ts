import {Expose, plainToInstance} from 'class-transformer'

export class SessionDataDto {
    @Expose()
    userId: string

    @Expose()
    createdAt?: number

    @Expose()
    ip?: string

    @Expose()
    userAgent?: string
}

export const toSessionDataDto = (sessionData: SessionDataDto) =>
    plainToInstance(SessionDataDto, sessionData, {
        excludeExtraneousValues: true
    })
