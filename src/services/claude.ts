import Anthropic from '@anthropic-ai/sdk';
import { config } from '../lib/config';

export interface ChatResponse {
  content: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export class ClaudeService {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: config.anthropic.apiKey,
      dangerouslyAllowBrowser: true, // Required for client-side usage
    });
  }

  async generateResponse(
    userQuery: string,
    context: string,
    chatHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
  ): Promise<ChatResponse> {
    try {
      const systemPrompt = this.createSystemPrompt(context);
      
      // Build message history
      const messages = [
        ...chatHistory.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: 'user' as const,
          content: userQuery,
        },
      ];

      const response = await this.client.messages.create({
        model: 'claude-3-haiku-20240307', // Using Haiku for cost efficiency
        max_tokens: 1500,
        temperature: 0.1,
        system: systemPrompt,
        messages,
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      return {
        content: content.text,
        usage: {
          input_tokens: response.usage.input_tokens,
          output_tokens: response.usage.output_tokens,
        },
      };
    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private createSystemPrompt(context: string): string {
    return `You are a helpful assistant for GenWise, an educational organization that runs summer programs for students. You have access to student data from programs between 2022-2025.

IMPORTANT INSTRUCTIONS:
1. Answer questions ONLY using the provided context data
2. If you cannot find specific information in the context, clearly state "I don't have that information in the available data"
3. For numerical questions (counts, totals), provide exact numbers when possible
4. When mentioning schools, include common variations (e.g., "TVS schools include TVS Academy Hosur, TVS Tumkur, etc.")
5. For questions about specific years/programs, be precise about which program you're referencing
6. If asked about data not present in the context, suggest what data would be needed

CONTEXT DATA:
${context}

RESPONSE FORMAT:
- Be concise but comprehensive
- Use bullet points for lists
- Include relevant details like program names, years, and student categories
- If providing counts or statistics, show your reasoning
- Always maintain student privacy - don't share personal contact information unless specifically requested for operational purposes

Remember: You are specifically designed to help GenWise colleagues understand their program data. Be helpful, accurate, and professional.`;
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.client.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hello' }],
      });
      return true;
    } catch (error) {
      console.error('Claude connection test failed:', error);
      return false;
    }
  }
}

export const claudeService = new ClaudeService();