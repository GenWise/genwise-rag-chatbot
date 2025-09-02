# GenWise RAG Chatbot - Setup Instructions

## Quick Start Guide

### Step 1: Set up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Settings > API** and copy:
   - Project URL
   - Anon/public key
4. Go to **SQL Editor** and run the schema from `supabase/schema.sql`

### Step 2: Get API Keys

1. **OpenAI API Key**:
   - Go to [platform.openai.com](https://platform.openai.com)
   - Create an account and get your API key
   - Add some credits (~$5 minimum)

2. **Anthropic API Key**:
   - Go to [console.anthropic.com](https://console.anthropic.com)
   - Create an account and get your API key
   - Add some credits (~$5 minimum)

### Step 3: Environment Setup

Create a `.env` file in the project root:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

### Step 4: Install and Run

```bash
npm install
npm run dev
```

### Step 5: Deploy to Vercel

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Troubleshooting

### "Missing environment variables"
- Double-check all 4 environment variables are set
- Make sure there are no spaces around the = sign
- Restart the dev server after adding env vars

### "Failed to generate embeddings"
- Check OpenAI API key is valid
- Ensure you have credits in your OpenAI account
- Check browser console for detailed error messages

### "Supabase connection failed"
- Verify the Supabase URL and anon key
- Make sure the SQL schema was executed successfully
- Check if pgvector extension is enabled

### "Claude API error"
- Verify Anthropic API key is correct
- Ensure you have credits in your Anthropic account
- Try refreshing the page

## Next Steps

Once deployed, share the URL with your GenWise colleagues. They'll need to authenticate with their @genwise.in email addresses to access the chatbot.

The system will automatically:
1. Generate embeddings for all student data (one-time setup)
2. Enable intelligent querying of the data
3. Provide accurate answers to program-related questions

## Support

If you run into issues:
1. Check the browser console for error messages
2. Verify all API keys are working
3. Test the individual services (Supabase, OpenAI, Anthropic)
4. Contact the development team for assistance