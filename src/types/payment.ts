export interface Payment {
  id: string
  type: 'payment' | 'refund' | 'withdrawal' | 'credit' | 'manual'
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  description: string
  userId?: string
  businessId?: string
  orderId?: string
  paymentMethod: 'card' | 'bank_transfer' | 'wallet' | 'cash' | 'manual'
  transactionId?: string
  reference?: string
  createdAt: string
  processedAt?: string
  metadata?: Record<string, unknown>
}

export interface PaymentFilters {
  type?: string
  status?: string
  paymentMethod?: string
  dateRange?: {
    from: string
    to: string
  }
  search?: string
}

export interface ManualTransaction {
  type: 'credit' | 'debit'
  amount: number
  userId: string
  businessId?: string
  description: string
  reference?: string
}

export interface RefundRequest {
  paymentId: string
  amount: number
  reason: string
  userId: string
}

export interface WithdrawalRequest {
  businessId: string
  amount: number
  bankAccount: {
    accountNumber: string
    routingNumber: string
    accountHolderName: string
  }
  reason?: string
}

export interface CreditRequest {
  userId: string
  amount: number
  reason: string
  expiresAt?: string
}
