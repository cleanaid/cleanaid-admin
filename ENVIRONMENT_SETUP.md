# Environment Setup Guide

## Quick Fix for Internal Server Errors

If you're experiencing internal server errors, follow these steps:

### 1. Clear Cache and Restart
```bash
# Stop the development server (Ctrl+C)
# Then run these commands:

rm -rf .next
rm -rf node_modules/.cache
npm run dev
```

### 2. Environment Variables (Optional)

Create a `.env.local` file in the root directory with these variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (Optional - currently disabled)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_API_KEY=your-api-key-here
```

### 3. Current Status

- ✅ **Authentication**: Working with email/password (demo credentials)
- ⏸️ **Google OAuth**: Temporarily disabled (can be enabled later)
- ✅ **All Pages**: Dashboard, Users, Businesses, Payments, Analytics, Settings
- ✅ **Mobile Responsive**: All UI fixes applied
- ✅ **Primary Color**: #06CCFE applied throughout

### 4. Demo Credentials

Use these credentials to test the application:

- **Email**: `admin@cleanaid.com`
- **Password**: `admin123`

### 5. Troubleshooting

If you still get errors:

1. **Check Node.js version**: Ensure you're using Node.js 18+
2. **Clear all caches**: `rm -rf .next node_modules/.cache`
3. **Reinstall dependencies**: `rm -rf node_modules && npm install`
4. **Check port availability**: Make sure port 3000 is not in use

### 6. Features Working

- ✅ Login/Register pages
- ✅ Protected routes
- ✅ Dashboard with KPI cards
- ✅ User management
- ✅ Business management
- ✅ Payments management
- ✅ Analytics with charts
- ✅ Settings pages
- ✅ Mobile responsive design
- ✅ Hover effects and animations

The application should now work without internal server errors!
