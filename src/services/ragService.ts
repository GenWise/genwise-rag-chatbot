import { dataProcessor } from '../lib/dataProcessor';
import { embeddingService } from './embeddings';
import { claudeService } from './claude';
import { vectorStore } from './supabase';
import type { VectorRecord } from './supabase';

export interface QueryResult {
  answer: string;
  sources: VectorRecord[];
  processingTime: number;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export class RAGService {
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Check if embeddings already exist
      const count = await vectorStore.getCount();
      
      if (count === 0) {
        console.log('No embeddings found, generating...');
        await this.generateEmbeddings();
      } else {
        console.log(`Found ${count} existing embeddings`);
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize RAG service:', error);
      throw error;
    }
  }

  async generateEmbeddings(): Promise<void> {
    try {
      // Get chunks from data processor
      const chunks = dataProcessor.generateChunksForEmbedding();
      console.log(`Generating embeddings for ${chunks.length} chunks...`);

      // Generate embeddings in batches
      const batchSize = 50;
      const records: VectorRecord[] = [];

      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        const texts = batch.map(chunk => chunk.content);
        
        console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(chunks.length/batchSize)}`);
        
        const embeddings = await embeddingService.generateEmbeddings(texts);
        
        batch.forEach((chunk, index) => {
          records.push({
            id: chunk.id,
            content: chunk.content,
            embedding: embeddings[index],
            metadata: chunk.metadata,
          });
        });
      }

      // Store embeddings in Supabase
      await vectorStore.insertVectors(records);
      console.log(`Successfully stored ${records.length} embeddings`);
    } catch (error) {
      console.error('Failed to generate embeddings:', error);
      throw error;
    }
  }

  async query(
    userQuery: string,
    chatHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
  ): Promise<QueryResult> {
    const startTime = Date.now();

    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Preprocess query
      const processedQuery = this.preprocessQuery(userQuery);
      
      // Get relevant context through hybrid search
      const context = await this.hybridSearch(processedQuery, userQuery);
      
      // Generate response with Claude
      const response = await claudeService.generateResponse(
        userQuery,
        context,
        chatHistory
      );

      // Get source documents for transparency
      const queryEmbedding = await embeddingService.generateEmbedding(processedQuery);
      const sources = await vectorStore.searchSimilar(queryEmbedding, 5, 0.6);

      return {
        answer: response.content,
        sources,
        processingTime: Date.now() - startTime,
        usage: response.usage,
      };
    } catch (error) {
      console.error('Query failed:', error);
      throw error;
    }
  }

  private preprocessQuery(query: string): string {
    let processedQuery = query.toLowerCase();

    // Handle common abbreviations and variations
    const replacements: Record<string, string> = {
      'rc': 'RC Regional Coordinator regional coordinator',
      'rcs': 'RCs Regional Coordinators regional coordinators',
      'regional coordinator': 'RC Regional Coordinator regional coordinator',
      'regional coordinators': 'RCs Regional Coordinators regional coordinators',
      'ta': 'TA Teaching Assistant teaching assistant',
      'tas': 'TAs Teaching Assistants teaching assistants',
      'teaching assistant': 'TA Teaching Assistant teaching assistant',
      'tvs': 'TVS Academy TVS School TVS Hosur TVS Tumkur',
      'kumarans': 'Sri Kumaran Kumarans Kumar Children Public School',
      'dps': 'Delhi Public School DPS',
      'jnv': 'Jawahar Navodaya Vidyalaya Navodaya',
      'gems': 'GEMS Modern Academy GEMS Genesis GEMS Our Own',
      'vibgyor': 'VIBGYOR High School VIBGYOR Rise',
      'greenwood': 'Greenwood High International School',
      'inventure': 'Inventure Academy',
    };

    Object.entries(replacements).forEach(([key, replacement]) => {
      if (processedQuery.includes(key)) {
        processedQuery += ` ${replacement}`;
      }
    });

    return processedQuery;
  }

  private async hybridSearch(processedQuery: string, originalQuery: string): Promise<string> {
    try {
      // Semantic search
      const queryEmbedding = await embeddingService.generateEmbedding(processedQuery);
      const semanticResults = await vectorStore.searchSimilar(queryEmbedding, 8, 0.5);

      // Keyword-based search for specific queries
      const keywordResults = this.performKeywordSearch(originalQuery);

      // Combine and deduplicate results
      const combinedResults = this.combineSearchResults(semanticResults, keywordResults);

      // Create context from top results
      return this.createContext(combinedResults, originalQuery);
    } catch (error) {
      console.error('Hybrid search failed:', error);
      // Fallback to simple data processor search
      const records = dataProcessor.searchRecords(originalQuery);
      return this.createFallbackContext(records);
    }
  }

  private performKeywordSearch(query: string): VectorRecord[] {
    const results: VectorRecord[] = [];
    const queryLower = query.toLowerCase();

    // Check for specific patterns
    if (queryLower.includes('total') || queryLower.includes('how many')) {
      // Add program summaries for aggregation queries
      const summaries = dataProcessor.getAllProgramSummaries();
      summaries.forEach(summary => {
        results.push({
          id: `program_${summary.program}`,
          content: `Program ${summary.program}: ${summary.total_students} students`,
          embedding: [],
          metadata: { type: 'program', program: summary.program },
        });
      });
    }

    // Extract year from query
    const yearMatch = query.match(/20\d{2}/);
    if (yearMatch) {
      const year = yearMatch[0];
      const summaries = dataProcessor.getAllProgramSummaries().filter(s => s.year === year);
      summaries.forEach(summary => {
        results.push({
          id: `program_${summary.program}`,
          content: this.formatProgramSummary(summary),
          embedding: [],
          metadata: { type: 'program', program: summary.program, year: summary.year },
        });
      });
    }

    return results.slice(0, 5); // Limit keyword results
  }

  private combineSearchResults(semantic: VectorRecord[], keyword: VectorRecord[]): VectorRecord[] {
    const combined = [...semantic];
    const seenIds = new Set(semantic.map(r => r.id));

    // Add unique keyword results
    keyword.forEach(result => {
      if (!seenIds.has(result.id)) {
        combined.push(result);
        seenIds.add(result.id);
      }
    });

    return combined.slice(0, 10); // Limit total results
  }

  private createContext(results: VectorRecord[], query: string): string {
    if (results.length === 0) {
      return 'No relevant data found for this query.';
    }

    let context = 'RELEVANT DATA:\n\n';
    
    results.forEach((result, index) => {
      context += `[${index + 1}] ${result.content}\n\n`;
    });

    // Add aggregated statistics if query asks for counts
    if (query.toLowerCase().includes('total') || query.toLowerCase().includes('how many')) {
      context += this.addAggregatedStats();
    }

    return context;
  }

  private createFallbackContext(records: any[]): string {
    if (records.length === 0) {
      return 'No relevant data found for this query.';
    }

    let context = 'RELEVANT DATA (from keyword search):\n\n';
    records.slice(0, 10).forEach((record, index) => {
      context += `[${index + 1}] Student: ${record.student_name}, School: ${record.school_name}, Program: ${record.program_name}\n`;
    });

    return context;
  }

  private formatProgramSummary(summary: any): string {
    return `Program: ${summary.program}
Year: ${summary.year}, Month: ${summary.month}
Total Students: ${summary.total_students}
Tracks: ${summary.tracks.join(', ')}
Courses: ${summary.courses.join(', ')}
Instructors: ${summary.instructors.join(', ')}
RCs: ${summary.rcs.join(', ')}
Schools: ${summary.schools.join(', ')}`;
  }

  private addAggregatedStats(): string {
    const summaries = dataProcessor.getAllProgramSummaries();
    let stats = '\nAGGREGATED STATISTICS:\n';

    const totalStudents = summaries.reduce((sum, s) => sum + s.total_students, 0);
    stats += `Total students across all programs: ${totalStudents}\n`;

    // Year-wise breakdown
    const yearStats = summaries.reduce((acc, s) => {
      acc[s.year] = (acc[s.year] || 0) + s.total_students;
      return acc;
    }, {} as Record<string, number>);

    stats += 'Students by year:\n';
    Object.entries(yearStats).forEach(([year, count]) => {
      stats += `  ${year}: ${count} students\n`;
    });

    return stats;
  }

  async refreshEmbeddings(): Promise<void> {
    await vectorStore.deleteAll();
    await this.generateEmbeddings();
  }

  async getStats(): Promise<{ totalEmbeddings: number; programs: number; students: number }> {
    const totalEmbeddings = await vectorStore.getCount();
    const summaries = dataProcessor.getAllProgramSummaries();
    const totalStudents = summaries.reduce((sum, s) => sum + s.total_students, 0);

    return {
      totalEmbeddings,
      programs: summaries.length,
      students: totalStudents,
    };
  }
}

export const ragService = new RAGService();