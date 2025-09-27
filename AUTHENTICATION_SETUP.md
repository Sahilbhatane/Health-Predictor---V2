# Authentication Setup Guide

This guide will help you set up NextAuth.js with Google OAuth for your Health Predictor application.

## 🚀 Quick Setup

### 1. Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Generate a NextAuth secret:
   ```bash
   # For Windows (if openssl not available):
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   
   # For Linux/Mac:
   openssl rand -base64 32
   ```
   Add this to `NEXTAUTH_SECRET` in your `.env.local` file.

### 2. Google OAuth Setup

1. **Go to Google Cloud Console**: https://console.cloud.google.com/

2. **Create or Select a Project**:
   - Click on the project dropdown at the top
   - Create a new project or select an existing one

3. **Enable Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

4. **Create OAuth Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://health-predictor-v2.vercel.app/api/auth/callback/google` (for production)

5. **Copy Credentials**:
   - Copy the Client ID and Client Secret
   - Add them to your `.env.local` file:
     ```env
     GOOGLE_CLIENT_ID=your-client-id-here
     GOOGLE_CLIENT_SECRET=your-client-secret-here
     ```

### 3. Update Your Environment File

Your `.env.local` should look like this:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**For production (Vercel), update:**
```env
NEXTAUTH_URL=https://health-predictor-v2.vercel.app
```

### 4. Install Dependencies (Already Done)

The following packages are already installed:
- `next-auth` - Authentication framework
- `@next-auth/prisma-adapter` - Database adapter (if using Prisma)

### 5. Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit: http://localhost:3000

3. Click "Sign In" button in the navbar or homepage

4. Try both Google OAuth and demo credentials:
   - **Demo Email**: admin@healthpredictor.com
   - **Demo Password**: admin123

## 🔐 Features Implemented

### ✅ Authentication System
- [x] NextAuth.js setup with Google OAuth
- [x] Demo credentials provider
- [x] Secure session management
- [x] TypeScript types for sessions

### ✅ UI/UX Components
- [x] Professional glassmorphism sign-in page with Google OAuth
- [x] Expandable user menu with 3 organized tabs
- [x] Account tab (Profile, History, Notifications)
- [x] Subscription tab (Monthly/Annual/Enterprise plans)
- [x] Support tab (Help Center, Contact options)
- [x] Login button strategically placed on homepage
- [x] Responsive design with smooth animations
- [x] Subscription modal with detailed plan comparison

### ✅ Protected Content
- [x] Recommendations tab requires authentication
- [x] Medicine suggestions only for logged-in users
- [x] Auth guard component for protected content
- [x] Elegant auth prompts with feature highlights

### ✅ Protected Routes
All prediction forms now have protected sections:
- **Heart Disease**: Recommendations + Medicine suggestions
- **Diabetes**: Prevention + Supplement recommendations
- **Parkinson's**: Neurological care + Treatment options
- **Common Diseases**: General recommendations + Medicine tab

## 🎨 Design Features

- **Gradient backgrounds** and glassmorphism effects
- **Animated hover states** and smooth transitions
- **Consistent theming** matching your app's blue/violet palette
- **Mobile-responsive** design
- **Loading states** and error handling
- **HIPAA-compliant messaging** and security badges

## 🔧 Customization

### Adding More OAuth Providers

Edit `app/api/auth/[...nextauth]/route.ts`:

```typescript
import GitHubProvider from "next-auth/providers/github"

providers: [
  GoogleProvider({...}),
  GitHubProvider({
    clientId: process.env.GITHUB_ID!,
    clientSecret: process.env.GITHUB_SECRET!,
  }),
]
```

### Custom User Database

To store users in a database, add a database adapter:

```bash
npm install @next-auth/prisma-adapter prisma @prisma/client
```

Update the NextAuth configuration with the Prisma adapter.

## 🚨 Security Notes

1. **Never commit `.env.local`** - it's in `.gitignore`
2. **Use strong secrets** in production
3. **Enable HTTPS** in production
4. **Regularly rotate secrets**
5. **Monitor authentication logs**

## 📱 Production Deployment (Vercel)

### ✅ Google Cloud Console Setup
Your redirect URIs are correctly configured:
- `http://localhost:3000/api/auth/callback/google` (development)
- `https://health-predictor-v2.vercel.app/api/auth/callback/google` (production)

**✅ Keep both URIs** - This allows you to:
- Test locally during development
- Use the same Google OAuth app for production

### Vercel Environment Variables
In your Vercel dashboard, add these environment variables:

```env
NEXTAUTH_URL=https://health-predictor-v2.vercel.app
NEXTAUTH_SECRET=your-generated-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Security Checklist
1. ✅ **Environment files protected** - `.env*.local` is in `.gitignore`
2. ✅ **Redirect URIs configured** - Both development and production URLs added
3. ✅ **Secure secrets** - Use different secrets for development and production
4. ✅ **HTTPS enforced** - Vercel automatically provides HTTPS
5. ✅ **Domain restricted** - OAuth restricted to your specific domain

## 🎯 Next Steps

The authentication system is now fully functional! Users can:
- Sign in with Google or demo credentials
- Access protected health recommendations
- View personalized medicine suggestions
- Enjoy a seamless, secure experience

All prediction models now require authentication for advanced features while keeping basic predictions accessible to everyone.