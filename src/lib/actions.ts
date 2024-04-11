export interface ActionResponse<T> {
  data: T
  status: boolean
  message?: string
}
