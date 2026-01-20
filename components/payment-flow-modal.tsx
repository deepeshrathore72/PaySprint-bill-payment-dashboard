'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  X,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Lock,
  Zap,
  ArrowRightLeft,
  FileCheck,
  Calendar,
  Clock,
  Loader2,
  Copy,
  Download,
  Shield,
  Building2,
  AlertCircle,
} from 'lucide-react';
import { Bill, formatCurrency, formatDate, PAYMENT_METHODS } from '@/lib/types';

interface Props {
  bill: Bill;
  onClose: () => void;
  onComplete: (id: string, scheduledDate?: string) => void;
}

type Step = 'method' | 'schedule' | 'confirm' | 'processing' | 'success';

export function PaymentFlowModal({ bill, onClose, onComplete }: Props) {
  const [step, setStep] = useState<Step>('method');
  const [selectedMethod, setSelectedMethod] = useState<string>('ach');
  const [paymentTiming, setPaymentTiming] = useState<'now' | 'schedule'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const getMethodIcon = (methodId: string) => {
    switch (methodId) {
      case 'ach':
        return <Zap className="w-6 h-6" />;
      case 'wire':
        return <ArrowRightLeft className="w-6 h-6" />;
      case 'credit':
        return <CreditCard className="w-6 h-6" />;
      case 'check':
        return <FileCheck className="w-6 h-6" />;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  const selectedPaymentMethod = PAYMENT_METHODS.find(m => m.id === selectedMethod);

  const calculateFee = () => {
    if (selectedMethod === 'ach') return 0;
    if (selectedMethod === 'wire') return 25;
    if (selectedMethod === 'credit') return Math.round(bill.amount * 0.029 * 100) / 100 + 0.30;
    if (selectedMethod === 'check') return 5;
    return 0;
  };

  const fee = calculateFee();
  const totalAmount = bill.amount + fee;

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    setStep('processing');
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate transaction ID
    const txnId = `TXN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setTransactionId(txnId);
    setIsProcessing(false);
    setStep('success');
  };

  const handleComplete = () => {
    onComplete(bill.id, paymentTiming === 'schedule' ? scheduledDate : undefined);
  };

  const copyTransactionId = () => {
    navigator.clipboard.writeText(transactionId);
  };

  const getStepNumber = (currentStep: Step): number => {
    switch (currentStep) {
      case 'method': return 1;
      case 'schedule': return 2;
      case 'confirm': return 3;
      case 'processing': return 4;
      case 'success': return 4;
    }
  };

  const isStepComplete = (checkStep: number, currentStep: Step): boolean => {
    return getStepNumber(currentStep) > checkStep;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl border-border bg-card my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4 md:p-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              {step === 'method' && 'Payment Method'}
              {step === 'schedule' && 'Payment Timing'}
              {step === 'confirm' && 'Confirm Payment'}
              {step === 'processing' && 'Processing Payment'}
              {step === 'success' && 'Payment Complete'}
            </h2>
            <p className="text-sm text-foreground/60 mt-0.5">
              {bill.vendor} • {formatCurrency(bill.amount)}
            </p>
          </div>
          {step !== 'processing' && step !== 'success' && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-accent/10 text-foreground/60 hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="px-4 md:px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((num, index) => (
              <div key={num} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full font-medium text-sm transition-colors ${
                    getStepNumber(step) >= num
                      ? isStepComplete(num, step)
                        ? 'bg-green-500 text-white'
                        : 'bg-primary text-primary-foreground'
                      : 'bg-border text-foreground/40'
                  }`}
                >
                  {isStepComplete(num, step) ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    num
                  )}
                </div>
                {index < 3 && (
                  <div
                    className={`hidden sm:block w-16 lg:w-24 h-1 mx-2 rounded transition-colors ${
                      isStepComplete(num, step) ? 'bg-green-500' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-foreground/50">
            <span>Method</span>
            <span>Schedule</span>
            <span>Confirm</span>
            <span>Complete</span>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {/* Step 1: Payment Method Selection */}
          {step === 'method' && (
            <div className="space-y-4">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full rounded-xl border-2 p-4 text-left transition-all hover:shadow-sm ${
                    selectedMethod === method.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${selectedMethod === method.id ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-foreground/60'}`}>
                      {getMethodIcon(method.id)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-foreground">{method.name}</p>
                        <span className={`text-sm font-medium ${method.fee === 'Free' ? 'text-green-600' : 'text-foreground/60'}`}>
                          {method.fee}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-foreground/60">{method.description}</p>
                      <p className="mt-1 text-xs text-foreground/40">
                        Processing: {method.processingTime}
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedMethod === method.id ? 'border-primary bg-primary' : 'border-border'
                    }`}>
                      {selectedMethod === method.id && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </button>
              ))}

              <div className="pt-4">
                <Button
                  onClick={() => setStep('schedule')}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Payment Timing */}
          {step === 'schedule' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentTiming('now')}
                  className={`rounded-xl border-2 p-6 text-left transition-all ${
                    paymentTiming === 'now'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                    paymentTiming === 'now' ? 'bg-primary/10' : 'bg-accent/10'
                  }`}>
                    <Zap className={`w-6 h-6 ${paymentTiming === 'now' ? 'text-primary' : 'text-foreground/60'}`} />
                  </div>
                  <p className="font-semibold text-foreground text-lg">Pay Now</p>
                  <p className="text-sm text-foreground/60 mt-1">
                    Process payment immediately
                  </p>
                </button>

                <button
                  onClick={() => setPaymentTiming('schedule')}
                  className={`rounded-xl border-2 p-6 text-left transition-all ${
                    paymentTiming === 'schedule'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                    paymentTiming === 'schedule' ? 'bg-primary/10' : 'bg-accent/10'
                  }`}>
                    <Calendar className={`w-6 h-6 ${paymentTiming === 'schedule' ? 'text-primary' : 'text-foreground/60'}`} />
                  </div>
                  <p className="font-semibold text-foreground text-lg">Schedule Payment</p>
                  <p className="text-sm text-foreground/60 mt-1">
                    Choose a future date
                  </p>
                </button>
              </div>

              {paymentTiming === 'schedule' && (
                <div className="rounded-lg border border-border p-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Calendar className="w-4 h-4 text-foreground/60" />
                    Schedule Date
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    max={bill.dueDate}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                  <p className="text-xs text-foreground/50 mt-2">
                    Bill due date: {formatDate(bill.dueDate)}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep('method')} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={() => setStep('confirm')}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={paymentTiming === 'schedule' && !scheduledDate}
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-linear-to-br from-accent/5 to-accent/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{bill.vendor}</p>
                    <p className="text-sm text-foreground/60">Invoice #{bill.invoiceNumber}</p>
                  </div>
                </div>

                <div className="space-y-3 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Bill Amount</span>
                    <span className="font-medium text-foreground">{formatCurrency(bill.amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Payment Method</span>
                    <span className="font-medium text-foreground">{selectedPaymentMethod?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Processing Fee</span>
                    <span className={`font-medium ${fee === 0 ? 'text-green-600' : 'text-foreground'}`}>
                      {fee === 0 ? 'Free' : formatCurrency(fee)}
                    </span>
                  </div>
                  {paymentTiming === 'schedule' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/60">Scheduled For</span>
                      <span className="font-medium text-foreground">{formatDate(scheduledDate)}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold text-foreground">Total Amount</span>
                    <span className="text-xl font-bold text-primary">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </div>

              {paymentTiming === 'schedule' && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex gap-3">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <p className="font-medium text-amber-800 text-sm">Scheduled Payment</p>
                    <p className="text-xs text-amber-600 mt-1">
                      This payment will be processed automatically on {formatDate(scheduledDate)}
                    </p>
                  </div>
                </div>
              )}

              <div className="rounded-lg border border-border p-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">Secure Payment</p>
                  <p className="text-xs text-foreground/60 mt-1">
                    Your payment is protected by bank-level 256-bit encryption. We never store your payment details.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep('schedule')} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleProcessPayment}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {paymentTiming === 'schedule' ? 'Schedule Payment' : 'Pay'} {formatCurrency(totalAmount)}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Processing */}
          {step === 'processing' && (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <p className="text-xl font-semibold text-foreground">Processing Payment</p>
              <p className="text-foreground/60 mt-2">Please wait while we process your payment...</p>
              <p className="text-sm text-foreground/40 mt-4">Do not close this window</p>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 'success' && (
            <div className="py-6 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {paymentTiming === 'schedule' ? 'Payment Scheduled!' : 'Payment Successful!'}
              </p>
              <p className="text-foreground/60 mt-2">
                {paymentTiming === 'schedule'
                  ? `Your payment will be processed on ${formatDate(scheduledDate)}`
                  : 'Your payment has been processed successfully'}
              </p>

              <div className="rounded-xl border border-border bg-accent/5 p-6 mt-6 text-left">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground/60">Transaction ID</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-foreground">{transactionId}</span>
                      <button onClick={copyTransactionId} className="p-1 hover:bg-accent/10 rounded">
                        <Copy className="w-4 h-4 text-foreground/60" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground/60">Amount Paid</span>
                    <span className="font-semibold text-foreground">{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground/60">Payment Method</span>
                    <span className="text-sm text-foreground">{selectedPaymentMethod?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground/60">Timestamp</span>
                    <span className="text-sm text-foreground">{new Date().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button
                  onClick={handleComplete}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Done
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <Download className="w-4 h-4" />
                  Download Receipt
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
