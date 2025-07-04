'use client';

import { useState } from 'react';
import { Sparkles, X, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

const quickActions = [
  "Make sensitivities for revenue growth",
  "Create scenario analysis for EBITDA margins",
  "Generate cash flow projections",
  "Analyze working capital assumptions"
];

export function ChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleQuickAction = (action: string) => {
    setMessage(action);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Modal */}
      <div
        className={cn(
          "fixed bottom-24 right-6 w-96 rounded-3xl bg-white shadow-2xl transition-all duration-200 ease-in-out max-h-[calc(100vh-120px)]",
          "border border-gray-100 flex flex-col",
          isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        )}
      >
        {/* Modal Header */}
        <div className="bg-blue-600 rounded-t-3xl p-6 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/10 rounded-full p-2 w-10 h-10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Hi there 👋</h2>
          <p className="text-white/90 text-lg">How can I help with your model?</p>
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <div className="rounded-2xl bg-blue-50 p-4 max-w-[85%]">
                <p className="text-sm text-gray-900">
                  I can help you analyze your financial model and provide insights. What would you like to know?
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions and Input */}
        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          <div className="flex flex-wrap gap-2 mb-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm text-blue-600 hover:bg-blue-100 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Send us a message"
                className="w-full rounded-full border border-gray-200 pl-4 pr-12 py-3 text-sm focus:border-blue-500 focus:outline-none"
              />
              <button 
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-400 hover:text-blue-600"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:bg-blue-700 cursor-pointer",
          "hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        )}
      >
        <Sparkles className="h-6 w-6" />
      </button>
    </div>
  );
} 