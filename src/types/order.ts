export interface Order {
  id: string;
  userId: string;
  businessId: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  pickupAddress: Address;
  deliveryAddress: Address;
  scheduledPickup: Date;
  scheduledDelivery: Date;
  actualPickup?: Date;
  actualDelivery?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  name: string;
  category: 'wash' | 'dry_clean' | 'iron' | 'fold';
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface OrderStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  revenue: number;
}
