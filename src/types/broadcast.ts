export interface Broadcast {
  _id: string
  title: string
  content: string
  receivers: string[] | 'all' | 'users' | 'businesses'
  receiverType: 'specific_user' | 'general'
  deliveryChannels: ('email' | 'sms' | 'in_app' | 'lock_screen')[]
  scheduledDate?: string | Date
  status: 'pending' | 'delivered' | 'failed'
  createdAt: string | Date
  updatedAt: string | Date
}

export interface CreateBroadcastPayload {
  title: string
  content: string
  receivers: string[] | 'all' | 'users' | 'businesses'
  deliveryChannels: ('email' | 'sms' | 'in_app' | 'lock_screen')[]
  scheduledDate?: string
}

interface PaginationParams {
  page?: number
  limit?: number
  search?: string
}

export interface BroadcastFilters extends PaginationParams {
  status?: 'pending' | 'delivered' | 'failed'
  receiverType?: 'specific_user' | 'general'
  dateFrom?: string
  dateTo?: string
}

