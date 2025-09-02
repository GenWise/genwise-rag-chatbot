import type { ChatMessage as ChatMessageType } from '../types';
import { cn } from '../lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={cn('flex w-full mb-4', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'chat-message max-w-[80%] rounded-lg p-4 shadow-sm',
          isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-white text-gray-900 border border-gray-200'
        )}
      >
        {message.loading ? (
          <div className="flex items-center space-x-2">
            <div className="loading-dots">
              <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm opacity-70">Thinking...</span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="prose prose-sm max-w-none">
              {message.content.split('\n').map((line, index) => {
                if (line.trim() === '') {
                  return <br key={index} />;
                }
                
                // Handle bullet points
                if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                  return (
                    <div key={index} className="flex items-start space-x-2">
                      <span>•</span>
                      <span>{line.trim().substring(1).trim()}</span>
                    </div>
                  );
                }
                
                // Handle numbered lists
                const numberedMatch = line.match(/^\s*(\d+\.)\s*(.+)/);
                if (numberedMatch) {
                  return (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="font-medium">{numberedMatch[1]}</span>
                      <span>{numberedMatch[2]}</span>
                    </div>
                  );
                }
                
                // Handle headers/sections
                if (line.toUpperCase() === line && line.length > 5) {
                  return (
                    <h4 key={index} className="font-semibold text-sm mt-3 mb-1">
                      {line}
                    </h4>
                  );
                }
                
                return <p key={index} className="mb-1">{line}</p>;
              })}
            </div>
            
            {/* Timestamp */}
            <div className={cn(
              'text-xs opacity-60 mt-2',
              isUser ? 'text-blue-100' : 'text-gray-500'
            )}>
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};