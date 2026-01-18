import React, { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Container
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useIndex } from './hook'
import { useConfigStore } from '@renderer/store/configProvider'

export const LoginPage: React.FC = () => {
  const {
    formLogin,
    handleChange,
    handleSendOtpLogin,
    handleVerifyOtpLogin,
    loading,
    errorFormLogin,
    stepPage,
    setStepPage
  } = useIndex()
  const { assetsPathConfig } = useConfigStore()
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])
  const [otpError, setOtpError] = useState('')

  const handleClickShowPassword = (): void => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = (e: React.FormEvent): void => {
    void handleSendOtpLogin(e as unknown as React.FormEvent<HTMLFormElement>)
  }

  // OTP Handlers
  const handleOtpChange = (index: number, value: string): void => {
    if (!/^[0-9]?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setOtpError('')
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      setOtp((prev) => {
        const arr = [...prev]
        arr[index - 1] = ''
        return arr
      })
      inputRefs.current[index - 1]?.focus()
    }
  }
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    const pasted = e.clipboardData.getData('Text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(''))
      setOtpError('')
      setTimeout(() => inputRefs.current[5]?.focus(), 0)
    }
  }
  const handleVerifyOTP = async (): Promise<void> => {
    if (otp.some((d) => d === '')) {
      setOtpError('OTP harus 6 digit')
      return
    }
    await handleVerifyOtpLogin(otp.join(''))
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: '#f5f5f5'
      }}
    >
      {/* Left Section - Login Form */}
      {stepPage === 1 && (
        <Container
          maxWidth="sm"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            py: 4
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            {/* Logo */}
            <Box
              sx={{
                width: 64,
                height: 64,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2
              }}
            >
              <img
                src={`${assetsPathConfig}\\images\\logo.png`}
                alt="Logo"
                style={{ width: '60px' }}
              />
            </Box>

            {/* Welcome Text */}
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: '#1a1a1a'
              }}
            >
              Welcome back!
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: '#666'
              }}
            >
              Please enter your credentials to sign in!
            </Typography>

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  color: '#666',
                  fontWeight: 500
                }}
              >
                Email
              </Typography>
              <TextField
                fullWidth
                placeholder="Email"
                type="email"
                name="email"
                value={formLogin.email}
                onChange={handleChange}
                error={!!errorFormLogin.email}
                helperText={errorFormLogin.email}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    bgcolor: '#F0F0F0',
                    '& fieldset': {
                      borderColor: 'transparent'
                    },
                    '&:hover fieldset': {
                      borderColor: '#c4b896'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#c4b896'
                    }
                  }
                }}
              />

              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  color: '#666',
                  fontWeight: 500
                }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formLogin.password}
                onChange={handleChange}
                error={!!errorFormLogin.password}
                helperText={errorFormLogin.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    bgcolor: '#F0F0F0',
                    '& fieldset': {
                      borderColor: 'transparent'
                    },
                    '&:hover fieldset': {
                      borderColor: '#c4b896'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#c4b896'
                    }
                  }
                }}
              />

              <Link
                href="#"
                underline="always"
                sx={{
                  color: '#1a1a1a',
                  fontWeight: 500,
                  display: 'block',
                  mb: 3,
                  fontSize: '0.95rem'
                }}
              >
                Forgot password
              </Link>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading.submit}
                sx={{
                  bgcolor: '#c4b896',
                  color: 'white',
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  mb: 3,
                  '&:hover': {
                    bgcolor: '#b0a080'
                  }
                }}
              >
                Sign In
              </Button>

              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  color: '#666'
                }}
              >
                Dont have an account yet?{' '}
                <Link
                  href="#"
                  underline="none"
                  sx={{
                    color: '#1a1a1a',
                    fontWeight: 600
                  }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Container>
      )}
      {stepPage === 2 && (
        <Container
          maxWidth="sm"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            py: 4
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 500, textAlign: 'center' }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 700, mb: 2, color: '#1a1a1a' }}
            >
              OTP Verification
            </Typography>
            <Typography variant="body1" sx={{ mb: 5, color: '#666', fontWeight: 400 }}>
              We have sent you One Time Password to your email.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 5 }}>
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  inputRef={(el) => (inputRefs.current[index] = el)}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    handleOtpKeyDown(index, e)
                  }
                  onPaste={handleOtpPaste}
                  error={!!otpError}
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: 'center',
                      fontSize: '24px',
                      fontWeight: 600
                    }
                  }}
                  sx={{
                    width: 64,
                    height: 64,
                    '& .MuiOutlinedInput-root': {
                      height: '100%',
                      borderRadius: '16px',
                      bgcolor: '#F0F0F0',
                      '& fieldset': {
                        borderColor: 'transparent'
                      },
                      '&:hover fieldset': {
                        borderColor: '#c4b896'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#c4b896',
                        borderWidth: 2
                      }
                    },
                    '& input': {
                      padding: 0
                    }
                  }}
                />
              ))}
            </Box>
            {otpError && (
              <Typography color="error" sx={{ mb: 2 }}>
                {otpError}
              </Typography>
            )}
            <Button
              fullWidth
              variant="contained"
              onClick={handleVerifyOTP}
              disabled={loading.submit}
              sx={{
                bgcolor: '#c4b896',
                color: 'white',
                py: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: '50px',
                mb: 3,
                '&:hover': {
                  bgcolor: '#b0a080'
                }
              }}
            >
              {loading.submit ? 'Verifying...' : 'Verify OTP'}
            </Button>
            <Typography variant="body1" sx={{ mb: 2, color: '#666' }}>
              Didnt receive OTP?{' '}
              <Link
                component="button"
                underline="always"
                sx={{ color: '#1a1a1a', fontWeight: 600 }}
              >
                Resend OTP
              </Link>
            </Typography>
            <Link
              component="button"
              onClick={() => setStepPage(1)}
              underline="always"
              sx={{ color: '#666', fontWeight: 500, fontSize: '1rem' }}
            >
              Back to Sign In
            </Link>
          </Box>
        </Container>
      )}

      {/* Right Section - Image */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'block' },
          position: 'relative',
          overflow: 'hidden'
          // background: 'linear-gradient(15deg, #f5e6d3 0%, #f0c674 50%, #d4a556 100%)',
          // clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: '600px',
            height: '600px'
          }}
        >
          <img
            src={`${assetsPathConfig}\\images\\auth-side-2.png`}
            alt=""
            style={{ objectFit: 'contain' }}
          />
        </Box>
      </Box>
    </Box>
  )
}
