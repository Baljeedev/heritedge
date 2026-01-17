# Cloudflare R2 Integration Complete

## Overview

The admin dashboard and API have been fully integrated with Cloudflare R2 for image and video uploads. All file uploads are handled server-side - the admin dashboard sends files to the API, which uploads them to R2 and saves the URLs in MongoDB.

## What Was Implemented

### Backend (API)

1. **R2 Configuration** (`api/src/config/r2.ts`)
   - S3-compatible client for Cloudflare R2
   - Configurable via environment variables

2. **R2 Upload Service** (`api/src/services/r2-upload.ts`)
   - `uploadToR2()` - Upload files to R2
   - `deleteFromR2()` - Delete files from R2
   - `extractKeyFromUrl()` - Extract R2 key from URL

3. **Upload Routes** (`api/src/routes/upload.ts`)
   - `POST /api/upload/:type` - Upload single file
   - `POST /api/upload/:type/multiple` - Upload multiple files
   - Supports: trip, monument, guide, experience, hotel, review
   - File validation (type, size)
   - Authentication required

4. **Updated Package.json**
   - Added `@aws-sdk/client-s3` for R2
   - Added `multer` for file upload handling
   - Added `uuid` types

### Frontend (Admin Dashboard)

1. **Upload API Client** (`admin-dashboard/lib/api/upload.ts`)
   - `uploadApi.upload()` - Upload single file
   - `uploadApi.uploadMultiple()` - Upload multiple files

2. **File Upload Component** (`admin-dashboard/components/ui/file-upload.tsx`)
   - Reusable file upload component
   - Supports images and videos
   - Single and multiple file uploads
   - Preview functionality
   - Loading states
   - Error handling

3. **Updated Forms**
   - **Heritage Sites**: Image upload
   - **Guides**: Image and video upload (for local guides)
   - **Experiences**: Image and video upload (workshops and music shows)
   - **Hotels**: Multiple image upload
   - **Trips**: Image upload

## File Organization in R2

Files are organized by type in R2:
```
heritedge/
├── trips/
│   └── uuid.jpg
├── monuments/
│   └── uuid.jpg
├── guides/
│   ├── uuid.jpg (profile image)
│   └── uuid.mp4 (video)
├── experiences/
│   ├── uuid.jpg (image)
│   └── uuid.mp4 (video)
├── hotels/
│   └── uuid.jpg
└── reviews/
    └── uuid.jpg
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd api
bun install
```

The following packages are already added to `package.json`:
- `@aws-sdk/client-s3`
- `multer`
- `uuid`

### 2. Configure Environment Variables

Add to `api/.env`:

```env
# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=heritedge
R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com

# Optional: Custom domain for public access
# Example: https://cdn.heritedge.com
R2_PUBLIC_URL=
```

### 3. Get R2 Credentials

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2** → Create bucket (name it `heritedge`)
3. Go to **Manage R2 API Tokens** → Create API token
4. Copy credentials to `.env`

### 4. Set Up Public Access (Optional)

For public file access:
1. In R2 bucket settings, enable **Public Access**
2. Optionally set up custom domain
3. Set `R2_PUBLIC_URL` in `.env` if using custom domain

## Usage

### In Admin Dashboard

1. **Heritage Sites**: Click "Upload File" → Select image → Automatically uploaded to R2
2. **Guides**: Upload profile image and optional video
3. **Experiences**: Upload image and optional video (for workshops/music shows)
4. **Hotels**: Upload multiple images
5. **Trips**: Upload trip image

All files are automatically:
- Uploaded to R2
- URL saved in MongoDB
- Displayed in the form preview

### API Endpoints

**Upload Single File:**
```bash
POST /api/upload/guide
Content-Type: multipart/form-data
Authorization: Bearer <clerk_token>

Body:
- file: <file>
```

**Upload Multiple Files:**
```bash
POST /api/upload/hotel/multiple
Content-Type: multipart/form-data
Authorization: Bearer <clerk_token>

Body:
- files: <file1>, <file2>, ...
```

## File Limits

- **Max file size**: 100MB
- **Max files per request**: 10 (multiple upload)
- **Allowed image types**: jpeg, jpg, png, webp, gif
- **Allowed video types**: mp4, webm, quicktime, avi

## Security

- ✅ All upload endpoints require authentication
- ✅ File type validation (MIME type checking)
- ✅ File size limits
- ✅ Unique filenames (UUID-based)
- ✅ Server-side upload (no direct client-to-R2 access)

## Features

### For Guides
- Upload profile image
- Upload video (for local guides to showcase their work)
- Both saved to R2 and URLs stored in MongoDB

### For Experiences (Workshops & Music Shows)
- Upload image
- Upload video (optional)
- Both saved to R2

### For Hotels
- Upload multiple images
- All saved to R2
- URLs stored as array in MongoDB

## Testing

1. Start the API server:
```bash
cd api
bun run dev
```

2. Start the admin dashboard:
```bash
cd admin-dashboard
npm run dev
```

3. Sign in to admin dashboard
4. Try uploading a file in any form
5. Check R2 bucket to verify file was uploaded
6. Check MongoDB to verify URL was saved

## Troubleshooting

**Files not uploading:**
- Check R2 credentials in `.env`
- Verify bucket name matches
- Check file size (< 100MB)
- Verify file type is allowed

**401 Unauthorized:**
- Ensure you're signed in to admin dashboard
- Check Clerk token is being sent

**Files not accessible:**
- Enable public access in R2 bucket settings
- Set up custom domain if needed
- Update `R2_PUBLIC_URL` in `.env`

## Next Steps

1. Install dependencies: `cd api && bun install`
2. Set up R2 bucket and get credentials
3. Add credentials to `api/.env`
4. Test uploads in admin dashboard
5. (Optional) Set up custom domain for public access

All code is ready - just configure R2 credentials and you're good to go! 🚀