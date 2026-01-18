/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMedia } from './media.interface'
import { IOutlet } from './outlet.interface'
import { IProductCategory } from './productCategory.interface'

export interface IProduct {
  id: string
  name: string
  sku: string
  categoryId: string
  sellingPrice: number
  costPrice: number
  isRawMaterial: boolean
  isAvailable: boolean
  createdAt: string
  updatedAt: Date
  outletId: string
  deletedAt: Date | null
  isInventoryTracked: boolean
  isForReservation: boolean
  type: string
  isRefund: boolean
  unitId: string | null
  description: string
  maxStock: number | null
  minStock: number | null
  barcode: string | null
  locationId: string | null
  consignmentPrice: number | null
  consignmentRate: number | null
  isConsignment: boolean
  supplierId: string | null
  isRoomService: false
  preparationTimeMinutes: null
  category: IProductCategory | null
  Outlet: IOutlet

  images: IMedia[]
  stock: any[]
  unit: any[]
  ProductPrice: any[]
  productUnits: any[]
  currentStock: null
  effectivePrice: number
}