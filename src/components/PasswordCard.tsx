
import React, { useState } from 'react';
import { Password } from '@/components/Dashboard';

interface PasswordCardProps {
  password: Password;
}

export const PasswordCard: React.FC<PasswordCardProps> = ({ password }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleGoToWebsite = () => {
    if (password.websiteLink) {
      window.open(password.websiteLink.startsWith('http') ? password.websiteLink : `https://${password.websiteLink}`, '_blank');
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden hover:bg-white/15 transition-all cursor-pointer">
      <div onClick={handleCardClick} className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-white truncate">{password.websiteName}</h3>
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
            </svg>
          </div>
        </div>
        
        <div className="space-y-1 text-sm">
          <p className="text-blue-200">
            <span className="text-blue-300">Username:</span> {password.username}
          </p>
          <p className="text-blue-200">
            <span className="text-blue-300">Password:</span> ••••••••
          </p>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-white/20 p-4 space-y-3">
          <div className="grid gap-3">
            <div>
              <label className="block text-xs font-medium text-blue-300 mb-1">Website Name</label>
              <div className="flex items-center space-x-2">
                <p className="text-white text-sm flex-1">{password.websiteName}</p>
              </div>
            </div>

            {password.websiteLink && (
              <div>
                <label className="block text-xs font-medium text-blue-300 mb-1">Website Link</label>
                <button
                  onClick={handleGoToWebsite}
                  className="text-white text-sm hover:text-blue-200 underline"
                >
                  {password.websiteLink}
                </button>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-blue-300 mb-1">Username</label>
              <div className="flex items-center space-x-2">
                <p className="text-white text-sm flex-1">{password.username}</p>
                <button
                  onClick={() => copyToClipboard(password.username, 'username')}
                  className="text-blue-300 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {password.email && (
              <div>
                <label className="block text-xs font-medium text-blue-300 mb-1">Email</label>
                <div className="flex items-center space-x-2">
                  <p className="text-white text-sm flex-1">{password.email}</p>
                  <button
                    onClick={() => copyToClipboard(password.email!, 'email')}
                    className="text-blue-300 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-blue-300 mb-1">Password</label>
              <div className="flex items-center space-x-2">
                <p className="text-white text-sm flex-1 font-mono">
                  {showPassword ? password.password : '••••••••••••'}
                </p>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-blue-300 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    )}
                  </svg>
                </button>
                <button
                  onClick={() => copyToClipboard(password.password, 'password')}
                  className="text-blue-300 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {password.purpose && (
              <div>
                <label className="block text-xs font-medium text-blue-300 mb-1">Purpose</label>
                <p className="text-white text-sm">{password.purpose}</p>
              </div>
            )}
          </div>

          {password.websiteLink && (
            <button
              onClick={handleGoToWebsite}
              className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition-all flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>Go to Website</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
