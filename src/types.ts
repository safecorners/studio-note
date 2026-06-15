export type ActiveView = 
  | 'landing' 
  | 'pricing' 
  | 'login' 
  | 'dashboard' 
  | 'payment-confirmation' 
  | 'editor';

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: string;
  snippetCode?: string;
  isSnippet?: boolean;
}

export interface AttachmentItem {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'document' | 'snippet';
  url: string;
  active?: boolean;
}

export interface UserState {
  isAuthenticated: boolean;
  email: string;
  fullName: string;
  plan: 'free' | 'pro' | 'enterprise';
}

export interface OrderSummary {
  orderNumber: string;
  date: string;
  paymentMethod: string;
  totalPaid: string;
  planName: string;
}
