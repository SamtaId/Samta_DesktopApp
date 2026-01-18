import type { AxiosError, AxiosResponse } from 'axios'
import { LoggerService } from './loggerService'
import {
  ITransaction,
  IPayloadTransaction,
  ICreateTransactionResponse
} from '@renderer/interface/transaction.interface'
import { IResponse } from '@renderer/interface/response.interface'
import { useAxiosInstance } from '@renderer/api/axiosInstance'

interface TransactionService {
  getAllTransaction: (params?: object) => Promise<IResponse<ITransaction[]>>
  getDetailTransaction: (id: string) => Promise<IResponse<ITransaction>>
  createTransaction: (data: IPayloadTransaction) => Promise<IResponse<ICreateTransactionResponse>>
}

const TransactionService = (): TransactionService => {
  const axiosInstance = useAxiosInstance()

  const getAllTransaction = async (params?: object): Promise<IResponse<ITransaction[]>> => {
    try {
      const response: AxiosResponse<IResponse<ITransaction[]>> = await axiosInstance.get(
        `/transactions`,
        {
          params
        }
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error(
        'TransactionService.getAllTransaction',
        'Get all transaction failed',
        {
          request: '/transactions',
          params,
          response: axiosError.response
        }
      )
      console.error(error)
      throw error
    }
  }

  const getDetailTransaction = async (id: string): Promise<IResponse<ITransaction>> => {
    try {
      const response: AxiosResponse<IResponse<ITransaction>> = await axiosInstance.get(
        `/transactions/${id}`
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error(
        'TransactionService.getAllTransaction',
        'Get all transaction failed',
        {
          request: `/transactions/${id}`,
          response: axiosError.response
        }
      )
      console.error(error)
      throw error
    }
  }

  const createTransaction = async (
    data: IPayloadTransaction
  ): Promise<IResponse<ICreateTransactionResponse>> => {
    try {
      const response: AxiosResponse<IResponse<ICreateTransactionResponse>> =
        await axiosInstance.post(`/transactions`, data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('TransactionService.createTransaction', 'Create all order failed', {
        request: '/transactions',
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  return {
    createTransaction,
    getDetailTransaction,
    getAllTransaction
  }
}

export default TransactionService
