# IPFS Metadata Upload Setup Guide

## Overview

The Create Coin form now supports real IPFS metadata uploads using Pinata, a reliable IPFS service. This replaces the mock implementation with actual IPFS uploads that wait for data availability.

## Setup Instructions

### 1. Get Pinata API Credentials

1. Sign up at [https://app.pinata.cloud/](https://app.pinata.cloud/)
2. Go to the API Keys section
3. Create a new API key with pinning permissions
4. Choose one of these options:

**Option A: JWT Token (Recommended)**

- Copy the JWT token

**Option B: API Key + Secret**

- Copy the API Key and Secret API Key

### 2. Configure Environment Variables

Create a `.env.local` file in the `apps/web/` directory:

```bash
# Option A: JWT Token (recommended)
PINATA_JWT=your_pinata_jwt_token_here

# Option B: API Key + Secret (alternative)
# PINATA_API_KEY=your_pinata_api_key_here
# PINATA_SECRET_API_KEY=your_pinata_secret_api_key_here
```

### 3. How It Works

#### Real IPFS Upload Process:

1. User uploads JSON metadata file or creates metadata in the form
2. Metadata is validated for required fields (name, description, etc.)
3. Metadata is uploaded to IPFS via Pinata API
4. System waits for IPFS data to become available (up to 30 seconds)
5. Returns real `ipfs://` hash for use in coin creation

#### Features:

- ✅ Real IPFS uploads (no more mock hashes)
- ✅ Validation and error handling
- ✅ Waits for IPFS data availability
- ✅ Progress indicators during upload
- ✅ File upload or inline metadata creation
- ✅ Metadata preview
- ✅ Example metadata file download

## Usage

### Upload Metadata File:

1. Check "Upload/Create Metadata" checkbox
2. Click "Download example metadata.json" for reference
3. Upload your JSON file
4. Click "Upload to IPFS"
5. Wait for upload completion and availability check

### Create Metadata Inline:

1. Check "Upload/Create Metadata" checkbox
2. Fill in description, image URL, and external URL fields
3. Click "Use This Metadata"
4. System uploads to IPFS and updates the form

### Manual IPFS Hash:

1. Leave "Upload/Create Metadata" unchecked
2. Enter existing IPFS hash manually
3. Continue with coin creation

## Error Handling

If you see "IPFS service not configured" error:

- Make sure you've set up Pinata credentials in `.env.local`
- Restart your development server after adding environment variables

If upload fails:

- Check your Pinata API credentials
- Ensure you have sufficient Pinata storage quota
- Try again (temporary network issues)

## Testing

To test the upload functionality:

1. Set up Pinata credentials
2. Use the example metadata file
3. Upload and verify the returned IPFS hash works
4. Create a coin using the uploaded metadata

## Security Notes

- Never commit your `.env.local` file to version control
- Use JWT tokens when possible (more secure than API keys)
- Rotate your API keys regularly
- Monitor your Pinata usage and billing

## Troubleshooting

**"Metadata is not a valid JSON" error:**

- Ensure your JSON file is properly formatted
- Use the example metadata file as a template

**Upload hangs or times out:**

- Check your internet connection
- Verify Pinata service status
- Try uploading smaller metadata files

**IPFS hash not resolving:**

- Wait a few minutes for IPFS propagation
- Try accessing via different IPFS gateways
- Check if the data is available at `https://gateway.pinata.cloud/ipfs/[hash]`
