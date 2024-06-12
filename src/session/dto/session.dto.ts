import {Expose, plainToInstance} from 'class-transformer'

export class SessionDto {
    @Expose()
    userId: string

    @Expose()
    createdAt?: number

    @Expose()
    ip?: string

    @Expose()
    userAgent?: string
}

export const toSessionDto = (sessionData: SessionDto) =>
    plainToInstance(SessionDto, sessionData, {
        excludeExtraneousValues: true
    })
