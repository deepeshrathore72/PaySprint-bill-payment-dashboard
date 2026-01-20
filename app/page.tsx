'use client';

import { useState, useCallback } from 'react';
import { BillsDashboard } from '@/components/bills-dashboard';
import { AddBillModal } from '@/components/add-bill-modal';
import { BillDetailsModal } from '@/components/bill-details-modal';
import { PaymentFlowModal } from '@/components/payment-flow-modal';
import { AssignmentDocumentation } from '@/components/assignment-documentation';
import { Tab } from '@headlessui/react';
import { Toaster, toast } from 'sonner';
import { Bill, Activity } from '@/lib/types';
import { 
  FileText, 
  LayoutDashboard,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

type ModalType = 'add-bill' | 'bill-details' | 'payment' | null;

// Initial sample data
const initialBills: Bill[] = [
  {
    id: '1',
    vendor: 'Acme Software Inc.',
    amount: 2500,
    dueDate: '2026-02-15',
    status: 'pending',
    category: 'Software Licenses',
    notes: 'Monthly subscription renewal for development tools',
    invoiceNumber: 'INV-2026-001',
    uploadedDate: '2026-01-15T09:30:00',
    priority: 'medium',
    activities: [
      { type: 'uploaded', user: 'John Doe', date: '2026-01-15T09:30:00' },
    ],
  },
  {
    id: '2',
    vendor: 'Global Supplies Ltd',
    amount: 1250,
    dueDate: '2026-01-10',
    status: 'overdue',
    category: 'Office Supplies',
    notes: 'Q1 supplies order - desk accessories and stationery',
    invoiceNumber: 'INV-2026-002',
    uploadedDate: '2026-01-05T14:20:00',
    priority: 'high',
    activities: [
      { type: 'uploaded', user: 'Jane Smith', date: '2026-01-05T14:20:00' },
      { type: 'approved', user: 'Finance Team', date: '2026-01-07T10:15:00' },
    ],
  },
  {
    id: '3',
    vendor: 'Tech Support Plus',
    amount: 800,
    dueDate: '2026-02-01',
    status: 'approved',
    category: 'IT Services',
    notes: 'Monthly IT support contract - includes 24/7 helpdesk',
    invoiceNumber: 'INV-2026-003',
    uploadedDate: '2026-01-14T11:00:00',
    priority: 'medium',
    activities: [
      { type: 'uploaded', user: 'Admin', date: '2026-01-14T11:00:00' },
      { type: 'approved', user: 'John Doe', date: '2026-01-15T15:45:00' },
    ],
  },
  {
    id: '4',
    vendor: 'Energy Provider Co.',
    amount: 3500,
    dueDate: '2026-01-20',
    status: 'paid',
    category: 'Utilities',
    notes: 'Monthly electricity bill for main office',
    invoiceNumber: 'INV-2026-004',
    uploadedDate: '2025-12-20T08:00:00',
    paidDate: '2026-01-02T16:30:00',
    priority: 'low',
    activities: [
      { type: 'uploaded', user: 'Admin', date: '2025-12-20T08:00:00' },
      { type: 'approved', user: 'Finance', date: '2025-12-21T09:00:00' },
      { type: 'paid', user: 'John Doe', date: '2026-01-02T16:30:00' },
    ],
  },
  {
    id: '5',
    vendor: 'Cloud Hosting Services',
    amount: 4200,
    dueDate: '2026-02-10',
    status: 'pending',
    category: 'IT Services',
    notes: 'Annual cloud infrastructure renewal',
    invoiceNumber: 'INV-2026-005',
    uploadedDate: '2026-01-18T10:00:00',
    isRecurring: true,
    recurringFrequency: 'yearly',
    priority: 'high',
    activities: [
      { type: 'uploaded', user: 'DevOps Team', date: '2026-01-18T10:00:00' },
    ],
  },
  {
    id: '6',
    vendor: 'Marketing Agency Pro',
    amount: 6500,
    dueDate: '2026-01-25',
    status: 'approved',
    category: 'Marketing',
    notes: 'Q1 marketing campaign services',
    invoiceNumber: 'INV-2026-006',
    uploadedDate: '2026-01-12T09:00:00',
    priority: 'medium',
    activities: [
      { type: 'uploaded', user: 'Marketing', date: '2026-01-12T09:00:00' },
      { type: 'approved', user: 'CEO', date: '2026-01-14T11:00:00' },
    ],
  },
  {
    id: '7',
    vendor: 'Office Rent LLC',
    amount: 12000,
    dueDate: '2026-02-01',
    status: 'pending',
    category: 'Rent',
    notes: 'February office rent payment',
    invoiceNumber: 'INV-2026-007',
    uploadedDate: '2026-01-19T08:00:00',
    isRecurring: true,
    recurringFrequency: 'monthly',
    priority: 'high',
    activities: [
      { type: 'uploaded', user: 'Admin', date: '2026-01-19T08:00:00' },
    ],
  },
];

export default function Home() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [bills, setBills] = useState<Bill[]>(initialBills);

  const selectedBill = selectedBillId ? bills.find((b) => b.id === selectedBillId) : null;

  // Open bill details modal
  const openBillDetails = useCallback((billId: string) => {
    setSelectedBillId(billId);
    setActiveModal('bill-details');
  }, []);

  // Add new bill
  const handleAddBill = useCallback((newBill: Bill) => {
    setBills((prev) => [...prev, newBill]);
    setActiveModal(null);
    toast.success('Bill Added', {
      description: `${newBill.vendor} - ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(newBill.amount)}`,
      icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
    });
  }, []);

  // Initiate payment for a bill
  const handlePayment = useCallback((billId: string) => {
    setSelectedBillId(billId);
    setActiveModal('payment');
  }, []);

  // Complete payment
  const handleCompletePayment = useCallback((billId: string, scheduledDate?: string) => {
    setBills((prev) =>
      prev.map((bill) =>
        bill.id === billId
          ? {
              ...bill,
              status: scheduledDate ? 'scheduled' : 'paid',
              paidDate: scheduledDate ? undefined : new Date().toISOString(),
              scheduledDate,
              activities: [
                ...bill.activities,
                {
                  type: scheduledDate ? 'scheduled' : 'paid',
                  user: 'Current User',
                  date: new Date().toISOString(),
                  comment: scheduledDate ? `Payment scheduled for ${new Date(scheduledDate).toLocaleDateString()}` : undefined,
                } as Activity,
              ],
            }
          : bill
      )
    );
    setActiveModal(null);
    
    if (scheduledDate) {
      toast.success('Payment Scheduled', {
        description: `Payment will be processed on ${new Date(scheduledDate).toLocaleDateString()}`,
        icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
      });
    } else {
      toast.success('Payment Successful', {
        description: 'The payment has been processed successfully',
        icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
      });
    }
  }, []);

  // Approve a bill
  const handleApproveBill = useCallback((billId: string) => {
    setBills((prev) =>
      prev.map((bill) =>
        bill.id === billId
          ? {
              ...bill,
              status: 'approved',
              activities: [
                ...bill.activities,
                {
                  type: 'approved',
                  user: 'Current User',
                  date: new Date().toISOString(),
                } as Activity,
              ],
            }
          : bill
      )
    );
    const bill = bills.find((b) => b.id === billId);
    toast.success('Bill Approved', {
      description: `${bill?.vendor} is now ready for payment`,
      icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
    });
    setActiveModal(null);
  }, [bills]);

  // Reject a bill
  const handleRejectBill = useCallback((billId: string, reason: string) => {
    setBills((prev) =>
      prev.map((bill) =>
        bill.id === billId
          ? {
              ...bill,
              status: 'rejected',
              activities: [
                ...bill.activities,
                {
                  type: 'rejected',
                  user: 'Current User',
                  date: new Date().toISOString(),
                  comment: reason,
                } as Activity,
              ],
            }
          : bill
      )
    );
    const bill = bills.find((b) => b.id === billId);
    toast.error('Bill Rejected', {
      description: `${bill?.vendor} has been rejected`,
      icon: <AlertCircle className="w-5 h-5 text-red-600" />,
    });
    setActiveModal(null);
  }, [bills]);

  // Add comment to a bill
  const handleAddComment = useCallback((billId: string, comment: string) => {
    setBills((prev) =>
      prev.map((bill) =>
        bill.id === billId
          ? {
              ...bill,
              activities: [
                ...bill.activities,
                {
                  type: 'comment',
                  user: 'Current User',
                  date: new Date().toISOString(),
                  comment,
                } as Activity,
              ],
            }
          : bill
      )
    );
  }, []);

  // Bulk approve bills
  const handleBulkApprove = useCallback((billIds: string[]) => {
    setBills((prev) =>
      prev.map((bill) =>
        billIds.includes(bill.id)
          ? {
              ...bill,
              status: 'approved',
              activities: [
                ...bill.activities,
                {
                  type: 'approved',
                  user: 'Current User',
                  date: new Date().toISOString(),
                  comment: 'Bulk approved',
                } as Activity,
              ],
            }
          : bill
      )
    );
    toast.success('Bills Approved', {
      description: `${billIds.length} bill${billIds.length > 1 ? 's' : ''} approved successfully`,
      icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
    });
  }, []);

  // Bulk pay bills
  const handleBulkPay = useCallback((billIds: string[]) => {
    setBills((prev) =>
      prev.map((bill) =>
        billIds.includes(bill.id)
          ? {
              ...bill,
              status: 'paid',
              paidDate: new Date().toISOString(),
              activities: [
                ...bill.activities,
                {
                  type: 'paid',
                  user: 'Current User',
                  date: new Date().toISOString(),
                  comment: 'Bulk payment',
                } as Activity,
              ],
            }
          : bill
      )
    );
    toast.success('Payments Processed', {
      description: `${billIds.length} bill${billIds.length > 1 ? 's' : ''} paid successfully`,
      icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
    });
  }, []);

  // Delete a bill
  const handleDeleteBill = useCallback((billId: string) => {
    setBills((prev) => prev.filter((b) => b.id !== billId));
    toast.success('Bill Deleted', {
      description: 'The bill has been removed',
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Toaster 
        position="top-right" 
        richColors 
        closeButton
        toastOptions={{
          duration: 4000,
          className: 'shadow-lg',
        }}
      />
      
      <Tab.Group>
        {/* Navigation Header */}
        <div className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-bold text-lg text-foreground">PaySprint</h1>
                  <p className="text-xs text-foreground/60">Bill Payments</p>
                </div>
              </div>
              
              <Tab.List className="hidden md:flex gap-1 bg-accent/10 p-1 rounded-lg">
                <Tab
                  className={({ selected }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all outline-none ${
                      selected
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-foreground/60 hover:text-foreground hover:bg-accent/10'
                    }`
                  }
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Tab>
                <Tab
                  className={({ selected }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all outline-none ${
                      selected
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-foreground/60 hover:text-foreground hover:bg-accent/10'
                    }`
                  }
                >
                  <FileText className="w-4 h-4" />
                  Documentation
                </Tab>
              </Tab.List>

              {/* Mobile Tab Navigation */}
              <Tab.List className="md:hidden flex gap-2">
                <Tab
                  className={({ selected }) =>
                    `p-2 rounded-lg transition-all outline-none ${
                      selected
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground/60 hover:bg-accent/10'
                    }`
                  }
                >
                  <LayoutDashboard className="w-5 h-5" />
                </Tab>
                <Tab
                  className={({ selected }) =>
                    `p-2 rounded-lg transition-all outline-none ${
                      selected
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground/60 hover:bg-accent/10'
                    }`
                  }
                >
                  <FileText className="w-5 h-5" />
                </Tab>
              </Tab.List>
            </div>
          </div>
        </div>

        <Tab.Panels>
          <Tab.Panel>
            <BillsDashboard
              bills={bills}
              onAddBill={() => setActiveModal('add-bill')}
              onViewBill={openBillDetails}
              onPayBill={handlePayment}
              onApproveBill={handleApproveBill}
              onRejectBill={(id) => handleRejectBill(id, 'Rejected from dashboard')}
              onBulkPay={handleBulkPay}
              onBulkApprove={handleBulkApprove}
              onDeleteBill={handleDeleteBill}
            />
          </Tab.Panel>
          <Tab.Panel>
            <AssignmentDocumentation />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Modals */}
      {activeModal === 'add-bill' && (
        <AddBillModal 
          onClose={() => setActiveModal(null)} 
          onAdd={handleAddBill}
          vendors={bills.map(b => ({ id: b.vendorId || b.id, name: b.vendor })).filter((v, i, arr) => arr.findIndex(x => x.name === v.name) === i)} 
        />
      )}
      
      {activeModal === 'bill-details' && selectedBill && (
        <BillDetailsModal
          bill={selectedBill}
          onClose={() => setActiveModal(null)}
          onPay={handlePayment}
          onApprove={handleApproveBill}
          onReject={handleRejectBill}
          onAddComment={handleAddComment}
        />
      )}
      
      {activeModal === 'payment' && selectedBill && (
        <PaymentFlowModal
          bill={selectedBill}
          onClose={() => setActiveModal(null)}
          onComplete={handleCompletePayment}
        />
      )}
    </div>
  );
}
