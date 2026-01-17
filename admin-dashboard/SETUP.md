# Admin Dashboard Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the `admin-dashboard` directory:

```bash
cd admin-dashboard
touch .env.local
```

Add the following environment variables:

```env
# Clerk Authentication (REQUIRED)
# Get these from https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# API Base URL (Optional - defaults to http://localhost:3000)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### 3. Get Clerk Keys

1. Go to [clerk.com](https://clerk.com) and sign up/login
2. Create a new application (or use an existing one)
3. Go to **API Keys** in the dashboard
4. Copy:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)
5. Paste them into your `.env.local` file

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Important Notes

### Email Restriction

The admin dashboard is **restricted to one email address only**:
- **Allowed Email**: `harshit.rai.verma@gmail.com`
- Users with other email addresses will see nothing (blank page)
- Unauthenticated users will be redirected to `/sign-in`

### Troubleshooting

#### Error: Missing secretKey

**Solution**: Make sure you have `CLERK_SECRET_KEY` in your `.env.local` file. The key should start with `sk_test_` or `sk_live_`.

#### Error: Missing publishableKey

**Solution**: Make sure you have `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in your `.env.local` file. The key should start with `pk_test_` or `pk_live_`.

#### Middleware Deprecation Warning

This is just a warning. The middleware will continue to work. If you want to remove the warning, you can rename `middleware.ts` to `proxy.ts`, but the current setup works fine.

#### 404 Errors on Admin Routes

Make sure:
1. You're logged in with the correct email (`harshit.rai.verma@gmail.com`)
2. The Clerk keys are correctly set in `.env.local`
3. You've restarted the dev server after adding environment variables

### Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ Yes | Clerk publishable key (starts with `pk_`) |
| `CLERK_SECRET_KEY` | ✅ Yes | Clerk secret key (starts with `sk_`) |
| `NEXT_PUBLIC_API_BASE_URL` | ❌ No | Backend API URL (defaults to `http://localhost:3000`) |

### File Structure

```
admin-dashboard/
├── .env.local          # Your environment variables (create this)
├── .env.example        # Example environment file
├── middleware.ts       # Clerk authentication middleware
├── app/
│   ├── layout.tsx      # Root layout with ClerkProvider
│   ├── sign-in/        # Sign-in page
│   └── admin/          # Protected admin routes
└── components/
    ├── admin-guard.tsx # Email-based access control
    └── header.tsx      # Header with UserButton
```

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Create `.env.local` with Clerk keys
3. ✅ Start dev server: `npm run dev`
4. ✅ Sign in with `harshit.rai.verma@gmail.com`
5. ✅ Start managing your heritage tourism platform!