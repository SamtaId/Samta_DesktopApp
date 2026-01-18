import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  Avatar,
  Divider
} from '@mui/material'
import {
  Close as CloseIcon,
  AttachMoney as CashIcon,
  CreditCard as CardIcon,
  AccountBalance as BankIcon,
  QrCode as QRIcon,
  Wallet as WalletIcon
} from '@mui/icons-material'

interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactElement
  color: string
}

interface PaymentModalProps {
  open: boolean
  onClose: () => void
  totalAmount: number
  onConfirmPayment: (paymentMethod: string, cashAmount: number) => void
  loading?: boolean
}

const paymentMethods: PaymentMethod[] = [
  { id: 'CASH', name: 'Cash', icon: <CashIcon />, color: '#4CAF50' },
  { id: 'cashless', name: 'Cashless (Xendit)', icon: <CardIcon />, color: '#2196F3' },
  { id: 'bank_transfer', name: 'Bank Transfer', icon: <BankIcon />, color: '#FF9800' },
  { id: 'qris', name: 'QRIS', icon: <QRIcon />, color: '#9C27B0' },
  { id: 'e_wallet', name: 'E-Wallet', icon: <WalletIcon />, color: '#00BCD4' }
]

export const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  totalAmount,
  onConfirmPayment,
  loading = false
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('cash')
  const [cashAmount, setCashAmount] = useState<string>('')

  // Calculate change directly instead of using state/effect
  const parsedCashAmount =
    selectedMethod === 'cash' && cashAmount ? parseFloat(cashAmount.replace(/\./g, '')) : 0
  const change =
    selectedMethod === 'cash' && !isNaN(parsedCashAmount)
      ? Math.max(parsedCashAmount - totalAmount, 0)
      : 0

  const handleCashAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.replace(/\D/g, '')
    setCashAmount(value ? parseInt(value).toLocaleString('id-ID') : '')
  }

  const handleQuickAmount = (amount: number): void => {
    setCashAmount(amount.toLocaleString('id-ID'))
  }

  const handleConfirm = (): void => {
    if (selectedMethod === 'cash') {
      const amount = parseFloat(cashAmount.replace(/\./g, ''))
      if (amount < totalAmount) {
        alert('Jumlah pembayaran kurang dari total!')
        return
      }
      onConfirmPayment(selectedMethod, amount)
    } else {
      onConfirmPayment(selectedMethod, totalAmount)
    }
  }

  const handleClose = (): void => {
    setSelectedMethod('cash')
    setCashAmount('')
    onClose()
  }

  const isValidPayment = (): boolean => {
    if (selectedMethod === 'CASH') {
      const amount = parseFloat(cashAmount.replace(/\./g, ''))
      return !isNaN(amount) && amount >= totalAmount
    }
    return true
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight={700}>
            Payment
          </Typography>
          <IconButton onClick={handleClose} size="small" disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {/* Total Amount */}
        <Box
          sx={{
            bgcolor: 'grey.50',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            mb: 3
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Total Amount
          </Typography>
          <Typography variant="h4" fontWeight={700} color="#C3A86D">
            Rp {totalAmount.toLocaleString('id-ID')}
          </Typography>
        </Box>

        {/* Payment Methods */}
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Select Payment Method
        </Typography>
        <RadioGroup value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)}>
          {paymentMethods.map((method) => (
            <Box
              key={method.id}
              sx={{
                border: 2,
                borderColor: selectedMethod === method.id ? '#C3A86D' : 'grey.200',
                borderRadius: 2,
                mb: 1.5,
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#C3A86D',
                  bgcolor: 'grey.50'
                }
              }}
            >
              <FormControlLabel
                value={method.id}
                control={
                  <Radio
                    sx={{
                      '&.Mui-checked': {
                        color: '#C3A86D'
                      }
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: method.color,
                        width: 40,
                        height: 40
                      }}
                    >
                      {method.icon}
                    </Avatar>
                    <Typography variant="body1" fontWeight={500}>
                      {method.name}
                    </Typography>
                  </Box>
                }
                sx={{ width: '100%', m: 0, px: 2 }}
              />
            </Box>
          ))}
        </RadioGroup>

        {/* Cash Payment Details */}
        {selectedMethod === 'CASH' && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Cash Payment
            </Typography>

            <TextField
              fullWidth
              label="Cash Amount"
              value={cashAmount}
              onChange={handleCashAmountChange}
              placeholder="0"
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>Rp</Typography>
              }}
            />

            {/* Quick Amount Buttons */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {[50000, 100000, 150000, 200000].map((amount) => (
                <Button
                  key={amount}
                  variant="outlined"
                  size="small"
                  onClick={() => handleQuickAmount(amount)}
                  sx={{
                    borderColor: '#C3A86D',
                    color: '#C3A86D',
                    '&:hover': {
                      borderColor: '#b0a080',
                      bgcolor: '#C3A86D',
                      color: 'white'
                    }
                  }}
                >
                  {amount.toLocaleString('id-ID')}
                </Button>
              ))}
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleQuickAmount(totalAmount)}
                sx={{
                  borderColor: '#C3A86D',
                  color: '#C3A86D',
                  '&:hover': {
                    borderColor: '#b0a080',
                    bgcolor: '#C3A86D',
                    color: 'white'
                  }
                }}
              >
                Exact
              </Button>
            </Box>

            {/* Change Display */}
            {cashAmount && (
              <Box
                sx={{
                  bgcolor: change >= 0 ? 'success.50' : 'error.50',
                  borderRadius: 2,
                  p: 2
                }}
              >
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Change
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color={change >= 0 ? 'success.main' : 'error.main'}
                  >
                    Rp {change.toLocaleString('id-ID')}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          fullWidth
          disabled={loading}
          sx={{
            color: 'text.secondary',
            borderColor: 'grey.300',
            '&:hover': {
              borderColor: 'grey.400'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          fullWidth
          disabled={!isValidPayment() || loading}
          sx={{
            bgcolor: '#C3A86D',
            '&:hover': { bgcolor: '#b0a080' },
            '&:disabled': {
              bgcolor: 'grey.300'
            }
          }}
        >
          {loading ? 'Processing...' : 'Process Payment'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
