# GenWise Student Data RAG Chatbot

A cost-effective RAG (Retrieval-Augmented Generation) chatbot for GenWise colleagues to query student program data from 2022-2025. Built with React, TypeScript, Supabase, and Claude AI.

## 🚀 Features

- **Smart Query Processing**: Handles aggregation queries, school name variations, and time-based filtering
- **Hybrid Search**: Combines semantic search with keyword matching for accurate results
- **Email Domain Restriction**: Access limited to @genwise.in email addresses
- **Mobile-Responsive**: Works seamlessly on desktop and mobile devices
- **Real-time Chat**: Interactive chat interface with typing indicators
- **Cost-Effective**: Minimal running costs (~$0.10 setup + pay-per-use API calls)

## 🛠️ Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier)
- OpenAI API key
- Anthropic API key

### 2. Environment Setup

Create a `.env` file with:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `supabase/schema.sql` in the Supabase SQL editor
3. Enable the pgvector extension if not automatically enabled

### 4. Local Development

```bash
npm install
npm run dev
```

### 5. Deployment to Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 📝 Sample Queries

- "What were the total number of students who attended our program in 2025 May?"
- "How many sponsored students in 2025?"
- "What were the top 5 schools in terms of number of students?"
- "Who were the RCs in 2025?"
- "How many students came on a full scholarship in 2025? What were their names?"
- "How many students were from the TVS schools in 2025?"

---

**Built with ❤️ for the GenWise team**