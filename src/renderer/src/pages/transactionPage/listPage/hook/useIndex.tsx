import { useNotifier } from '@renderer/components/core/NotificationProvider'
import { IErrorResponse } from '@renderer/interface/response.interface'
import { ITransaction } from '@renderer/interface/transaction.interface'
import TransactionService from '@renderer/services/transactionService'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { formatRupiah } from '@renderer/utils/myFunctions'
import { statusTransaction } from '@renderer/utils/dataStatus'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Box, Typography, Chip } from '@mui/material'
// import { Visibility as ViewIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const UseIndex = () => {
  const navigate = useNavigate()
  const notifier = useNotifier()
  const transactionService = TransactionService()

  const [dataTransactions, setDataTransactions] = useState<ITransaction[]>([])
  const [loading, setLoading] = useState({
    fetchTransactions: false
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })

  const fetchTransactions = async (): Promise<void> => {
    setLoading((prev) => ({ ...prev, fetchTransactions: true }))
    try {
      const params = {
        outletId: localStorage.getItem('outletId') || ''
      }
      const response = await transactionService.getAllTransaction(params)
      if (response.status) {
        setDataTransactions(response.data || [])
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
      const axiosError = error as AxiosError<IErrorResponse>
      const message = axiosError.response?.data?.message || 'Terjadi kesalahan pada server!'
      notifier.show({
        message: 'Gagal Memuat Transaksi',
        description: message,
        severity: 'error'
      })
    } finally {
      setLoading((prev) => ({ ...prev, fetchTransactions: false }))
    }
  }

  // const handleViewTransaction = (transaction: ITransaction): void => {
  //   console.log('View transaction:', transaction)
  //   // Implement view logic here
  // }

  // const handleDeleteTransaction = (transactionId: string): void => {
  //   console.log('Delete transaction:', transactionId)
  //   // Implement delete logic here
  // }

  const handleDownload = (): void => {
    console.log('Download transactions')
    // Implement download logic here
  }

  const handleAddNew = (): void => {
    navigate('/transactions/create')
  }

  const columns: GridColDef[] = [
    {
      field: 'nomor',
      headerName: 'ORDER',
      flex: 1.2,
      minWidth: 180,
      renderCell: (params) => (
        <Typography fontWeight={700} fontSize="0.9rem">
          #{params.value}
        </Typography>
      )
    },
    {
      field: 'date',
      headerName: 'DATE',
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => (
        <Typography fontSize="0.85rem" color="text.secondary">
          {new Date(params.value).toLocaleDateString('id-ID')}
        </Typography>
      )
    },
    {
      field: 'customer',
      headerName: 'CUSTOMER',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography fontSize="0.85rem" color="text.secondary">
          {params.row.customerName || '-'}
        </Typography>
      )
    },
    {
      field: 'status',
      headerName: 'STATUS',
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={statusTransaction[params.row.status].label.toUpperCase()}
          size="small"
          sx={{
            bgcolor: 'grey.100',
            color: 'grey.800',
            fontWeight: 600,
            fontSize: '0.7rem',
            borderRadius: '999px'
          }}
        />
      )
    },
    {
      field: 'paymentMethod',
      headerName: 'PAYMENT METHOD',
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<ITransaction>) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* <span>{getPaymentMethodIcon(params.value)}</span> */}
          <Typography variant="body2" color="text.secondary">
            {(params.row.PaymentHistory.length > 0 && params.row.PaymentHistory[0].method) || '-'}
          </Typography>
        </Box>
      )
    },
    {
      field: 'total',
      headerName: 'TOTAL',
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<ITransaction>) => (
        <Typography variant="body2" fontWeight={700}>
          {formatRupiah(params.row.grandTotal || '0')}
        </Typography>
      )
    }
    // {
    //   field: 'actions',
    //   headerName: '',
    //   width: 120,
    //   sortable: false,
    //   renderCell: (params: GridRenderCellParams<ITransaction>) => (
    //     <Box sx={{ display: 'flex', gap: 0.5 }}>
    //       <IconButton
    //         size="small"
    //         onClick={() => handleViewTransaction(params.row)}
    //         sx={{ color: 'text.secondary' }}
    //       >
    //         <ViewIcon fontSize="small" />
    //       </IconButton>
    //       <IconButton
    //         size="small"
    //         onClick={() => handleDeleteTransaction(params.row.id)}
    //         sx={{ color: 'error.main' }}
    //       >
    //         <DeleteIcon fontSize="small" />
    //       </IconButton>
    //     </Box>
    //   )
    // }
  ]

  const filteredTransactions = dataTransactions.filter((transaction) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      transaction.id?.toString().includes(searchLower) ||
      // transaction.menu?.toLowerCase().includes(searchLower) ||
      transaction.status?.toLowerCase().includes(searchLower)
    )
  })
  useEffect(() => {
    fetchTransactions()
  }, [])

  return {
    dataTransactions: filteredTransactions,
    loading,
    setSearchQuery,
    paginationModel,
    setPaginationModel,
    handleDownload,
    handleAddNew,
    searchQuery,
    columns
  }
}
