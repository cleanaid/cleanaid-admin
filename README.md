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

The dashboard is designed to work with a Node.js/Express API. Here's how to integrate with your backend:

### 1. Update API Base URL

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_API_KEY=your-api-key-here
```

### 2. Replace Mock Data

All pages currently use mock data. Replace the `useQuery` calls with real API endpoints:

#### Example: User Management API Integration

```typescript
// Replace this mock implementation:
const { data: users = [], isLoading } = useQuery({
  queryKey: ['users', filters],
  queryFn: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return mockUsers
  },
})

// With real API calls:
const { data: users = [], isLoading } = useQuery({
  queryKey: ['users', filters],
  queryFn: async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) throw new Error('Failed to fetch users')
    return response.json()
  },
})
```

### 3. Required API Endpoints

The dashboard expects the following API endpoints:

#### Users
- `GET /api/users` - Get all users with filtering
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/:id/actions` - User actions (suspend, activate, etc.)

#### Businesses
- `GET /api/businesses` - Get all businesses
- `GET /api/businesses/:id` - Get business details
- `PUT /api/businesses/:id` - Update business
- `POST /api/businesses/:id/verify` - Verify business
- `POST /api/businesses/:id/reject` - Reject business

#### Payments
- `GET /api/payments` - Get all transactions
- `GET /api/payments/:id` - Get transaction details
- `POST /api/payments/manual` - Create manual transaction
- `POST /api/payments/:id/refund` - Process refund
- `POST /api/payments/withdrawals` - Process withdrawal

#### Analytics
- `GET /api/analytics/general` - General analytics data
- `GET /api/analytics/vendors` - Vendor analytics
- `GET /api/analytics/users` - User analytics

#### Settings
- `GET /api/settings` - Get all settings
- `PUT /api/settings/access-control` - Update access control settings
- `PUT /api/settings/application` - Update application settings

### 4. Authentication

Implement JWT-based authentication:

```typescript
// Create auth context
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  
  // Add authentication logic here
  
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### 5. Error Handling

Add global error handling:

```typescript
// In your QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error.status === 401) {
          // Redirect to login
          return false
        }
        return failureCount < 3
      },
    },
  },
})
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Dashboard route group
│   │   ├── dashboard/     # Dashboard page
│   │   ├── users/         # User management
│   │   ├── businesses/    # Business management
│   │   ├── payments/      # Payment management
│   │   ├── analytics/     # Analytics
│   │   ├── settings/      # Settings
│   │   └── layout.tsx     # Dashboard layout
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   └── modals/           # Modal components
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
└── types/                # TypeScript type definitions
```

## 🎨 Design System

### Colors
- **Primary**: #12a87e (Cleanaid Green)
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