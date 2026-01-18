import { IRoomType } from './roomType.interface'

export interface IRoom {
  id: string
  roomNumber: string
  roomTypeId: string
  hkStatus: string
  isOccupied: boolean
  outletId: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  roomType: IRoomType
}
