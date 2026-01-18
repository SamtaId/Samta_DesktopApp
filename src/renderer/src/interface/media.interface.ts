export interface IMedia {
  id: string
  url: string
  type: 'image' | 'video' | 'audio' | 'document'
  createdAt: Date
  updatedAt: Date
}
