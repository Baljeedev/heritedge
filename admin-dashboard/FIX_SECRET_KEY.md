# Fix: Missing CLERK_SECRET_KEY Error

## The Problem

You're seeing this error:
```
⨯ Error: @clerk/nextjs: Missing secretKey
```

This means you've added `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` but **you're missing `CLERK_SECRET_KEY`**.

## The Solution

You need **BOTH** keys in your `.env.local` file:

### 1. Open your `.env.local` file

Make sure it's in the `admin-dashboard` directory (same folder as `package.json`).

### 2. Add the Secret Key

Your `.env.local` should look like this:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_51AbC123...
CLERK_SECRET_KEY=sk_test_51XyZ789...
```

### 3. Get Your Secret Key from Clerk

1. Go to https://dashboard.clerk.com
2. Sign in to your account
3. Select your application
4. Go to **API Keys** (or **Developers** → **API Keys**)
5. You'll see **two keys**:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`) ← You already have this
   - **Secret Key** (starts with `sk_test_` or `sk_live_`) ← **You need to add this!**
6. Click **Show** or **Copy** next to the Secret Key
7. Add it to your `.env.local` file as `CLERK_SECRET_KEY=sk_test_...`

### 4. Important Notes

- ✅ The Secret Key is **different** from the Publishable Key
- ✅ Secret Key starts with `sk_test_` (for development) or `sk_live_` (for production)
- ✅ Publishable Key starts with `pk_test_` (for development) or `pk_live_` (for production)
- ✅ **Never share your Secret Key** - it's private!

### 5. Restart Your Dev Server

After adding `CLERK_SECRET_KEY` to `.env.local`:

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

## Verify Your Setup

You can run this command to check if both keys are set:

```bash
node check-env.js
```

Or manually check your `.env.local` file contains both:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## Still Having Issues?

1. **Make sure the file is named `.env.local`** (not `.env` or `.env.example`)
2. **Make sure it's in the `admin-dashboard` directory** (same level as `package.json`)
3. **Make sure there are no spaces** around the `=` sign
4. **Make sure you restarted the dev server** after adding the key
5. **Check for typos** - the variable name must be exactly `CLERK_SECRET_KEY`

## Example `.env.local` File

Here's what a complete `.env.local` file should look like:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_51AbC123def456ghi789jkl012mno345pqr678stu901vwx234yz
CLERK_SECRET_KEY=sk_test_51XyZ789abc012def345ghi678jkl901mno234pqr567stu890vwx123yz

# Optional: API URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

**Note**: The actual keys will be much longer than shown above. Just make sure both are present!