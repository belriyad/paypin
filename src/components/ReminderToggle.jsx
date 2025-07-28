import { useState } from 'react';

export default function ReminderToggle({ 
  initialEnabled = false, 
  onToggle = () => {}, 
  customerId = null,
  disabled = false,
  size = 'default' 
}) {
  const [isEnabled, setIsEnabled] = useState(initialEnabled);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newState = !isEnabled;
      setIsEnabled(newState);
      onToggle(newState, customerId);
      
    } catch (error) {
      console.error('Failed to toggle reminder:', error);
      // Could show a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    small: 'h-5 w-9',
    default: 'h-6 w-11', 
    large: 'h-7 w-12'
  };

  const toggleSizeClasses = {
    small: 'h-4 w-4',
    default: 'h-5 w-5',
    large: 'h-6 w-6'
  };

  const translateClasses = {
    small: 'translate-x-4',
    default: 'translate-x-5', 
    large: 'translate-x-5'
  };

  return (
    <div className="flex items-center space-x-3">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={handleToggle}
          disabled={disabled || isLoading}
          className="sr-only peer"
        />
        <div className={`
          ${sizeClasses[size]} 
          bg-gray-200 
          peer-focus:outline-none 
          peer-focus:ring-4 
          peer-focus:ring-blue-300 
          rounded-full 
          peer 
          peer-checked:after:${translateClasses[size]}
          peer-checked:after:border-white 
          after:content-[''] 
          after:absolute 
          after:top-[2px] 
          after:left-[2px] 
          after:bg-white 
          after:border-gray-300 
          after:border 
          after:rounded-full 
          ${toggleSizeClasses[size]}
          after:transition-all 
          peer-checked:bg-blue-600
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300 peer-checked:hover:bg-blue-700'}
          ${isLoading ? 'opacity-75' : ''}
        `}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="animate-spin h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </div>
      </label>
      
      <div className="flex flex-col">
        <span className={`text-sm font-medium ${isEnabled ? 'text-green-700' : 'text-gray-500'}`}>
          {isEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {size !== 'small' && (
          <span className="text-xs text-gray-400">
            {isEnabled ? 'Customer will receive reminders' : 'No reminders will be sent'}
          </span>
        )}
      </div>
    </div>
  );
}
