-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create document embeddings table
CREATE TABLE IF NOT EXISTS document_embeddings (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    embedding VECTOR(1536), -- OpenAI text-embedding-3-small dimensions
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS document_embeddings_embedding_idx 
ON document_embeddings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create index for metadata queries
CREATE INDEX IF NOT EXISTS document_embeddings_metadata_idx 
ON document_embeddings USING GIN (metadata);

-- Function to search for similar documents
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  id TEXT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    document_embeddings.id,
    document_embeddings.content,
    document_embeddings.metadata,
    1 - (document_embeddings.embedding <=> query_embedding) AS similarity
  FROM document_embeddings
  WHERE 1 - (document_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY document_embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Function to check if embeddings table exists
CREATE OR REPLACE FUNCTION check_embeddings_table()
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'document_embeddings'
  );
END;
$$;

-- Enable Row Level Security (optional)
ALTER TABLE document_embeddings ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (adjust as needed)
CREATE POLICY "Allow public read access" ON document_embeddings
    FOR SELECT USING (true);

-- Create policy for public insert access (adjust as needed)  
CREATE POLICY "Allow public insert access" ON document_embeddings
    FOR INSERT WITH CHECK (true);

-- Create policy for public delete access (adjust as needed)
CREATE POLICY "Allow public delete access" ON document_embeddings
    FOR DELETE USING (true);