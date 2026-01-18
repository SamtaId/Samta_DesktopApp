export interface IMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface IResponse<T = unknown> {
  message: string
  status_code: number
  status: boolean
  error: string
  data?: T
  meta?: IMeta
}

export interface IErrorResponse {
  status_code: number
  message: string
  error?: Record<string, string[]> // opsional kalau ada detail error field
}
