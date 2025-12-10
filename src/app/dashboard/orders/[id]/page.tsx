"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useOrder } from "@/api/hooks"
import { LaundryInfoCard, DeliveryInfoCard, ClothCollectionCard, ClothGroupingCard } from "@/components/orders"
import type { ApiResponse } from "@/api/api-client"

interface Location {
  formattedAddress?: string
  [key: string]: unknown
}

interface ClothImage {
  url?: string
  [key: string]: unknown
}

interface Collection {
  id: string
  name: string
  isInOrder: boolean
}

interface Cloth {
  id: string
  type: string
  clotheType: string
  images: (string | ClothImage)[]
  allergy?: string
  bestPacking?: string
  otherService?: string[]
  washType?: string
  collection?: string | { id: string; [key: string]: unknown }
}

interface OrderDetailData {
  orderId: string
  customer?: {
    id: string
    name: string
    email: string
    phone: string
    profileImage?: string
    location?: Location
  } | null
  business?: {
    id: string
    businessName: string
    businessAddress: string
    businessPhone: string
    businessEmail: string
    rating?: number
  } | null
  collections?: Collection[]
  clothes?: Cloth[]
  paymentDetails?: {
    discountAmount: number
    totalAmount: number
    paymentStatus: string
    isPaymentInit: boolean
  }
  status?: string
  orderInfo?: {
    isNewOrder: boolean
    deliveryDate: string | Date
    hasExpired: boolean
    createdAt: string | Date
    updatedAt: string | Date
  }
  pickup?: {
    date: string | Date | null
    isPickedUp: boolean
    washingCompleted: boolean
    washingCompletedAt: string | Date | null
  }
}

interface CollectionData {
  id: string
  name: string
  clothesCount: number
  servicesCount: number
  price: number
  badges: Array<{ label: string; color: "red" | "yellow" }>
}

interface ClothGroupingData {
  clothType: string
  quantity: number
  services: string[]
  allergyInformation: string
  images: string[]
  price: number
  badges: Array<{ label: string; color: "red" | "yellow" | "blue" | "green" }>
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  
  const { data: orderResponse, isLoading, error } = useOrder(orderId)
  const orderData = (orderResponse as ApiResponse<OrderDetailData>)?.data
  const isSuccess = (orderResponse as ApiResponse<OrderDetailData>)?.success ?? false

  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"collection" | "clothes">("collection")

  // Debug logging in development
  if (process.env.NODE_ENV === "development") {
    console.log("Order ID:", orderId)
    console.log("Order Response:", orderResponse)
    console.log("Order Data:", orderData)
    console.log("Error:", error)
    console.log("Is Loading:", isLoading)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="mt-2 text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !orderData || !isSuccess) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">
            {error 
              ? `Error: ${error instanceof Error ? error.message : "Unknown error"}` 
              : !isSuccess
              ? "Failed to load order details. Please try again."
              : "Order not found or error loading order details."}
          </p>
          {error && process.env.NODE_ENV === "development" && (
            <p className="text-xs text-gray-400 mt-2">Order ID: {orderId}</p>
          )}
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  // Extract order data from API response structure
  const orderIdDisplay = orderData.orderId || orderId
  const orderPrice = orderData.paymentDetails?.totalAmount || 0
  const paymentStatusRaw = orderData.paymentDetails?.paymentStatus || "pending"
  const paymentStatus: "pending" | "paid" | "failed" | "complete" = 
    paymentStatusRaw === "paid" ? "complete" : 
    (paymentStatusRaw === "pending" || paymentStatusRaw === "failed" ? paymentStatusRaw : "pending")
  
  // Calculate collections, clothes, and services from order data
  const collections = orderData.collections?.length || 0
  const clothes = orderData.clothes?.length || 0
  // Count unique services from clothes
  const allServices = orderData.clothes?.flatMap((cloth: Cloth) => [
    ...(cloth.otherService || []),
    cloth.washType,
    cloth.bestPacking,
  ].filter(Boolean)) || []
  const uniqueServices = [...new Set(allServices)]
  const services = uniqueServices.length || 0

  const customerInfo = orderData.customer
    ? {
        id: orderData.customer.id || "N/A",
        name: orderData.customer.name || "Unknown",
        address: orderData.customer.location?.formattedAddress || "N/A",
        phone: orderData.customer.phone || "N/A",
        email: orderData.customer.email || "N/A",
      }
    : undefined

  const businessInfo = orderData.business
    ? {
        id: orderData.business.id || "N/A",
        name: orderData.business.businessName || "Unknown",
        address: orderData.business.businessAddress || "N/A",
        phone: orderData.business.businessPhone || "N/A",
        email: orderData.business.businessEmail || "N/A",
      }
    : undefined

  // Extract delivery information
  const pickupLocation = customerInfo?.address || "N/A"
  const formatDateToString = (date: string | Date | null | undefined): string => {
    if (!date) return new Date().toISOString()
    if (typeof date === "string") return date
    return date.toISOString()
  }
  const pickupTime = formatDateToString(orderData.pickup?.date || orderData.orderInfo?.createdAt)
  const deliveryTime = formatDateToString(orderData.orderInfo?.deliveryDate)
  const progressMilestone = orderData.status || "pending"
  const deliveryStatus = progressMilestone === "cloth_pickup" 
    ? "Out for pick up" 
    : progressMilestone === "complete" 
    ? "Delivered" 
    : progressMilestone === "cloth_washed"
    ? "In transit"
    : "Pending"
  const progressPercentage = progressMilestone === "cloth_pickup" 
    ? 20 
    : progressMilestone === "cloth_washed" 
    ? 60 
    : progressMilestone === "complete" 
    ? 100 
    : 10

  // Transform collections data from API
  const collectionsData: CollectionData[] = orderData.collections?.map((collection: Collection) => {
    // Count clothes in this collection
    const collectionClothes = orderData.clothes?.filter((cloth: Cloth) => {
      const clothCollectionId = typeof cloth.collection === "string" 
        ? cloth.collection 
        : cloth.collection?.id?.toString()
      return clothCollectionId === collection.id?.toString()
    }) || []
    const clothesCount = collectionClothes.length
    
    // Count services in this collection
    const collectionServices = collectionClothes.flatMap((cloth: Cloth) => [
      ...(cloth.otherService || []),
      cloth.washType,
      cloth.bestPacking,
    ].filter(Boolean))
    const servicesCount = [...new Set(collectionServices)].length
    
    // Calculate collection price (sum of clothes prices or use a default)
    const collectionPrice = collectionClothes.reduce((sum: number) => {
      // You might need to add price field to clothes or calculate it differently
      return sum + 2000 // Default price per cloth
    }, 0) || 0

    return {
      id: collection.id,
      name: collection.name || "Unnamed Collection",
      clothesCount,
      servicesCount,
      price: collectionPrice,
      badges: collection.isInOrder ? [{ label: "E", color: "red" as const }, { label: "T", color: "yellow" as const }] : [],
    }
  }) || []

  // Transform cloth groupings data from API
  const clothGroupingsData: ClothGroupingData[] = orderData.clothes?.map((cloth: Cloth) => {
    const services = [
      ...(cloth.otherService || []),
      cloth.washType,
      cloth.bestPacking,
    ].filter(Boolean) as string[]

    const images = cloth.images?.map((img: string | ClothImage) => 
      typeof img === "string" ? img : img.url
    ).filter((url): url is string => Boolean(url)) || []

    return {
      clothType: cloth.clotheType || cloth.type || "Unknown",
      quantity: 1, // Each cloth is individual
      services,
      allergyInformation: cloth.allergy || "",
      images,
      price: 2000, // Default or calculate from cloth data
      badges: [],
    }
  }) || []

  // Filter collections/clothes based on search and filter
  const filteredCollections = collectionsData.filter((collection: CollectionData) =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredClothes = clothGroupingsData.filter((cloth: ClothGroupingData) =>
    cloth.clothType.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Laundry Information</h1>
        </div>
        <div className="flex items-center gap-2">
          
          <Button variant="destructive">Check message</Button>
        </div>
      </div>

      {/* Laundry Information Section */}
      <LaundryInfoCard
        orderId={orderIdDisplay}
        orderPrice={orderPrice}
        paymentStatus={paymentStatus}
        collections={collections}
        clothes={clothes}
        services={services}
        customerInfo={customerInfo}
        businessInfo={businessInfo}
      />

      {/* Delivery Information Section */}
      <DeliveryInfoCard
        pickupLocation={pickupLocation}
        pickupTime={pickupTime}
        deliveryTime={deliveryTime}
        deliveryStatus={deliveryStatus}
        statusTimestamp={formatDateToString(orderData.orderInfo?.updatedAt || orderData.orderInfo?.createdAt)}
        progressPercentage={progressPercentage}
      />

      {/* Cloth Gallery Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Cloth Gallery</h2>
        
        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={(value: "collection" | "clothes") => setFilterType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="collection">Collection</SelectItem>
              <SelectItem value="clothes">Clothes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Collections or Clothes Grid */}
        {filterType === "collection" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCollections.map((collection: CollectionData, index: number) => (
              <ClothCollectionCard
                key={index}
                collectionName={collection.name}
                clothesCount={collection.clothesCount}
                servicesCount={collection.servicesCount}
                collectionPrice={collection.price}
                badges={collection.badges}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClothes.map((cloth: ClothGroupingData, index: number) => (
              <ClothGroupingCard
                key={index}
                clothType={cloth.clothType}
                quantity={cloth.quantity}
                services={cloth.services}
                allergyInformation={cloth.allergyInformation}
                images={cloth.images}
                clothPrice={cloth.price}
                badges={cloth.badges}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

