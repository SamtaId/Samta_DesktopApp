import { useAxiosInstance } from '@renderer/api/axiosInstance'
import { IResponse } from '@renderer/interface/response.interface'
import { ITables } from '@renderer/interface/tables.interface'
import type { AxiosResponse } from 'axios'

interface TablesService {
  getAllTables: (params?: object) => Promise<IResponse<ITables[]>>
  getDetailTables: (id: string) => Promise<IResponse<ITables>>
}

const TablesService = (): TablesService => {
  const axiosInstance = useAxiosInstance()

  const getAllTables = async (params?: object): Promise<IResponse<ITables[]>> => {
    try {
      const response: AxiosResponse<IResponse<ITables[]>> = await axiosInstance.get(`/tables`, {
        params
      })
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getDetailTables = async (id: string): Promise<IResponse<ITables>> => {
    try {
      const response: AxiosResponse<IResponse<ITables>> = await axiosInstance.get(`/tables/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    getAllTables,
    getDetailTables
  }
}

export default TablesService
