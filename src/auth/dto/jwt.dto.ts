export class JwtDto {
    userId: string
    sessionId: string
    type: 'access' | 'refresh'
}
