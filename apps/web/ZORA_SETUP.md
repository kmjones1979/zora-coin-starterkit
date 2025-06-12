# Zora API Setup Guide

The updated Zora Coins SDK (v0.2.1) requires an API key to access the Zora API. Without this key, the coin data will show as "N/A" and chains will appear as "Unknown Chain".

## Getting Your API Key

1. **Visit Zora**: Go to [https://zora.co](https://zora.co)
2. **Sign in**: Connect your wallet and sign in to your account
3. **Developer Settings**: Navigate to [https://zora.co/settings/developer](https://zora.co/settings/developer)
4. **Create API Key**: Generate a new API key for your application

## Setting Up the Environment Variable

1. **Create environment file**: In your project root (`apps/web/`), create a `.env.local` file:

```bash
# In apps/web/.env.local
NEXT_PUBLIC_ZORA_API_KEY=your-actual-api-key-here
```

2. **Replace the placeholder**: Replace `your-actual-api-key-here` with your actual API key from Zora

3. **Restart your development server**: Stop your current `npm run dev` and start it again

## Verification

After setting up the API key:

1. Check your browser console - you should see: "✅ Zora SDK initialized with API key"
2. The coin data should now load properly instead of showing "N/A"
3. Chain names should display correctly (e.g., "Base", "Zora", etc.)

## Troubleshooting

- **Still seeing "N/A" data?** Check that:

    - Your `.env.local` file is in the `apps/web/` directory
    - The API key variable is named exactly `NEXT_PUBLIC_ZORA_API_KEY`
    - You've restarted your development server
    - Your API key is valid (not expired or rate-limited)

- **Console warnings?** Check the browser console for specific error messages about the API key

## Rate Limits

With an API key, you get higher rate limits. Without one, the API may return limited or no data due to rate limiting.
