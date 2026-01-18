import { useNotifier } from '@renderer/components/core/NotificationProvider'
import { IProduct } from '@renderer/interface/product.interface'
import { IProductCategory } from '@renderer/interface/productCategory.interface'
import { IErrorResponse } from '@renderer/interface/response.interface'
import { IRoom } from '@renderer/interface/room.interface'
import { ITables } from '@renderer/interface/tables.interface'
import { IPayloadTransaction, ITransaction } from '@renderer/interface/transaction.interface'
import ProductCategoryService from '@renderer/services/productCategoryService'
import ProductService from '@renderer/services/productService'
import RoomService from '@renderer/services/roomService'
import TablesService from '@renderer/services/tablesService'
import TransactionService from '@renderer/services/transactionService'
import { optionInitialLimit, timeDebounce } from '@renderer/utils/config'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDebounce } from '@uidotdev/usehooks'
import { IPagination } from '@renderer/interface/config.interface'
import { useConfigStore } from '@renderer/store/configProvider'
import { buildReceiptHTML } from '@renderer/components/core/printTransaction'

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const UseIndex = () => {
  const { config } = useConfigStore.getState()
  const notifier = useNotifier()
  const productService = ProductService()
  const productCategoryService = ProductCategoryService()
  const transactionService = TransactionService()
  const roomService = RoomService()
  const tablesService = TablesService()

  const [dataProducts, setDataProducts] = useState<IProduct[]>([])
  const [dataProductCategory, setDataProductCategory] = useState<IProductCategory[]>([])
  const [orderType, setOrderType] = useState<'room' | 'table' | ''>('')
  const [selectedRoom, setSelectedRoom] = useState<string>('')
  const [dataRooms, setDataRoom] = useState<IRoom[]>([])
  const [dataTables, setDataTables] = useState<ITables[]>([])
  const [customerName, setCustomerName] = useState('')
  const [selectedTables, setSelectedTables] = useState<string[]>([])

  const [loading, setLoading] = useState({
    fetchProducts: false,
    fetchProductCategory: false,
    fetchRooms: false,
    fetchTables: false,
    submitTransaction: false
  })

  const [totalRows, setTotalRows] = useState(0)
  const [searchParams, setSearchParams] = useSearchParams()
  const initialPage = Number(searchParams.get('pageIndex')) || 1
  const initialLimit = Number(searchParams.get('pageSize')) || optionInitialLimit
  const initialSearch = searchParams.get('search') || ''
  const [search, setSearch] = useState(initialSearch)
  const debouncedSearch = useDebounce(search, timeDebounce)
  const [pagination, setPagination] = useState<IPagination>({
    pageIndex: initialPage,
    pageSize: initialLimit
  })
  const totalPages = Math.ceil(totalRows / pagination.pageSize) || 1

  useEffect(() => {
    const pageIndex = Number(searchParams.get('pageIndex')) || 1
    const pageSize = Number(searchParams.get('pageSize')) || optionInitialLimit
    const searchParam = searchParams.get('search') || ''

    setPagination({ pageIndex, pageSize })
    setSearch(searchParam)
  }, [searchParams])

  const handleSearch = (value: string) => {
    setSearchParams({
      pageIndex: '1',
      pageSize: pagination.pageSize.toString(),
      search: value
    })
  }

  const handlePageChange = (newPage: number) => {
    setSearchParams({
      pageIndex: newPage.toString(),
      pageSize: pagination.pageSize.toString(),
      search: debouncedSearch
    })
  }

  const handleLimitChange = (newLimit: number) => {
    setSearchParams({
      pageIndex: '1',
      pageSize: newLimit.toString(),
      search: debouncedSearch
    })
  }
  const fetchProducts = async () => {
    setLoading((prev) => ({ ...prev, fetchProducts: true }))
    try {
      const params = {
        outletId: localStorage.getItem('outletId') || '',
        search: debouncedSearch,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize
      }
      const response = await productService.getAllProduct(params)
      if (response.status) {
        setDataProducts(response.data || [])
        setTotalRows(response.meta?.total || 0)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      const axiosError = error as AxiosError<IErrorResponse>
      const message = axiosError.response?.data?.message || 'Terjadi kesalahan pada server!'
      notifier.show({
        message: 'Gagal Memuat Produk',
        description: message,
        severity: 'error'
      })
    } finally {
      setLoading((prev) => ({ ...prev, fetchProducts: false }))
    }
  }

  const fetchProductCategory = async () => {
    setLoading((prev) => ({ ...prev, fetchProductCategory: true }))
    try {
      const params = {
        outletId: localStorage.getItem('outletId') || ''
      }
      const response = await productCategoryService.getAllProductCategory(params)
      if (response.status) {
        setDataProductCategory(response.data || [])
      }
    } catch (error) {
      console.error('Error fetching product categories:', error)
      const axiosError = error as AxiosError<IErrorResponse>
      const message = axiosError.response?.data?.message || 'Terjadi kesalahan pada server!'
      notifier.show({
        message: 'Gagal Memuat Kategori Produk',
        description: message,
        severity: 'error'
      })
    } finally {
      setLoading((prev) => ({ ...prev, fetchProductCategory: false }))
    }
  }

  const fetchRooms = async () => {
    setLoading((prev) => ({ ...prev, fetchRooms: true }))
    try {
      const params = {
        outletId: localStorage.getItem('outletId') || ''
      }
      const response = await roomService.getAllRoom(params)
      if (response.status) {
        setDataRoom(response.data || [])
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
      const axiosError = error as AxiosError<IErrorResponse>
      const message = axiosError.response?.data?.message || 'Terjadi kesalahan pada server!'
      notifier.show({
        message: 'Gagal Memuat Ruangan',
        description: message,
        severity: 'error'
      })
    } finally {
      setLoading((prev) => ({ ...prev, fetchRooms: false }))
    }
  }

  const fetchTables = async () => {
    setLoading((prev) => ({ ...prev, fetchTables: true }))
    try {
      const params = {
        outletId: localStorage.getItem('outletId') || ''
      }
      const response = await tablesService.getAllTables(params)
      if (response.status) {
        setDataTables(response.data || [])
      }
    } catch (error) {
      console.error('Error fetching tables:', error)
      const axiosError = error as AxiosError<IErrorResponse>
      const message = axiosError.response?.data?.message || 'Terjadi kesalahan pada server!'
      notifier.show({
        message: 'Gagal Memuat Meja',
        description: message,
        severity: 'error'
      })
    } finally {
      setLoading((prev) => ({ ...prev, fetchTables: false }))
    }
  }

  const handleSubmitTransaction = async (
    payload: Omit<IPayloadTransaction, 'outletId'>
  ): Promise<boolean> => {
    try {
      setLoading((prev) => ({ ...prev, submitTransaction: true }))

      const fullPayload: IPayloadTransaction = {
        outletId: localStorage.getItem('outletId') || '',
        items: payload.items,
        payments: payload.payments
      }

      // inject conditional payload
      if (payload.roomId) {
        fullPayload.roomId = payload.roomId
      }

      if (payload.tableIds && payload.tableIds.length > 0) {
        fullPayload.tableIds = payload.tableIds
      }

      const response = await transactionService.createTransaction(fullPayload)

      if (response.status) {
        notifier.show({
          message: 'Transaksi Berhasil',
          description: response.message || 'Pembayaran telah diproses',
          severity: 'success'
        })
        if (config?.auto_print_transaction === false) {
          const detailtrx = await fetchDetailTransaction(response.data!.transaction.id)
          if (detailtrx) {
            printOrder(detailtrx)
          }
        }
        return true
      }

      return false
    } catch (error) {
      console.error('Error submitting transaction:', error)
      const axiosError = error as AxiosError<IErrorResponse>
      const message = axiosError.response?.data?.message || 'Gagal memproses transaksi!'
      notifier.show({
        message: 'Transaksi Gagal',
        description: message,
        severity: 'error'
      })
      return false
    } finally {
      setLoading((prev) => ({ ...prev, submitTransaction: false }))
    }
  }

  const fetchDetailTransaction = async (transactionId: string) => {
    try {
      setLoading((prev) => ({ ...prev, submitTransaction: true }))
      const response = await transactionService.getDetailTransaction(transactionId)
      if (response.status) {
        return response.data
      }
      return null
    } catch (error) {
      console.error('Error fetching transaction detail:', error)
      const axiosError = error as AxiosError<IErrorResponse>
      const message = axiosError.response?.data?.message || 'Terjadi kesalahan pada server!'
      notifier.show({
        message: 'Gagal Memuat Detail Transaksi',
        description: message,
        severity: 'error'
      })
      return null
    } finally {
      setLoading((prev) => ({ ...prev, submitTransaction: false }))
    }
  }

  const printOrder = (transaction: ITransaction) => {
    try {
      const header1 = localStorage.getItem('outletName') || 'Outlet'
      const header2 = 'New Order'
      const header3 = `Meja: ${(transaction.tables && transaction.tables.length > 0 && transaction.tables[0]?.name) || '-'} | ${transaction.date ? new Date(transaction.date).toLocaleString('id-ID') : '-'}`

      const dataToprint = {
        header1,
        header2,
        header3,
        contentHTML: buildReceiptHTML(transaction),
        footer1: 'Terima kasih atas kunjungan Anda!',
        footer2: 'Simpan struk ini sebagai bukti pembayaran.'
      }

      window.electron.ipcRenderer.send('print-order-receipt', dataToprint)
      console.log('✅ Print sent for transaction:', transaction.id)
      return true
    } catch (error) {
      console.error('❌ Failed to print transaction:', transaction.id, error)
      return false
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [debouncedSearch, pagination.pageIndex, pagination.pageSize])

  useEffect(() => {
    fetchProductCategory()
    fetchRooms()
    fetchTables()
  }, [])

  return {
    dataTables,
    dataRooms,
    dataProducts,
    dataProductCategory,
    handleSubmitTransaction,
    loading,
    customerName,
    setCustomerName,
    selectedTables,
    setSelectedTables,
    orderType,
    setOrderType,
    selectedRoom,
    setSelectedRoom,
    handleSearch,
    search,
    setSearch,
    pagination,
    setPagination,
    totalRows,
    handlePageChange,
    handleLimitChange,
    totalPages
  }
}
