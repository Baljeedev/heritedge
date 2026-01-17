# Cloudflare R2 Setup Guide

## Overview

The API now supports uploading images and videos to Cloudflare R2. All file uploads are handled server-side, and the admin dashboard sends files to the API which then uploads them to R2.

## Installation

Install the required dependencies:

```bash
cd api
bun add @aws-sdk/client-s3 multer uuid
bun add -d @types/multer @types/uuid
```

## Environment Variables

Add these to your `.env` file in the `api` directory:

```env
# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=heritedge
R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com

# Optional: Custom domain for public access
# If you set up a custom domain for your R2 bucket, use it here
# Example: https://cdn.heritedge.com
R2_PUBLIC_URL=
```

## Getting R2 Credentials

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2** in the sidebar
3. Create a new bucket (or use existing)
4. Go to **Manage R2 API Tokens**
5. Create a new API token with:
   - **Permissions**: Object Read & Write
   - **TTL**: Optional (or set expiration)
6. Copy the credentials:
   - **Account ID**: Found in R2 dashboard URL or account settings
   - **Access Key ID**: From the API token
   - **Secret Access Key**: From the API token (only shown once!)

## Setting Up Public Access (Optional)

To make files publicly accessible:

1. In R2 bucket settings, enable **Public Access**
2. Optionally set up a custom domain:
   - Go to **Settings** → **Custom Domain**
   - Add your domain (e.g., `cdn.heritedge.com`)
   - Update DNS records as instructed
   - Set `R2_PUBLIC_URL=https://cdn.heritedge.com` in `.env`

## API Endpoints

### Upload Single File
```
POST /api/upload/:type
Content-Type: multipart/form-data

Parameters:
- type: "trip" | "monument" | "guide" | "experience" | "hotel" | "review"
- file: File (image or video)

Response:
{
  "url": "https://...",
  "key": "guides/uuid.jpg",
  "type": "image" | "video"
}
```

### Upload Multiple Files
```
POST /api/upload/:type/multiple
Content-Type: multipart/form-data

Parameters:
- type: "trip" | "monument" | "guide" | "experience" | "hotel" | "review"
- files: File[] (max 10 files)

Response:
{
  "files": [
    {
      "url": "https://...",
      "key": "guides/uuid.jpg",
      "type": "image",
      "originalName": "photo.jpg"
    }
  ]
}
```

## File Organization

Files are organized in R2 by type:
- `trips/` - Trip images
- `monuments/` - Heritage site images
- `guides/` - Guide profile images and videos
- `experiences/` - Experience images and videos
- `hotels/` - Hotel images
- `reviews/` - Review images

## File Limits

- **Max file size**: 100MB
- **Max files per request**: 10 (for multiple upload)
- **Allowed image types**: jpeg, jpg, png, webp, gif
- **Allowed video types**: mp4, webm, quicktime, avi

## Usage in Admin Dashboard

The admin dashboard forms now include file upload components:

- **Heritage Sites**: Image upload
- **Guides**: Image and video upload
- **Experiences**: Image and video upload
- **Hotels**: Multiple image upload
- **Trips**: Image upload

Files are automatically uploaded to R2 when selected, and the URL is saved in MongoDB.

## Security

- All upload endpoints require authentication (Clerk token)
- Files are validated by MIME type
- File size is limited to prevent abuse
- Files are stored with unique UUIDs to prevent conflicts

## Troubleshooting

### Files not uploading
- Check R2 credentials in `.env`
- Verify bucket name matches `R2_BUCKET_NAME`
- Check file size (must be < 100MB)
- Verify file type is allowed

### Files not accessible
- If using public access, ensure it's enabled in R2 settings
- If using custom domain, verify DNS is configured correctly
- Check `R2_PUBLIC_URL` matches your setup

### 401 Unauthorized
- Ensure you're authenticated (Clerk token in request)
- Check that `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set in admin dashboard

## Testing

Test the upload endpoint:

```bash
curl -X POST http://localhost:3001/api/upload/guide \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -F "file=@/path/to/image.jpg"
```