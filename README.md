# Cleanaid Admin Dashboard

A modern, production-ready admin dashboard for the Cleanaid mobile application built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

### ✅ Completed Features

- **Modern UI/UX**: Built with shadcn/ui components and Radix UI primitives
- **Responsive Design**: Mobile-first approach with responsive sidebar navigation
- **Type Safety**: Full TypeScript implementation throughout
- **Advanced Tables**: TanStack Table with sorting, filtering, pagination, and CSV export
- **Data Visualization**: Recharts integration for analytics and insights
- **State Management**: TanStack React Query for server state management
- **Design System**: Custom design system with Cleanaid branding (#12a87e)

### 📊 Dashboard Sections

1. **Dashboard**: KPI cards, recent activity, and overview metrics
2. **User Management**: Complete user management with advanced filtering and actions
3. **Business Management**: Business verification and management system
4. **Payments**: Transaction management with tabs for different payment types
5. **Analytics**: Comprehensive analytics with charts and date filtering
6. **Settings**: Access control and application configuration

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Data Fetching**: TanStack React Query
- **Tables**: TanStack Table v8
- **Charts**: Recharts
- **Icons**: Lucide React
- **Font**: Plus Jakarta Sans

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cleanaid-admin
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 API Integration

The dashboard now includes a comprehensive API client with Axios interceptors for seamless backend integration.

### ✅ API Client Features

- **Axios Interceptors**: Automatic JWT token attachment and error handling
- **React Query Integration**: Pre-built hooks for all API endpoints
- **Type Safety**: Full TypeScript support with proper type definitions
- **Error Handling**: Automatic token refresh, logout on 401, and error logging
- **Request/Response Logging**: Performance monitoring and debugging
- **Authentication**: NextAuth.js integration with automatic token management

### 1. Environment Configuration

Create a `.env.local` file in the root directory (or copy from `env.example`):

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 2. API Client Usage

The API client is now fully integrated. Here's how to use it:

#### Example: User Management with Live API

```typescript
import { useUsers, useToggleUserStatus, useDeleteUser } from '@/api/hooks'

function UsersPage() {
  // Fetch users with real API
  const { data: usersResponse, isLoading, error, refetch } = useUsers({
    page: 1,
    limit: 50,
    status: 'active'
  })

  // User actions with mutations
  const toggleStatusMutation = useToggleUserStatus({
    onSuccess: () => refetch()
  })

  const deleteUserMutation = useDeleteUser({
    onSuccess: () => refetch()
  })

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active'
    toggleStatusMutation.mutate({ id: userId, status: newStatus })
  }

  // Extract data from API response
  const users = usersResponse?.data || []
  const pagination = usersResponse?.pagination

  return (
    <div>
      {/* Your UI components */}
      {users.map(user => (
        <div key={user.id}>
          {user.name} - {user.status}
          <button onClick={() => handleToggleStatus(user.id, user.status)}>
            Toggle Status
          </button>
        </div>
      ))}
    </div>
  )
}
```

### 3. Available API Hooks

#### Users
- `useUsers(filters)` - Get paginated users with filtering
- `useUser(id)` - Get single user by ID
- `useUserStats()` - Get user statistics
- `useCreateUser()` - Create new user
- `useUpdateUser()` - Update user
- `useDeleteUser()` - Delete user
- `useToggleUserStatus()` - Suspend/activate user

#### Businesses
- `useBusinesses(filters)` - Get paginated businesses
- `useBusiness(id)` - Get single business
- `useBusinessStats()` - Get business statistics
- `useCreateBusiness()` - Create new business
- `useUpdateBusiness()` - Update business
- `useDeleteBusiness()` - Delete business
- `useUpdateBusinessStatus()` - Approve/reject business

#### Orders
- `useOrders(filters)` - Get paginated orders
- `useOrder(id)` - Get single order
- `useOrderStats()` - Get order statistics
- `useUpdateOrderStatus()` - Update order status

#### Payments
- `usePayments(filters)` - Get paginated payments
- `usePayment(id)` - Get single payment
- `usePaymentStats()` - Get payment statistics
- `useUpdatePaymentStatus()` - Update payment status

#### Analytics
- `useDashboardAnalytics()` - Get dashboard metrics
- `useRevenueAnalytics(period)` - Get revenue data
- `useUserGrowthAnalytics(period)` - Get user growth data

### 4. API Endpoints Structure

The API client is configured to work with the following endpoint structure:

#### Admin Endpoints (All require authentication)
- `GET /admin/users` - Get paginated list of users
- `GET /admin/users/:id` - Get user by ID
- `POST /admin/users` - Create new user
- `PUT /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Delete user
- `PATCH /admin/users/:id/status` - Toggle user status (suspend/activate)
- `GET /admin/users/stats` - Get user statistics

- `GET /admin/businesses` - Get paginated list of businesses
- `GET /admin/businesses/:id` - Get business by ID
- `POST /admin/businesses` - Create new business
- `PUT /admin/businesses/:id` - Update business
- `DELETE /admin/businesses/:id` - Delete business
- `PATCH /admin/businesses/:id/status` - Update business status
- `GET /admin/businesses/stats` - Get business statistics

- `GET /admin/laundry-orders` - Get all laundry orders
- `GET /admin/laundry-orders/:id` - Get order by ID
- `PATCH /admin/laundry-orders/:id/status` - Update order status
- `GET /admin/laundry-orders/stats` - Get order statistics

- `GET /admin/payments` - Get all payments
- `GET /admin/payments/:id` - Get payment by ID
- `PATCH /admin/payments/:id/status` - Update payment status
- `GET /admin/payments/stats` - Get payment statistics

- `GET /admin/analytics/dashboard` - Get dashboard analytics
- `GET /admin/analytics/revenue` - Get revenue analytics
- `GET /admin/analytics/user-growth` - Get user growth analytics

### 5. API Response Format

All API endpoints should return data in the following format:

```typescript
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### 6. Authentication

The API client automatically handles authentication by:
- Attaching JWT tokens from NextAuth session to all requests
- Handling 401 errors by automatically logging out users
- Redirecting to login page on authentication failures
- Supporting token refresh (can be extended)

### 7. Error Handling

The API client includes comprehensive error handling:

- **401 Unauthorized**: Automatically signs out user and redirects to login
- **403 Forbidden**: Logs error (can be extended with toast notifications)
- **500+ Server Errors**: Logs error (can be extended with toast notifications)
- **Network Errors**: Logs error (can be extended with toast notifications)
- **Request Timeout**: 10-second timeout with automatic retry
- **Retry Logic**: Configurable retry attempts for failed requests

### 8. Performance Monitoring

The API client includes built-in performance monitoring:

- Request timing logs for debugging
- Response time tracking
- Automatic logging of API calls
- Debug information for development

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard routes
│   │   ├── page.tsx       # Dashboard overview
│   │   ├── users/         # User management
│   │   ├── businesses/    # Business management
│   │   ├── payments/      # Payment management
│   │   ├── analytics/     # Analytics
│   │   ├── settings/      # Settings
│   │   └── layout.tsx     # Dashboard layout
│   ├── auth/             # Authentication pages
│   │   ├── login/        # Login page
│   │   └── register/     # Registration page
│   ├── api/              # API routes
│   │   └── auth/         # NextAuth.js API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── api/                   # API client
│   ├── api-client.ts     # Axios instance with interceptors
│   ├── admin.ts          # Admin API endpoints
│   ├── hooks.ts          # React Query hooks
│   └── index.ts          # Main exports
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   └── modals/           # Modal components
├── lib/                  # Utility functions
│   ├── auth.ts           # NextAuth.js configuration
│   ├── providers.tsx     # React Query provider
│   └── utils.ts          # Utility functions
└── types/                # TypeScript type definitions
    ├── user.ts           # User types
    ├── business.ts       # Business types
    ├── payment.ts        # Payment types
    ├── order.ts          # Order types
    ├── analytics.ts      # Analytics types
    └── next-auth.d.ts    # NextAuth type extensions
```

## 🎨 Design System

### Colors
- **Primary**: #06CCFE (Cleanaid Blue)
- **Secondary**: #059669
- **Accent**: #047857
- **Background**: HSL variables for light/dark mode support

### Typography
- **Font Family**: Plus Jakarta Sans
- **Weights**: 200-800 (variable font)

### Components
All components follow the shadcn/ui design system with custom theming for Cleanaid branding.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 📝 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript strict mode enabled
- ESLint configuration for Next.js
- Prettier for code formatting
- Consistent component structure

## 🔒 Security Considerations

- JWT token management
- Protected routes implementation
- Input validation and sanitization
- CORS configuration
- Rate limiting (implement in API)

## 📊 Performance

- Next.js 14 with App Router for optimal performance
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Optimized bundle sizes
- React Query for efficient data fetching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for Cleanaid**