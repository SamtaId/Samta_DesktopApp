export interface IReservation {
  id: string
  guestName: string
  guestPhone: string
  guestEmail: string
  identityType: string
  identityNumber: string
  checkInDate: string
  checkOutDate: Date
  status: string
  paidAmount: number
  createdAt: Date
  updatedAt: Date
  outletId: string
  reservationNumber: string
  reservationChannelId: string
  notes: string
  otaRawPayload: unknown
  otaReservationId: string
  grandTotal: number
  subTotal: number
  customerId: string | null
  paymentMethodActual: string | null
  discount: number
  tax: number
  paymentMethod: string
  deletedAt: Date | null
  corporateId: string | null
  cancelledAt: Date | null
  cancelReason: string | null
  guestSignature: string | null
  preCheckinCompletedAt: Date | null
  preCheckinQrCode: string | null
  termsAccepted: boolean
  covidPolicyAccepted: boolean
  createdById: string | null
  commissionAmount: number
  netAmount: number | null
}
