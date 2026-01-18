export interface ITables {
  id: string
  name: string
  capacity: number
  totalRooms: number
  outletId: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  externalId: string | null
  bathrooms: number | null
  bedCount: number | null
  bedType: string | null
  description: string | null
  maxOccupancy: number | null
  size: number | null
}
