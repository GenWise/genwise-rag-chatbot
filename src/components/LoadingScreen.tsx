
interface LoadingScreenProps {
  message: string;
  error?: string | null;
  onRetry?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message, error, onRetry }) => {
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Initialization Failed</h2>
          <p className="text-sm text-gray-600 mb-6">{error}</p>
          
          <div className="space-y-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Retry Initialization
              </button>
            )}
            
            <div className="text-xs text-gray-500 space-y-1">
              <p>Common issues:</p>
              <ul className="text-left space-y-1">
                <li>• Missing or invalid API keys</li>
                <li>• Network connectivity issues</li>
                <li>• Supabase database not configured</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 mb-4">
          <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
            <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Loading</h2>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        
        <div className="text-xs text-gray-500">
          This may take a few moments...
        </div>
      </div>
    </div>
  );
};