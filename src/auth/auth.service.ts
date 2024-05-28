import {Injectable} from '@nestjs/common'

@Injectable()
export class AuthService {
    async auth(): Promise<{success: true}> {
        return {success: true}
    }
}
