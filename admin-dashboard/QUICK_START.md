# Quick Start - Fix Missing Clerk Keys Error

## The Error You're Seeing

```
⨯ Error: @clerk/nextjs: Missing secretKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys.
```

## Solution: Create `.env.local` File

1. **Create the file** in the `admin-dashboard` directory:

```bash
cd admin-dashboard
touch .env.local
```

2. **Add these lines** to `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
```

3. **Get your Clerk keys**:
   - Go to https://dashboard.clerk.com
   - Sign in or create an account
   - Create a new application (or select existing)
   - Go to **API Keys** section
   - Copy the **Publishable Key** (starts with `pk_test_`)
   - Copy the **Secret Key** (starts with `sk_test_`)
   - Paste them into `.env.local`

4. **Restart your dev server**:

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

## Example `.env.local` File

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_51AbC123...
CLERK_SECRET_KEY=sk_test_51XyZ789...

# Optional: API URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## Important Notes

- ✅ The file must be named `.env.local` (not `.env`)
- ✅ It must be in the `admin-dashboard` directory (same level as `package.json`)
- ✅ Never commit this file to git (it's already in `.gitignore`)
- ✅ Restart the dev server after creating/updating the file

## After Setup

Once you've added the keys and restarted:
1. Go to http://localhost:3000
2. You'll be redirected to `/sign-in`
3. Sign in with **harshit.rai.verma@gmail.com**
4. You'll see the admin dashboard

If you sign in with a different email, you'll see nothing (blank page) - this is by design for security.