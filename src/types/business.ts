export interface Business {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  businessType: 'cleaning' | 'maintenance' | 'other'
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'suspended'
  ownerName: string
  ownerEmail: string
  ownerPhone: string
  createdAt: string
  lastUpdated: string
  totalServices: number
  totalEarnings: number
  rating: number
  reviewCount: number
  documents: BusinessDocument[]
  services: BusinessService[]
}

export interface BusinessDocument {
  id: string
  type: 'license' | 'insurance' | 'certification' | 'other'
  name: string
  url: string
  uploadedAt: string
  status: 'pending' | 'approved' | 'rejected'
}

export interface BusinessService {
  id: string
  name: string
  description: string
  price: number
  duration: number // in minutes
  isActive: boolean
}

export interface BusinessFilters {
  verificationStatus?: string
  businessType?: string
  search?: string
}

export interface BusinessAction {
  type: 'verify' | 'reject' | 'suspend' | 'activate' | 'delete'
  businessId: string
  reason?: string
}
