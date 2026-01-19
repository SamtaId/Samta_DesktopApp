import React, { useState } from 'react'
import { Box, TextField, Button, Typography, Link, InputAdornment, IconButton } from '@mui/material'
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
        justifyContent: 'space-between',
        minHeight: '100vh',
        bgcolor: '#f5f5f5'
      }}
    >
      {/* Left Section - Login Form */}
      <Box
        sx={{
          flex: { xs: 1, md: 1.5, lg: 1.5 },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: '#f5f5f5',
          // Tambahkan fixed width untuk mencegah perubahan layout
          width: { xs: '100%', md: '50%' }
        }}
      >
        {/* Container utama dengan fixed width */}
        <Box
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: 500, md: 600, lg: 700 },
            px: { xs: 3, sm: 4, md: 6, lg: 8 },
            py: 4,
            // Pastikan container tidak berubah ukuran
            minWidth: { md: 500 }
          }}
        >
          {stepPage === 1 ? (
            <>
              <Box sx={{ padding: '10%' }}>
                {/* Welcome Text */}
                {/* Logo - sama untuk kedua step */}
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    mb: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2
                  }}
                >
                  <img
                    src={`${assetsPathConfig}\\images\\logo.png`}
                    alt="Logo"
                    style={{ width: '70px' }}
                  />
                </Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                    color: '#1a1a1a'
                  }}
                >
                  Welcome back!
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 5,
                    color: '#666',
                    fontWeight: 400,
                    fontSize: { xs: '1rem', sm: '1.1rem' }
                  }}
                >
                  Please enter your credentials to sign in!
                </Typography>

                {/* Login Form */}
                <Box component="form" onSubmit={handleSubmit}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 1.5,
                      color: '#666',
                      fontWeight: 600,
                      fontSize: '1rem'
                    }}
                  >
                    Email
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter your email address"
                    type="email"
                    name="email"
                    value={formLogin.email}
                    onChange={handleChange}
                    error={!!errorFormLogin.email}
                    helperText={errorFormLogin.email}
                    sx={{
                      mb: 4,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: 'white',
                        '& fieldset': {
                          borderColor: '#e0e0e0',
                          borderWidth: 2
                        },
                        '&:hover fieldset': {
                          borderColor: '#c4b896'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#c4b896',
                          borderWidth: 2
                        }
                      },
                      '& .MuiOutlinedInput-input': {
                        py: 1.5,
                        fontSize: '1rem'
                      }
                    }}
                    size="medium"
                  />

                  <Typography
                    variant="h6"
                    sx={{
                      mb: 1.5,
                      color: '#666',
                      fontWeight: 600,
                      fontSize: '1rem'
                    }}
                  >
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter your password"
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
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: 'white',
                        '& fieldset': {
                          borderColor: '#e0e0e0',
                          borderWidth: 2
                        },
                        '&:hover fieldset': {
                          borderColor: '#c4b896'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#c4b896',
                          borderWidth: 2
                        }
                      },
                      '& .MuiOutlinedInput-input': {
                        py: 1.5,
                        fontSize: '1rem'
                      }
                    }}
                    size="medium"
                  />

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 4
                    }}
                  >
                    <Link
                      href="#"
                      underline="always"
                      sx={{
                        color: '#1a1a1a',
                        fontWeight: 600,
                        fontSize: '1rem'
                      }}
                    >
                      Forgot password?
                    </Link>
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading.submit}
                    sx={{
                      bgcolor: '#c4b896',
                      color: 'white',
                      py: 1.8,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      borderRadius: '12px',
                      mb: 4,
                      boxShadow: '0 4px 12px rgba(196, 184, 150, 0.3)',
                      '&:hover': {
                        bgcolor: '#b0a080',
                        boxShadow: '0 6px 16px rgba(196, 184, 150, 0.4)'
                      },
                      '&:disabled': {
                        bgcolor: '#e0e0e0'
                      }
                    }}
                  >
                    {loading.submit ? 'Signing In...' : 'Sign In'}
                  </Button>

                  <Typography
                    variant="body1"
                    sx={{
                      textAlign: 'center',
                      color: '#666',
                      fontSize: '1rem'
                    }}
                  >
                    Dont have an account yet?{' '}
                    <Link
                      href="#"
                      underline="none"
                      sx={{
                        color: '#c4b896',
                        fontWeight: 700,
                        fontSize: '1rem',
                        '&:hover': {
                          color: '#b0a080'
                        }
                      }}
                    >
                      Sign up
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </>
          ) : (
            <>
              {/* Logo - sama untuk kedua step */}
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2
                }}
              >
                <img
                  src={`${assetsPathConfig}\\images\\logo.png`}
                  alt="Logo"
                  style={{ width: '70px' }}
                />
              </Box>
              {/* OTP Verification */}
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  color: '#1a1a1a'
                  // fontSize: { xs: '2rem', sm: '2.5rem', md: '2.75rem' }
                }}
              >
                OTP Verification
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 6,
                  color: '#666',
                  fontWeight: 400,
                  fontSize: { xs: '1rem', sm: '1.1rem' }
                }}
              >
                We have sent you One Time Password to your email.
              </Typography>

              {/* Container untuk OTP dengan flex agar tetap di tengah tanpa mengubah lebar parent */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 6,
                  // Pastikan container ini tidak menyebabkan parent melebar
                  width: '100%',
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: { xs: 2, sm: 3 },
                    // Gunakan flex-wrap untuk responsif
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    // Batasi lebar maksimal untuk mencegah melebar
                    maxWidth: '100%'
                  }}
                >
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
                          fontSize: '28px',
                          fontWeight: 700
                        }
                      }}
                      sx={{
                        width: { xs: 56, sm: 64, md: 70 },
                        height: { xs: 56, sm: 64, md: 70 },
                        flexShrink: 0, // Mencegah mengecil
                        '& .MuiOutlinedInput-root': {
                          height: '100%',
                          borderRadius: '12px',
                          bgcolor: 'white',
                          '& fieldset': {
                            borderColor: '#e0e0e0',
                            borderWidth: 2
                          },
                          '&:hover fieldset': {
                            borderColor: '#c4b896'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#c4b896',
                            borderWidth: 3
                          }
                        },
                        '& input': {
                          padding: 0
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {otpError && (
                <Typography color="error" sx={{ mb: 3, fontSize: '1rem' }}>
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
                  py: 1.8,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  mb: 4,
                  boxShadow: '0 4px 12px rgba(196, 184, 150, 0.3)',
                  '&:hover': {
                    bgcolor: '#b0a080',
                    boxShadow: '0 6px 16px rgba(196, 184, 150, 0.4)'
                  }
                }}
              >
                {loading.submit ? 'Verifying...' : 'Verify OTP'}
              </Button>

              <Typography
                variant="body1"
                sx={{ textAlign: 'center', mb: 3, color: '#666', fontSize: '1rem' }}
              >
                Didnt receive OTP?{' '}
                <Link
                  component="button"
                  underline="always"
                  sx={{
                    color: '#c4b896',
                    fontWeight: 700,
                    fontSize: '1rem',
                    '&:hover': {
                      color: '#b0a080'
                    }
                  }}
                >
                  Resend OTP
                </Link>
              </Typography>

              <Link
                component="button"
                onClick={() => setStepPage(1)}
                underline="always"
                sx={{
                  color: '#666',
                  fontWeight: 600,
                  fontSize: '1rem',
                  '&:hover': {
                    color: '#1a1a1a'
                  }
                }}
              >
                ← Back to Sign In
              </Link>
            </>
          )}
        </Box>
      </Box>

      {/* Right Section - Image */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'block' },
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%'
          }}
        >
          <img
            src={`${assetsPathConfig}\\images\\auth-side-2.png`}
            alt="Background"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}
