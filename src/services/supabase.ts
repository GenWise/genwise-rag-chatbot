import { createClient } from '@supabase/supabase-js';
import { config } from '../lib/config';

export const supabase = createClient(config.supabase.url, config.supabase.anonKey);

export interface VectorRecord {
  id: string;
  content: string;
  embedding: number[];
  metadata: any;
  created_at?: string;
}

export class SupabaseVectorStore {
  private tableName = 'document_embeddings';

  async initializeDatabase(): Promise<void> {
    // Check if the table exists and create if it doesn't
    const { error } = await supabase.rpc('check_embeddings_table');
    if (error) {
      console.log('Creating embeddings table...');
      // The table will be created via SQL migration
    }
  }

  async insertVectors(records: VectorRecord[]): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .insert(records);

    if (error) {
      throw new Error(`Failed to insert vectors: ${error.message}`);
    }
  }

  async searchSimilar(
    queryEmbedding: number[],
    limit: number = 10,
    threshold: number = 0.7
  ): Promise<VectorRecord[]> {
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: limit,
    });

    if (error) {
      throw new Error(`Search failed: ${error.message}`);
    }

    return data || [];
  }

  async searchByMetadata(filters: Record<string, any>): Promise<VectorRecord[]> {
    let query = supabase.from(this.tableName).select('*');
    
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(`metadata->${key}`, value);
    });

    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Metadata search failed: ${error.message}`);
    }

    return data || [];
  }

  async deleteAll(): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .neq('id', ''); // Delete all records

    if (error) {
      throw new Error(`Failed to delete vectors: ${error.message}`);
    }
  }

  async getCount(): Promise<number> {
    const { count, error } = await supabase
      .from(this.tableName)
      .select('id', { count: 'exact' });

    if (error) {
      throw new Error(`Failed to get count: ${error.message}`);
    }

    return count || 0;
  }
}

export const vectorStore = new SupabaseVectorStore();