import { useAxiosInstance } from '@renderer/api/axiosInstance'
import { IRoom } from '@renderer/interface/room.interface'
import { IResponse } from '@renderer/interface/response.interface'
import type { AxiosResponse } from 'axios'

interface RoomService {
  getAllRoom: (params?: object) => Promise<IResponse<IRoom[]>>
  getDetailRoom: (id: string) => Promise<IResponse<IRoom>>
}

const RoomService = (): RoomService => {
  const axiosInstance = useAxiosInstance()

  const getAllRoom = async (params?: object): Promise<IResponse<IRoom[]>> => {
    try {
      const response: AxiosResponse<IResponse<IRoom[]>> = await axiosInstance.get(`/rooms`, {
        params
      })
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getDetailRoom = async (id: string): Promise<IResponse<IRoom>> => {
    try {
      const response: AxiosResponse<IResponse<IRoom>> = await axiosInstance.get(`/rooms/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    getAllRoom,
    getDetailRoom
  }
}

export default RoomService
