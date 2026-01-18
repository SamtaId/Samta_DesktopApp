/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useState } from 'react'
import { AxiosError } from 'axios'
import { useNotifier } from '@renderer/components/core/NotificationProvider'
import { IErrorResponse } from '@renderer/interface/response.interface'
import AuthService from '@renderer/services/authService'
import { IPayloadSendOtp } from '@renderer/interface/auth.interface'
import { useNavigate } from 'react-router-dom'

export const useIndex = () => {
  const authService = AuthService()
  const notifier = useNotifier()
  const navigate = useNavigate()

  const [formLogin, setFormLogin] = useState<IPayloadSendOtp>({
    email: '',
    password: ''
  })
  const [stepPage, setStepPage] = useState(1)

  const [errorFormLogin, setErrorFormLogin] = useState<{
    [key: string]: string
  }>({})

  const [loading, setLoading] = useState({ submit: false })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormLogin((prev) => ({ ...prev, [name]: value }))
    setErrorFormLogin((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSendOtpLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newErrors: { [key: string]: string } = {}
    if (!formLogin.email.trim()) {
      newErrors.email = 'email wajib diisi. '
    }

    if (!formLogin.password) {
      newErrors.password = 'Password wajib diisi.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrorFormLogin(newErrors)
      return
    }

    setLoading({ submit: true })

    try {
      const response = await authService.sendOtpAuth(formLogin)
      if (response.status) {
        notifier.show({
          message: 'otp berhasil dikirim',
          description: response.message || '',
          severity: 'success'
        })
        setStepPage(2)
      } else {
        notifier.show({
          message: 'Login Gagal',
          description: 'Username atau password yang Anda masukkan salah.',
          severity: 'error'
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>
      const message = axiosError.response?.data?.message || 'Terjadi kesalahan pada server!'
      notifier.show({
        message: 'Login Gagal',
        description: message,
        severity: 'error'
      })
    } finally {
      setLoading({ submit: false })
    }
  }

  const handleVerifyOtpLogin = async (otp: string) => {
    if (!formLogin.email.trim()) {
      setErrorFormLogin({ email: 'email wajib diisi.' })
      return
    }
    if (!otp || otp.length !== 6) {
      notifier.show({ message: 'OTP wajib 6 digit', severity: 'error' })
      return
    }
    setLoading({ submit: true })
    try {
      const payload = { email: formLogin.email, otpCode: otp }
      const response = await authService.verifyOtpAuth(payload)
      if (response.status) {
        notifier.show({
          message: 'Berhasil',
          description: response.message || '',
          severity: 'success'
        })
        await handleLogin()
      } else {
        notifier.show({
          message: 'OTP Salah',
          description: response.message || 'OTP yang Anda masukkan salah.',
          severity: 'error'
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>
      const message = axiosError.response?.data?.message || 'Terjadi kesalahan pada server!'
      notifier.show({
        message: 'Login Gagal',
        description: message,
        severity: 'error'
      })
    } finally {
      setLoading({ submit: false })
    }
  }

  const handleLogin = async () => {
    setLoading({ submit: true })

    try {
      const response = await authService.loginAuth(formLogin)
      if (response.status) {
        notifier.show({
          message: 'Selamat Datang Kembali',
          description: response.message || '',
          severity: 'success'
        })
        localStorage.setItem('userLogin', JSON.stringify(response.data))
        localStorage.setItem('token', response.data!.access_token)
        localStorage.setItem('outletId', response.data!.currentOutlet.id)
        localStorage.setItem('outletName', response.data!.currentOutlet.name)
        navigate('/')
      } else {
        notifier.show({
          message: 'Login Gagal',
          description: 'Username atau password yang Anda masukkan salah.',
          severity: 'error'
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>
      const message = axiosError.response?.data?.message || 'Terjadi kesalahan pada server!'
      notifier.show({
        message: 'Login Gagal',
        description: message,
        severity: 'error'
      })
    } finally {
      setFormLogin((prev) => ({ ...prev, password: '' }))
      setLoading({ submit: false })
    }
  }

  return {
    formLogin,
    handleChange,
    handleSendOtpLogin,
    handleVerifyOtpLogin,
    loading,
    errorFormLogin,
    stepPage,
    setStepPage
  }
}
