import React, { useState } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Chip,
  Divider,
  Avatar,
  Paper
} from '@mui/material'
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Percent as PercentIcon,
  Receipt as ReceiptIcon,
  Add as AddIcon,
  Remove as RemoveIcon
} from '@mui/icons-material'
import { UseIndex } from './hook'
import { formatRupiah, fullDate } from '@renderer/utils/myFunctions'
import { IProduct } from '@renderer/interface/product.interface'
import { LoaderComponent } from '@renderer/components/core/loader'
import { PaymentModal } from './components/paymentModal'
import { useNotifier } from '@renderer/components/core/NotificationProvider'
import { ImageDefault } from '@renderer/components/core/imageDefault'
import { Select, MenuItem, Checkbox, ListItemText } from '@mui/material'

interface CartItem extends IProduct {
  quantity: number
  notes: string
}

export const CreateTransactionPage: React.FC = () => {
  const notifier = useNotifier()
  const {
    loading,
    dataTables,
    dataRooms,
    dataProducts,
    dataProductCategory,
    handleSubmitTransaction,
    setCustomerName,
    selectedTables,
    setSelectedTables,
    orderType,
    setOrderType,
    setSelectedRoom,
    selectedRoom,
    handleSearch
  } = UseIndex()

  const [cart, setCart] = useState<CartItem[]>([])

  const [paymentModalOpen, setPaymentModalOpen] = useState(false)

  const handleOpenPaymentModal = (): void => {
    if (cart.length === 0) {
      notifier.show({
        message: 'Keranjang Kosong',
        description: 'Silakan tambahkan produk terlebih dahulu',
        severity: 'warning'
      })
      return
    }
    setPaymentModalOpen(true)
  }

  const handleConfirmPayment = async (paymentMethod: string, cashAmount: number): Promise<void> => {
    const items = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity
    }))

    const payments = [
      {
        method: paymentMethod,
        amount: cashAmount
      }
    ]

    const success = await handleSubmitTransaction({
      items,
      payments,
      ...(orderType === 'room' ? { roomId: selectedRoom } : { tableIds: selectedTables })
    })

    if (success) {
      setCart([])
      setCustomerName('')
      setSelectedTables([])
      setPaymentModalOpen(false)
    }
  }

  const addToCart = (product: IProduct): void => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      )
    } else {
      setCart([...cart, { ...product, quantity: 1, notes: '' }])
    }
  }

  const removeFromCart = (id: string): void => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, delta: number): void => {
    setCart(
      cart.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
        }
        return item
      })
    )
  }

  const subtotal = cart.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0)
  const discount = 0
  const tax = 0
  const total = subtotal - discount + tax

  return (
    <Box sx={{ display: 'flex', height: '90vh', bgcolor: '#fafafa' }}>
      {/* Left Section - Products */}
      <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header (sticky) + Search + Filter */}
        <Box sx={{ mb: 0, position: 'sticky', top: 0, zIndex: 2, bgcolor: '#fafafa', pb: 2 }}>
          <Typography variant="h4" color="black" fontWeight={700} gutterBottom>
            Point of Sale
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {fullDate}
          </Typography>
          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search products..."
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
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
          {/* Category Filter */}
          <Box sx={{ mb: 1 }}>
            {loading.fetchProductCategory ? (
              <LoaderComponent />
            ) : (
              dataProductCategory &&
              dataProductCategory.map((category) => (
                <Chip
                  key={category.id}
                  label={category.name}
                  sx={{
                    mr: 1,
                    bgcolor: '#C3A86D',
                    color: 'white',
                    fontWeight: 600,
                    '&:hover': { bgcolor: '#b0a080' }
                  }}
                />
              ))
            )}
            {/* <Chip
              label="🍽️ All"
              sx={{
                bgcolor: '#C3A86D',
                color: 'white',
                fontWeight: 600,
                '&:hover': { bgcolor: '#b0a080' }
              }}
            /> */}
          </Box>
        </Box>

        {/* Scrollable Product Grid Only */}
        <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', pt: 2 }}>
          <Grid container spacing={2}>
            {loading.fetchProducts ? (
              <LoaderComponent />
            ) : (
              dataProducts &&
              dataProducts.map((product, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': { boxShadow: 4 }
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <Box
                        sx={{
                          height: 140,
                          bgcolor: 'grey.100',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '4rem'
                        }}
                      >
                        <ImageDefault
                          url={(product.images.length > 0 && product.images[0].url) || null}
                        />
                      </Box>
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" fontWeight={600} gutterBottom>
                        {product.name}
                      </Typography>
                      <Typography variant="body1" color="#C3A86D" fontWeight={700} gutterBottom>
                        {formatRupiah(product.sellingPrice)}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          {product.unit || '-'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          1x
                        </Typography>
                      </Box>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => addToCart(product)}
                        sx={{
                          bgcolor: '#C3A86D',
                          '&:hover': { bgcolor: '#b0a080' },
                          textTransform: 'none',
                          fontWeight: 600
                        }}
                      >
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      </Box>

      {/* Right Section - Current Order */}
      <Paper
        elevation={3}
        sx={{
          width: 400,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 0
        }}
      >
        {/* Order Header */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Current Order
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {fullDate}
          </Typography>
        </Box>

        {/* Customer & Table Info */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          {/* <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ mb: 1, display: 'flex', alignItems: 'center' }}
            >
              <PersonIcon sx={{ mr: 1, fontSize: 18 }} />
              Customer Name
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter customer name..."
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              sx={{ bgcolor: 'grey.50' }}
            />
          </Box> */}

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
              Order Type
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant={orderType === 'room' ? 'contained' : 'outlined'}
                onClick={() => {
                  setOrderType('room')
                  setSelectedTables([])
                }}
                sx={{
                  borderRadius: '16px',
                  bgcolor: orderType === 'room' ? '#C3A86D' : '#F0F0F0',
                  color: orderType === 'room' ? 'white' : 'black',
                  borderColor: orderType === 'room' ? '#C3A86D' : '#c4b896',
                  fontWeight: 600,
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: orderType === 'room' ? '#b0a080' : '#e0e0e0',
                    borderColor: '#c4b896'
                  }
                }}
              >
                Room
              </Button>

              <Button
                variant={orderType === 'table' ? 'contained' : 'outlined'}
                onClick={() => {
                  setOrderType('table')
                  setSelectedRoom('')
                }}
                sx={{
                  borderRadius: '16px',
                  bgcolor: orderType === 'table' ? '#C3A86D' : '#F0F0F0',
                  color: orderType === 'table' ? 'white' : 'black',
                  borderColor: orderType === 'table' ? '#C3A86D' : '#c4b896',
                  fontWeight: 600,
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: orderType === 'table' ? '#b0a080' : '#e0e0e0',
                    borderColor: '#c4b896'
                  }
                }}
              >
                Table
              </Button>
            </Box>
          </Box>

          {orderType === 'room' && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                Room
              </Typography>

              <Select
                fullWidth
                size="small"
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                displayEmpty
                sx={{
                  mb: 2,
                  borderRadius: '16px',
                  bgcolor: '#F0F0F0',
                  '& .MuiOutlinedInput-root, & .MuiSelect-select': {
                    borderRadius: '16px',
                    bgcolor: '#F0F0F0'
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#c4b896'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#c4b896'
                  }
                }}
              >
                <MenuItem value="" disabled>
                  Select room...
                </MenuItem>

                {dataRooms.map((room) => (
                  <MenuItem key={room.id} value={room.id}>
                    {room.roomNumber} — {room.roomType?.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}
          {orderType === 'table' && (
            <Box>
              <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                Tables
              </Typography>

              <Select
                multiple
                fullWidth
                size="small"
                value={selectedTables}
                onChange={(e) => setSelectedTables(e.target.value as string[])}
                renderValue={(selected) =>
                  selected.length === 0
                    ? 'Select tables...'
                    : dataTables
                        .filter((t) => selected.includes(t.id))
                        .map((t) => t.name)
                        .join(', ')
                }
                sx={{
                  mb: 2,
                  borderRadius: '16px',
                  bgcolor: '#F0F0F0',
                  '& .MuiOutlinedInput-root, & .MuiSelect-select': {
                    borderRadius: '16px',
                    bgcolor: '#F0F0F0'
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#c4b896'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#c4b896'
                  }
                }}
              >
                {dataTables.map((table) => (
                  <MenuItem key={table.id} value={table.id}>
                    <Checkbox checked={selectedTables.includes(table.id)} />
                    <ListItemText primary={table.name} />
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}
        </Box>

        {/* Cart Items */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
          {cart.map((item) => (
            <Paper
              key={item.id}
              elevation={0}
              sx={{
                p: 2,
                mb: 2,
                bgcolor: 'grey.50',
                borderRadius: 2
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: 'white',
                      fontSize: '1.5rem'
                    }}
                  >
                    <ImageDefault url={(item.images.length > 0 && item.images[0].url) || null} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="#C3A86D" fontWeight={600}>
                      {formatRupiah(item.sellingPrice)}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => removeFromCart(item.id)}
                  sx={{ height: 'fit-content' }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                {/* <Button
                  size="small"
                  startIcon={<EditIcon />}
                  sx={{
                    textTransform: 'none',
                    color: 'text.secondary',
                    fontSize: '0.75rem'
                  }}
                >
                  Add notes
                </Button> */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => updateQuantity(item.id, -1)}
                    disabled={item.quantity <= 1}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ minWidth: 20, textAlign: 'center' }}
                  >
                    {item.quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => updateQuantity(item.id, 1)}
                    sx={{
                      bgcolor: '#C3A86D',
                      color: 'white',
                      '&:hover': { bgcolor: '#b0a080' }
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>

        {/* Order Summary */}
        <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="body2" color="text.secondary">
              Subtotal
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              Rp{formatRupiah(subtotal)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PercentIcon sx={{ fontSize: 16, mr: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                Discount
              </Typography>
            </Box>
            <Typography variant="body2" fontWeight={500}>
              -Rp{discount}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ReceiptIcon sx={{ fontSize: 16, mr: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                Tax
              </Typography>
            </Box>
            <Typography variant="body2" fontWeight={500}>
              +Rp{tax}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" fontWeight={600}>
              Total
            </Typography>
            <Typography variant="h5" fontWeight={700} color="#C3A86D">
              Rp{total.toLocaleString('id-ID')}
            </Typography>
          </Box>

          <Button
            fullWidth
            onClick={handleOpenPaymentModal}
            variant="contained"
            size="large"
            disabled={cart.length === 0}
            sx={{
              bgcolor: '#C3A86D',
              '&:hover': { bgcolor: '#b0a080' },
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5
            }}
          >
            Process Payment
          </Button>

          <PaymentModal
            open={paymentModalOpen}
            onClose={() => setPaymentModalOpen(false)}
            totalAmount={total}
            onConfirmPayment={handleConfirmPayment}
            loading={loading.submitTransaction}
          />
        </Box>
      </Paper>
    </Box>
  )
}
