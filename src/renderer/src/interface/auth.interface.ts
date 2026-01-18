import { IOutlet } from './outlet.interface'

export interface IPayloadSendOtp {
  email: string
  password: string
}

export interface IPayloadVerifyOtp {
  email: string
  otpCode: string
}

export interface IResponseLogin {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
  roleId: string
  deletedAt: Date
  refreshToken: string
  phoneNumber: string
  resetPasswordExpiry: Date
  resetPasswordToken: string
  otpMethod: string
  wordpressUserId: string
  image: string
  isInternal: boolean
  access_token: string
  refresh_token: string
  role: unknown
  accesses: Access[]
  outlets: IOutlet[]
  currentOutlet: IOutlet
}

export interface Access {
  id: number
  userId: string
  outletId: string
  roleName: string
  baseRoleId: string
  outlet: IOutlet
  featureAccesses: unknown[]
}
