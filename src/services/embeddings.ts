import { config } from '../lib/config';

export interface EmbeddingResponse {
  embedding: number[];
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

export class OpenAIEmbeddingService {
  private apiKey: string;
  private apiUrl = 'https://api.openai.com/v1/embeddings';
  private model = 'text-embedding-3-small';

  constructor() {
    this.apiKey = config.openai.apiKey;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          input: text.substring(0, 8000), // Limit to ~8k chars to stay within token limits
          encoding_format: 'float',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.data[0].embedding;
    } catch (error) {
      console.error('Failed to generate embedding:', error);
      throw error;
    }
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    // Process in batches to avoid rate limits
    const batchSize = 100;
    const embeddings: number[][] = [];

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const batchPromises = batch.map(text => this.generateEmbedding(text));
      
      try {
        const batchEmbeddings = await Promise.all(batchPromises);
        embeddings.push(...batchEmbeddings);
        
        // Add delay between batches to respect rate limits
        if (i + batchSize < texts.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Failed to process batch ${i}-${i + batchSize}:`, error);
        throw error;
      }
    }

    return embeddings;
  }

  getEmbeddingDimensions(): number {
    return 1536; // text-embedding-3-small dimensions
  }

  getModel(): string {
    return this.model;
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.generateEmbedding('test');
      return true;
    } catch (error) {
      console.error('OpenAI connection test failed:', error);
      return false;
    }
  }
}

export const embeddingService = new OpenAIEmbeddingService();