// Shared types for the Bill Payments module

export type BillStatus = 'pending' | 'approved' | 'paid' | 'overdue' | 'rejected' | 'scheduled';

export interface Activity {
  type: 'uploaded' | 'approved' | 'rejected' | 'paid' | 'scheduled' | 'comment' | 'edited';
  user: string;
  date: string;
  comment?: string;
}

export interface Bill {
  id: string;
  vendor: string;
  vendorId?: string;
  amount: number;
  dueDate: string;
  status: BillStatus;
  category: string;
  notes: string;
  invoiceNumber: string;
  uploadedDate: string;
  activities: Activity[];
  paymentMethod?: string;
  paidDate?: string;
  scheduledDate?: string;
  isRecurring?: boolean;
  recurringFrequency?: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  attachmentUrl?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  paymentTerms?: string;
  totalPaid: number;
  billsCount: number;
  createdAt: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  fee: string;
  processingTime: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  approved: number;
  paid: number;
  overdue: number;
  scheduled: number;
  billCount: number;
}

export const CATEGORIES = [
  'Software Licenses',
  'Office Supplies',
  'IT Services',
  'Utilities',
  'Professional Services',
  'Marketing',
  'Travel',
  'Insurance',
  'Rent',
  'Equipment',
  'Subscriptions',
  'Other',
] as const;

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'ach',
    name: 'ACH Transfer',
    description: 'Direct bank transfer (1-2 business days)',
    icon: 'Zap',
    fee: 'Free',
    processingTime: '1-2 business days',
  },
  {
    id: 'wire',
    name: 'Wire Transfer',
    description: 'Fast domestic wire (same day)',
    icon: 'ArrowRightLeft',
    fee: '₹25',
    processingTime: 'Same day',
  },
  {
    id: 'credit',
    name: 'Credit Card',
    description: 'Credit/debit card payment',
    icon: 'CreditCard',
    fee: '2.9% + ₹0.30',
    processingTime: 'Instant',
  },
  {
    id: 'check',
    name: 'Check',
    description: 'Mailed check payment (3-5 business days)',
    icon: 'FileCheck',
    fee: '₹5',
    processingTime: '3-5 business days',
  },
];

export function getStatusColor(status: BillStatus): string {
  switch (status) {
    case 'paid':
      return 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-400';
    case 'approved':
      return 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-400';
    case 'pending':
      return 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-400';
    case 'overdue':
      return 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-400';
    case 'rejected':
      return 'bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400';
    case 'scheduled':
      return 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-400';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400';
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isOverdue(dueDate: string, status: BillStatus): boolean {
  if (status === 'paid' || status === 'rejected') return false;
  return new Date(dueDate) < new Date();
}

export function getDaysUntilDue(dueDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getDueDateLabel(dueDate: string, status: BillStatus): { label: string; className: string } {
  if (status === 'paid') {
    return { label: 'Paid', className: 'text-green-600' };
  }
  
  const days = getDaysUntilDue(dueDate);
  
  if (days < 0) {
    return { label: `${Math.abs(days)} days overdue`, className: 'text-red-600 font-semibold' };
  } else if (days === 0) {
    return { label: 'Due today', className: 'text-orange-600 font-semibold' };
  } else if (days === 1) {
    return { label: 'Due tomorrow', className: 'text-orange-500' };
  } else if (days <= 7) {
    return { label: `Due in ${days} days`, className: 'text-amber-600' };
  }
  
  return { label: formatDate(dueDate), className: 'text-foreground/70' };
}
