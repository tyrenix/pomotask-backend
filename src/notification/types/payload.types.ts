export interface IPayloadType {
    title: string
    body?: string
    icon?: string
    data?: any
    actions?: IActionType[]
    badge?: string
    vibrate?: number[]
    sound?: string
}

interface IActionType {
    action: string
    title: string
    icon?: string
}
