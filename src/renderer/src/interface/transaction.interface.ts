import { IProduct } from './product.interface'
import { IReservation } from './reservation.interface'

export interface ITransaction {
  id: string
  nomor: string
  date: Date
  reservationId: string
  totalAmount: number
  discount: number
  tax: number
  grandTotal: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  outletId: string
  status: string
  cancelledAt: Date | null
  cancelReason: string | null
  xenditInvoiceId: string | null
  type: string
  xenditInvoiceUrl: string | null
  depositAmount: number
  usedDeposit: number
  customerId: string | null
  installmentPlanId: string | null
  paymentProvider: string | null
  tripayPayUrl: string | null
  tripayReference: string | null
  midtransOrderId: string | null
  midtransRedirectUrl: string | null
  midtransToken: string | null
  cashAmount: number
  changeAmount: number
  commissionAmount: number
  customerName: string | null
  paidAmount: number
  description: string | null
  cargoShipmentId: string | null
  createdById: string | null
  userId: string | null
  salesRouteId: string | null
  items: ITransactionItem[]
  product: IProduct
  payments: unknown[]
  PaymentHistory: IPaymentHistoryTransaction[]
  tables: ITableTransaction[]
  reservation: IReservation
}

export interface ITransactionItem {
  id: string
  transactionId: string
  productId: string
  quantity: number
  productVariantId: string | null
  price: number
  total: number
  notes: string | null
  productVariantName: string | null
  cancelledAt: Date | null
  status: string
  createdAt: Date
  updatedAt: Date
  costPrice: number
  productName: string
  productSku: string
  unitId: string | null
  unitName: string
  isConsignment: boolean
  supplierAmount: number | null
  supplierId: string | null
}

export interface IPaymentHistoryTransaction {
  id: string
  transactionId: string
  amount: number
  paidAt: Date
  createdAt: Date
  createdById: string | null
  method: string
  status: string
  eventId: string | null
  note: string | null
  provider: string | null
  raw: string | null
  bankCode: string | null
  channel: string | null
  attachmentUrl: string | null
}

export interface IPayloadTransaction {
  tableIds?: string[]
  roomId?: string
  outletId: string
  payments: IPayments[]
  items: IItems[]
  discountType?: string
  discount?: number
  tax?: number
}

export interface IPayments {
  method: string
  amount: number
}
export interface IItems {
  productId: string
  quantity: number
}

export interface ICreateTransactionResponse {
  transaction: Pick<ITransaction, 'id' | 'status' | 'nomor'> & {
    xenditInvoice: string | null
  }
}

export interface ITableTransaction {
  id: string
  name: string
}
