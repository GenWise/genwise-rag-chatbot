import { useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { cn } from '../lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  disabled = false,
  placeholder = "Ask about student data, programs, or statistics..."
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
      <div className="flex space-x-3">
        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={cn(
              'block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm',
              'placeholder-gray-400 shadow-sm resize-none',
              'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
              'disabled:bg-gray-50 disabled:cursor-not-allowed',
              'max-h-32 overflow-y-auto scrollbar-hide'
            )}
            style={{ minHeight: '40px' }}
          />
        </div>
        
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className={cn(
            'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium',
            'bg-blue-600 text-white shadow-sm transition-colors',
            'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            'disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500'
          )}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          <span className="ml-2 hidden sm:inline">Send</span>
        </button>
      </div>
      
      <div className="mt-2 flex flex-wrap gap-2">
        {/* Quick action buttons */}
        {!disabled && (
          <>
            <button
              type="button"
              onClick={() => setMessage("How many students attended our programs in 2025?")}
              className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Student Count 2025
            </button>
            <button
              type="button"
              onClick={() => setMessage("What were the top 5 schools by participation?")}
              className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Top Schools
            </button>
            <button
              type="button"
              onClick={() => setMessage("Who were the RCs in 2025?")}
              className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
            >
              RCs 2025
            </button>
          </>
        )}
      </div>
    </form>
  );
};