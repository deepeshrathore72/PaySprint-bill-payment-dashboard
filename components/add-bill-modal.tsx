'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  X, 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw,
  Calendar,
  DollarSign,
  Building2,
  Tag,
  StickyNote,
  ChevronLeft,
  Loader2,
} from 'lucide-react';
import { Bill, CATEGORIES } from '@/lib/types';

interface Props {
  onClose: () => void;
  onAdd: (bill: Bill) => void;
  vendors?: { id: string; name: string }[];
}

type Step = 'method' | 'details' | 'review';
type Priority = 'low' | 'medium' | 'high';

interface FormErrors {
  vendor?: string;
  invoiceNumber?: string;
  amount?: string;
  dueDate?: string;
}

export function AddBillModal({ onClose, onAdd, vendors = [] }: Props) {
  const [step, setStep] = useState<Step>('method');
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'manual' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState({
    vendor: '',
    invoiceNumber: '',
    amount: '',
    dueDate: '',
    category: 'Other',
    notes: '',
    isRecurring: false,
    recurringFrequency: 'monthly' as 'weekly' | 'monthly' | 'quarterly' | 'yearly',
    priority: 'medium' as Priority,
  });

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.vendor.trim()) {
      newErrors.vendor = 'Vendor name is required';
    }
    
    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = 'Invoice number is required';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Simulate OCR extraction (in real app, this would call an API)
      setFormData(prev => ({
        ...prev,
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      }));
      setStep('details');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newBill: Bill = {
      id: Date.now().toString(),
      vendor: formData.vendor,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      status: 'pending',
      category: formData.category,
      notes: formData.notes,
      invoiceNumber: formData.invoiceNumber,
      uploadedDate: new Date().toISOString(),
      isRecurring: formData.isRecurring,
      recurringFrequency: formData.isRecurring ? formData.recurringFrequency : undefined,
      priority: formData.priority,
      activities: [
        {
          type: 'uploaded',
          user: 'Current User',
          date: new Date().toISOString(),
        },
      ],
    };
    
    onAdd(newBill);
    setIsSubmitting(false);
  };

  const goToReview = () => {
    if (validateForm()) {
      setStep('review');
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl border-border bg-card my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4 md:p-6">
          <div className="flex items-center gap-3">
            {step !== 'method' && (
              <button
                onClick={() => setStep(step === 'review' ? 'details' : 'method')}
                className="p-1 rounded-lg hover:bg-accent/10 text-foreground/60 hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {step === 'method' && 'Add New Bill'}
                {step === 'details' && 'Bill Details'}
                {step === 'review' && 'Review & Submit'}
              </h2>
              <p className="text-sm text-foreground/60 mt-0.5">
                {step === 'method' && 'Choose how to add your bill'}
                {step === 'details' && 'Enter the bill information'}
                {step === 'review' && 'Confirm the details before saving'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent/10 text-foreground/60 hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-4 md:px-6 py-4 border-b border-border">
          <div className="flex items-center justify-center gap-2">
            {['method', 'details', 'review'].map((s, index) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step === s
                      ? 'bg-primary text-primary-foreground'
                      : ['method', 'details', 'review'].indexOf(step) > index
                      ? 'bg-green-500 text-white'
                      : 'bg-border text-foreground/40'
                  }`}
                >
                  {['method', 'details', 'review'].indexOf(step) > index ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 2 && (
                  <div
                    className={`w-12 md:w-20 h-1 mx-2 rounded ${
                      ['method', 'details', 'review'].indexOf(step) > index
                        ? 'bg-green-500'
                        : 'bg-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 md:p-6">
          {/* Step 1: Method Selection */}
          {step === 'method' && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <button
                onClick={() => {
                  setUploadMethod('upload');
                  document.getElementById('file-upload')?.click();
                }}
                className={`rounded-xl border-2 p-6 md:p-8 text-center transition-all hover:shadow-md ${
                  uploadMethod === 'upload' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50 hover:bg-accent/5'
                }`}
              >
                <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-primary" />
                </div>
                <p className="font-semibold text-foreground text-lg">Upload Invoice</p>
                <p className="text-sm text-foreground/60 mt-2">
                  Upload PDF, PNG, or JPG files
                </p>
                <p className="text-xs text-foreground/40 mt-1">
                  Auto-extracts details using OCR
                </p>
              </button>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <button
                onClick={() => {
                  setUploadMethod('manual');
                  setStep('details');
                }}
                className={`rounded-xl border-2 p-6 md:p-8 text-center transition-all hover:shadow-md ${
                  uploadMethod === 'manual' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50 hover:bg-accent/5'
                }`}
              >
                <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="w-7 h-7 text-primary" />
                </div>
                <p className="font-semibold text-foreground text-lg">Enter Manually</p>
                <p className="text-sm text-foreground/60 mt-2">
                  Input bill details directly
                </p>
                <p className="text-xs text-foreground/40 mt-1">
                  Quick entry for simple bills
                </p>
              </button>
            </div>
          )}

          {/* Step 2: Bill Details Form */}
          {step === 'details' && (
            <form onSubmit={(e) => { e.preventDefault(); goToReview(); }} className="space-y-5">
              {uploadedFile && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-800">File uploaded</p>
                    <p className="text-xs text-green-600 truncate">{uploadedFile.name}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Building2 className="w-4 h-4 text-foreground/60" />
                    Vendor Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.vendor}
                    onChange={(e) => {
                      setFormData({ ...formData, vendor: e.target.value });
                      if (errors.vendor) setErrors({ ...errors, vendor: undefined });
                    }}
                    className={`w-full rounded-lg border px-4 py-2.5 text-foreground bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all ${
                      errors.vendor ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'
                    }`}
                    placeholder="e.g., Acme Inc."
                    list="vendor-list"
                  />
                  <datalist id="vendor-list">
                    {vendors.map((v) => (
                      <option key={v.id} value={v.name} />
                    ))}
                  </datalist>
                  {errors.vendor && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.vendor}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <FileText className="w-4 h-4 text-foreground/60" />
                    Invoice Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.invoiceNumber}
                    onChange={(e) => {
                      setFormData({ ...formData, invoiceNumber: e.target.value });
                      if (errors.invoiceNumber) setErrors({ ...errors, invoiceNumber: undefined });
                    }}
                    className={`w-full rounded-lg border px-4 py-2.5 text-foreground bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all ${
                      errors.invoiceNumber ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'
                    }`}
                    placeholder="e.g., INV-2025-001"
                  />
                  {errors.invoiceNumber && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.invoiceNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <DollarSign className="w-4 h-4 text-foreground/60" />
                    Amount (INR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60">₹</span>
                    <input
                      type="number"
                      required
                      step="0.01"
                      min="0.01"
                      value={formData.amount}
                      onChange={(e) => {
                        setFormData({ ...formData, amount: e.target.value });
                        if (errors.amount) setErrors({ ...errors, amount: undefined });
                      }}
                      className={`w-full rounded-lg border pl-8 pr-4 py-2.5 text-foreground bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all ${
                        errors.amount ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.amount && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.amount}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Calendar className="w-4 h-4 text-foreground/60" />
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => {
                      setFormData({ ...formData, dueDate: e.target.value });
                      if (errors.dueDate) setErrors({ ...errors, dueDate: undefined });
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full rounded-lg border px-4 py-2.5 text-foreground bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all ${
                      errors.dueDate ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'
                    }`}
                  />
                  {errors.dueDate && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.dueDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Tag className="w-4 h-4 text-foreground/60" />
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <AlertCircle className="w-4 h-4 text-foreground/60" />
                    Priority
                  </label>
                  <div className="flex gap-2">
                    {(['low', 'medium', 'high'] as Priority[]).map((priority) => (
                      <button
                        key={priority}
                        type="button"
                        onClick={() => setFormData({ ...formData, priority })}
                        className={`flex-1 px-3 py-2.5 rounded-lg border text-sm font-medium capitalize transition-all ${
                          formData.priority === priority
                            ? getPriorityColor(priority)
                            : 'border-border text-foreground/60 hover:border-foreground/30'
                        }`}
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recurring Bill Toggle */}
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <RefreshCw className={`w-5 h-5 ${formData.isRecurring ? 'text-primary' : 'text-foreground/40'}`} />
                    <div>
                      <p className="font-medium text-foreground">Recurring Bill</p>
                      <p className="text-xs text-foreground/60">Auto-create bills on a schedule</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isRecurring: !formData.isRecurring })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      formData.isRecurring ? 'bg-primary' : 'bg-border'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        formData.isRecurring ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                {formData.isRecurring && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <label className="text-sm font-medium text-foreground mb-2 block">Frequency</label>
                    <div className="flex flex-wrap gap-2">
                      {(['weekly', 'monthly', 'quarterly', 'yearly'] as const).map((freq) => (
                        <button
                          key={freq}
                          type="button"
                          onClick={() => setFormData({ ...formData, recurringFrequency: freq })}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-all ${
                            formData.recurringFrequency === freq
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border text-foreground/60 hover:border-foreground/30'
                          }`}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <StickyNote className="w-4 h-4 text-foreground/60" />
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  placeholder="Any additional notes about this bill..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('method')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Review Bill
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Review */}
          {step === 'review' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-accent/5 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-foreground/60">Vendor</p>
                    <p className="text-xl font-bold text-foreground">{formData.vendor}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(formData.priority)}`}>
                    {formData.priority} priority
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-foreground/60">Amount</p>
                    <p className="text-lg font-bold text-primary">₹{parseFloat(formData.amount).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground/60">Due Date</p>
                    <p className="font-semibold text-foreground">
                      {new Date(formData.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground/60">Invoice #</p>
                    <p className="font-semibold text-foreground">{formData.invoiceNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground/60">Category</p>
                    <p className="font-semibold text-foreground">{formData.category}</p>
                  </div>
                </div>
                
                {formData.isRecurring && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-purple-600">
                      <RefreshCw className="w-4 h-4" />
                      <p className="text-sm font-medium">
                        Recurring {formData.recurringFrequency}
                      </p>
                    </div>
                  </div>
                )}
                
                {formData.notes && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-foreground/60 mb-1">Notes</p>
                    <p className="text-sm text-foreground/80">{formData.notes}</p>
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800 text-sm">Bill will be submitted for approval</p>
                    <p className="text-xs text-amber-600 mt-1">
                      Once submitted, this bill will need to be approved before payment can be made.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('details')}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Edit Details
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Bill'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
