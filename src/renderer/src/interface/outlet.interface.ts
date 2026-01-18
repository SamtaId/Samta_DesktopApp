export interface IOutlet {
  id: string
  name: string
  address: string
  phone: string
  email: string | null
  groupId: string | null
  ownerId: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  slug: string
  bookandlinkPropertyId: number
  latitude: number
  longitude: number
  radius: number
  logo: string
  logoWhite: string | null
  domain: string
  splitShiftEnabled: boolean
  googleAnalyticsId: string | null
  googleTagManagerId: string | null
  balance: string
  businessTypeId: string
  taxPct: number | null
  servicePct: number | null
  requireCashierOpen: boolean
  sendOutletMessage: boolean
  isTrialActive: boolean
  isFaceRecognition: boolean
  trialStartDate: string | null
  trialEndDate: string | null
  trialDaysRemaining: number
  propertyId: string | null
  wordpressUserId: string | null
  operatingDuration: number | null
  provinceCode: string | null
  cityCode: string | null
  districtCode: string | null
  reportEmails: string[]
  businessType: IBusinessType
}

export interface IBusinessType {
  id: string
  name: string
  description: string | null
  categoryId: string
  createdAt: string
  updatedAt: string
  category: ICategoryBusinessType
}

export interface ICategoryBusinessType {
  id: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}
