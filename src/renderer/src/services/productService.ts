import { useAxiosInstance } from '@renderer/api/axiosInstance'
import { IProduct } from '@renderer/interface/product.interface'
import { IResponse } from '@renderer/interface/response.interface'
import type { AxiosResponse } from 'axios'

interface ProductService {
  getAllProduct: (params?: object) => Promise<IResponse<IProduct[]>>
  getDetailProduct: (id: string) => Promise<IResponse<IProduct>>
}

const ProductService = (): ProductService => {
  const axiosInstance = useAxiosInstance()

  const getAllProduct = async (params?: object): Promise<IResponse<IProduct[]>> => {
    try {
      const response: AxiosResponse<IResponse<IProduct[]>> = await axiosInstance.get(`/products`, {
        params
      })
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getDetailProduct = async (id: string): Promise<IResponse<IProduct>> => {
    try {
      const response: AxiosResponse<IResponse<IProduct>> = await axiosInstance.get(
        `/products/${id}`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    getAllProduct,
    getDetailProduct
  }
}

export default ProductService
