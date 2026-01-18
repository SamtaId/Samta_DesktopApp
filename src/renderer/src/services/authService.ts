import { useAxiosInstance } from '@renderer/api/axiosInstance'
import {
  IPayloadSendOtp,
  IPayloadVerifyOtp,
  IResponseLogin
} from '@renderer/interface/auth.interface'
import { IResponse } from '@renderer/interface/response.interface'
import type { AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'

interface AuthService {
  sendOtpAuth: (data: IPayloadSendOtp) => Promise<IResponse<IResponseLogin>>
  verifyOtpAuth: (data: IPayloadVerifyOtp) => Promise<IResponse<IResponseLogin>>
  loginAuth: (data: IPayloadSendOtp) => Promise<IResponse<IResponseLogin>>
  logout: () => Promise<void>
}

const AuthService = (): AuthService => {
  const axiosInstance = useAxiosInstance()
  const navigate = useNavigate()

  const sendOtpAuth = async (data: IPayloadSendOtp): Promise<IResponse<IResponseLogin>> => {
    try {
      const response: AxiosResponse<IResponse<IResponseLogin>> = await axiosInstance.post(
        `auth/send-otp`,
        data
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const verifyOtpAuth = async (data: IPayloadVerifyOtp): Promise<IResponse<IResponseLogin>> => {
    try {
      const params = new URLSearchParams()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
      const response: AxiosResponse<IResponse<IResponseLogin>> = await axiosInstance.post(
        `auth/verify-otp`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const loginAuth = async (data: IPayloadSendOtp): Promise<IResponse<IResponseLogin>> => {
    try {
      const response: AxiosResponse<IResponse<IResponseLogin>> = await axiosInstance.post(
        `/auth/login`,
        data
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    localStorage.removeItem('userLogin')
    navigate('/login')
  }

  return {
    verifyOtpAuth,
    sendOtpAuth,
    loginAuth,
    logout
  }
}

export default AuthService
