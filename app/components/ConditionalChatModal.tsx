'use client';

import { usePathname } from 'next/navigation';
import { ChatModal } from './ChatModal';

export function ConditionalChatModal() {
  const pathname = usePathname();
  
  // Only render the ChatModal on the /model/[id] pages
  if (!pathname.startsWith('/model/')) {
    return null;
  }
  
  return <ChatModal />;
} 