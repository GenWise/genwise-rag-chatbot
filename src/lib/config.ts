export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
  anthropic: {
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
  },
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  },
  app: {
    name: 'GenWise Student Data Assistant',
    allowedEmailDomain: 'genwise.in',
    maxMessagesPerSession: 50,
  },
} as const;

export const validateConfig = () => {
  const missingVars = [];
  
  if (!config.supabase.url) missingVars.push('VITE_SUPABASE_URL');
  if (!config.supabase.anonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');
  if (!config.anthropic.apiKey) missingVars.push('VITE_ANTHROPIC_API_KEY');
  if (!config.openai.apiKey) missingVars.push('VITE_OPENAI_API_KEY');
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};