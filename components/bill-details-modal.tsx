'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  X,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  XCircle,
  Download,
  MessageSquare,
  Send,
  Calendar,
  Building2,
  Tag,
  RefreshCw,
  ExternalLink,
  CalendarClock,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import {
  Bill,
  Activity,
  BillStatus,
  getStatusColor,
  formatCurrency,
  formatDate,
  formatDateTime,
  getDueDateLabel,
} from '@/lib/types';

interface Props {
  bill: Bill;
  onClose: () => void;
  onPay: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onAddComment: (id: string, comment: string) => void;
}

export function BillDetailsModal({ 
  bill, 
  onClose, 
  onPay, 
  onApprove, 
  onReject,
  onAddComment 
}: Props) {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'activity'>('details');

  const dueDateInfo = getDueDateLabel(bill.dueDate, bill.status);

  const getStatusIcon = (status: BillStatus) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'approved':
        return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-gray-600" />;
      case 'scheduled':
        return <CalendarClock className="w-5 h-5 text-purple-600" />;
      default:
        return <Clock className="w-5 h-5 text-amber-600" />;
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'paid':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-blue-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'uploaded':
        return <FileText className="w-4 h-4 text-primary" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-foreground/60" />;
      case 'edited':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'scheduled':
        return <CalendarClock className="w-4 h-4 text-purple-600" />;
      default:
        return <Clock className="w-4 h-4 text-foreground/60" />;
    }
  };

  const handleApprove = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    onApprove(bill.id);
    setIsProcessing(false);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    onReject(bill.id, rejectReason);
    setIsProcessing(false);
    setShowRejectDialog(false);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    onAddComment(bill.id, newComment);
    setNewComment('');
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-amber-100 text-amber-700 border-amber-200',
      low: 'bg-green-100 text-green-700 border-green-200',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[priority] || colors.medium}`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl border-border bg-card my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border p-4 md:p-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">{bill.vendor}</h2>
              <div
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium border ${getStatusColor(bill.status)}`}
              >
                {getStatusIcon(bill.status)}
                <span className="capitalize">{bill.status}</span>
              </div>
              {getPriorityBadge(bill.priority)}
            </div>
            <p className="text-sm text-foreground/60 mt-1">Invoice #{bill.invoiceNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent/10 text-foreground/60 hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border px-4 md:px-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-3 border-b-2 text-sm font-medium transition-colors ${
                activeTab === 'details'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-foreground/60 hover:text-foreground'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-3 border-b-2 text-sm font-medium transition-colors ${
                activeTab === 'activity'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-foreground/60 hover:text-foreground'
              }`}
            >
              Activity ({bill.activities.length})
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {activeTab === 'details' ? (
            <div className="space-y-6">
              {/* Key Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-lg border border-border bg-accent/5 p-4">
                  <p className="text-xs text-foreground/60 mb-1">Amount</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(bill.amount)}</p>
                </div>
                <div className="rounded-lg border border-border bg-accent/5 p-4">
                  <p className="text-xs text-foreground/60 mb-1">Due Date</p>
                  <p className={`text-lg font-semibold ${dueDateInfo.className}`}>
                    {formatDate(bill.dueDate)}
                  </p>
                  <p className={`text-xs mt-0.5 ${dueDateInfo.className}`}>
                    {dueDateInfo.label}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-accent/5 p-4">
                  <p className="text-xs text-foreground/60 mb-1">Category</p>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-foreground/60" />
                    <p className="font-semibold text-foreground">{bill.category}</p>
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-accent/5 p-4">
                  <p className="text-xs text-foreground/60 mb-1">Uploaded</p>
                  <p className="font-semibold text-foreground">{formatDate(bill.uploadedDate)}</p>
                </div>
              </div>

              {/* Recurring Badge */}
              {bill.isRecurring && (
                <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-purple-800">Recurring Bill</p>
                    <p className="text-sm text-purple-600 capitalize">
                      Repeats {bill.recurringFrequency}
                    </p>
                  </div>
                </div>
              )}

              {/* Invoice Preview */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <FileText className="w-4 h-4 text-primary" />
                  Invoice Preview
                </h3>
                <div className="rounded-xl border border-border bg-linear-to-br from-accent/5 to-accent/10 p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-foreground/5 mb-4">
                    <FileText className="w-8 h-8 text-foreground/30" />
                  </div>
                  <p className="text-foreground/60 mb-4">Invoice document preview</p>
                  <div className="flex flex-col sm:flex-row justify-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Open in New Tab
                    </Button>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {bill.notes && (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    Notes
                  </h3>
                  <div className="rounded-lg border border-border bg-accent/5 p-4">
                    <p className="text-foreground/80 whitespace-pre-wrap">{bill.notes}</p>
                  </div>
                </div>
              )}

              {/* Vendor Info */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Building2 className="w-4 h-4 text-primary" />
                  Vendor Information
                </h3>
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{bill.vendor}</p>
                      <p className="text-sm text-foreground/60">Vendor Details</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Add Comment */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Activity Timeline */}
              <div className="space-y-4">
                {bill.activities.slice().reverse().map((activity, index) => (
                  <div
                    key={index}
                    className="flex gap-4 rounded-lg border border-border p-4 hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-foreground capitalize">
                            {activity.type === 'uploaded' ? 'Bill Uploaded' : activity.type}
                          </p>
                          <p className="text-sm text-foreground/60">
                            by {activity.user}
                          </p>
                        </div>
                        <p className="text-xs text-foreground/50 shrink-0">
                          {formatDateTime(activity.date)}
                        </p>
                      </div>
                      {activity.comment && (
                        <p className="mt-2 text-sm text-foreground/70 bg-accent/5 rounded p-2">
                          {activity.comment}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="border-t border-border p-4 md:p-6">
          {showRejectDialog ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Reason for rejection *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Please provide a reason for rejecting this bill..."
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all resize-none"
                  rows={3}
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowRejectDialog(false)}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={!rejectReason.trim() || isProcessing}
                  variant="destructive"
                  className="flex-1"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  Reject Bill
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              {bill.status === 'pending' && (
                <>
                  <Button
                    onClick={() => setShowRejectDialog(true)}
                    variant="outline"
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="flex-1 bg-green-600 text-white hover:bg-green-700"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                    )}
                    Approve Bill
                  </Button>
                </>
              )}
              
              {(bill.status === 'approved' || bill.status === 'overdue') && (
                <Button
                  onClick={() => onPay(bill.id)}
                  className={`flex-1 ${
                    bill.status === 'overdue' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-primary hover:bg-primary/90'
                  } text-white`}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
              
              {bill.status === 'paid' && (
                <div className="w-full rounded-lg border border-green-200 bg-green-50 p-4 text-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="font-medium text-green-800">This bill has been paid</p>
                  {bill.paidDate && (
                    <p className="text-sm text-green-600 mt-1">
                      Paid on {formatDate(bill.paidDate)}
                    </p>
                  )}
                </div>
              )}

              {bill.status === 'rejected' && (
                <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                  <XCircle className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                  <p className="font-medium text-gray-700">This bill was rejected</p>
                </div>
              )}
              
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
