import { useState, useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { LoadingScreen } from './LoadingScreen';
import type { ChatMessage as ChatMessageType, User } from '../types';
import { ragService } from '../services/ragService';
import { generateId } from '../lib/utils';
import { config } from '../lib/config';

interface ChatInterfaceProps {
  user: User;
  onLogout: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ user, onLogout }) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeRAG();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeRAG = async () => {
    try {
      setIsInitializing(true);
      setInitError(null);
      
      await ragService.initialize();
      
      // Add welcome message
      const welcomeMessage: ChatMessageType = {
        id: generateId(),
        content: `Hello ${user.email.split('@')[0]}! 👋

I'm your GenWise Student Data Assistant. I can help you analyze student data from our programs (2022-2025).

**What I can help with:**
• Student counts and statistics
• Program participation data
• School and city analysis
• Instructor and RC information
• Scholarship breakdowns
• Course enrollment details

**Example questions:**
• "How many students attended our programs in 2025?"
• "What were the top 5 schools by participation?"
• "Who were the RCs in 2025?"
• "How many sponsored students in 2025?"

Feel free to ask me anything about our student data!`,
        sender: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Failed to initialize RAG service:', error);
      setInitError(error instanceof Error ? error.message : 'Failed to initialize the system');
    } finally {
      setIsInitializing(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessageType = {
      id: generateId(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    const loadingMessage: ChatMessageType = {
      id: generateId(),
      content: '',
      sender: 'assistant',
      timestamp: new Date(),
      loading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setIsProcessing(true);

    try {
      // Get chat history (last 10 messages, excluding loading message)
      const chatHistory = messages.slice(-10).map(msg => ({
        role: msg.sender,
        content: msg.content,
      }));

      const result = await ragService.query(content, chatHistory);

      // Replace loading message with actual response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id
            ? {
                ...msg,
                content: result.answer,
                loading: false,
              }
            : msg
        )
      );
    } catch (error) {
      console.error('Failed to process query:', error);
      
      // Replace loading message with error
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id
            ? {
                ...msg,
                content: `I apologize, but I encountered an error while processing your query: ${error instanceof Error ? error.message : 'Unknown error'}

Please try again, or check that your API keys are configured correctly.`,
                loading: false,
              }
            : msg
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearChat = () => {
    setMessages(prev => prev.slice(0, 1)); // Keep only welcome message
  };

  const handleRetryInitialization = () => {
    initializeRAG();
  };

  if (isInitializing) {
    return (
      <LoadingScreen 
        message="Initializing GenWise Student Data Assistant..."
        error={initError}
        onRetry={handleRetryInitialization}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {config.app.name}
            </h1>
            <p className="text-sm text-gray-500">
              Logged in as {user.email}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleClearChat}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              disabled={isProcessing}
            >
              Clear Chat
            </button>
            
            <button
              onClick={onLogout}
              className="text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="max-w-4xl mx-auto w-full">
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isProcessing}
          placeholder="Ask about student data, programs, or statistics..."
        />
      </div>

      {/* Footer */}
      <div className="text-center py-2 text-xs text-gray-500 bg-white border-t border-gray-200">
        GenWise Student Data Assistant • Powered by Claude & OpenAI
      </div>
    </div>
  );
};