import {Injectable} from '@nestjs/common'

@Injectable()
export class TaskService {
    async task(): Promise<{success: true}> {
        return {success: true}
    }
}
