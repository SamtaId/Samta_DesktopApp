import { useAxiosInstance } from '@renderer/api/axiosInstance'
import { IProductCategory } from '@renderer/interface/productCategory.interface'
import { IResponse } from '@renderer/interface/response.interface'
import type { AxiosResponse } from 'axios'

interface ProductCategoryService {
  getAllProductCategory: (params?: object) => Promise<IResponse<IProductCategory[]>>
  getDetailProductCategory: (id: string) => Promise<IResponse<IProductCategory>>
}

const ProductCategoryService = (): ProductCategoryService => {
  const axiosInstance = useAxiosInstance()

  const getAllProductCategory = async (params?: object): Promise<IResponse<IProductCategory[]>> => {
    try {
      const response: AxiosResponse<IResponse<IProductCategory[]>> = await axiosInstance.get(
        `/product-category`,
        {
          params
        }
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getDetailProductCategory = async (id: string): Promise<IResponse<IProductCategory>> => {
    try {
      const response: AxiosResponse<IResponse<IProductCategory>> = await axiosInstance.get(
        `/product-category/${id}`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    getAllProductCategory,
    getDetailProductCategory
  }
}

export default ProductCategoryService
