'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  Plus,
  Eye,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Download,
  ChevronDown,
  CheckSquare,
  Square,
  ArrowUpDown,
  RefreshCw,
  FileText,
  DollarSign,
  CalendarClock,
  XCircle,
} from 'lucide-react';
import {
  Bill,
  BillStatus,
  getStatusColor,
  formatCurrency,
  getDueDateLabel,
  isOverdue,
  CATEGORIES,
} from '@/lib/types';

interface Props {
  bills: Bill[];
  onAddBill: () => void;
  onViewBill: (id: string) => void;
  onPayBill: (id: string) => void;
  onApproveBill: (id: string) => void;
  onRejectBill: (id: string) => void;
  onBulkPay: (ids: string[]) => void;
  onBulkApprove: (ids: string[]) => void;
  onDeleteBill: (id: string) => void;
}

type SortField = 'dueDate' | 'amount' | 'vendor' | 'uploadedDate';
type SortDirection = 'asc' | 'desc';

export function BillsDashboard({
  bills,
  onAddBill,
  onViewBill,
  onPayBill,
  onApproveBill,
  onRejectBill,
  onBulkPay,
  onBulkApprove,
}: Props) {
  const [filterStatus, setFilterStatus] = useState<BillStatus | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedBills, setSelectedBills] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: '', to: '' });

  // Update overdue status for bills
  const billsWithUpdatedStatus = useMemo(() => {
    return bills.map(bill => {
      if (isOverdue(bill.dueDate, bill.status) && bill.status !== 'overdue') {
        return { ...bill, status: 'overdue' as BillStatus };
      }
      return bill;
    });
  }, [bills]);

  // Filter and sort bills
  const filteredBills = useMemo(() => {
    let result = billsWithUpdatedStatus;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.vendor.toLowerCase().includes(query) ||
          b.invoiceNumber.toLowerCase().includes(query) ||
          b.category.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filterStatus) {
      result = result.filter((b) => b.status === filterStatus);
    }

    // Category filter
    if (filterCategory) {
      result = result.filter((b) => b.category === filterCategory);
    }

    // Date range filter
    if (dateRange.from) {
      result = result.filter((b) => new Date(b.dueDate) >= new Date(dateRange.from));
    }
    if (dateRange.to) {
      result = result.filter((b) => new Date(b.dueDate) <= new Date(dateRange.to));
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'dueDate':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'vendor':
          comparison = a.vendor.localeCompare(b.vendor);
          break;
        case 'uploadedDate':
          comparison = new Date(a.uploadedDate).getTime() - new Date(b.uploadedDate).getTime();
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [billsWithUpdatedStatus, searchQuery, filterStatus, filterCategory, dateRange, sortField, sortDirection]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = billsWithUpdatedStatus.reduce((sum, b) => sum + b.amount, 0);
    const pending = billsWithUpdatedStatus
      .filter((b) => b.status === 'pending')
      .reduce((sum, b) => sum + b.amount, 0);
    const approved = billsWithUpdatedStatus
      .filter((b) => b.status === 'approved')
      .reduce((sum, b) => sum + b.amount, 0);
    const paid = billsWithUpdatedStatus
      .filter((b) => b.status === 'paid')
      .reduce((sum, b) => sum + b.amount, 0);
    const overdue = billsWithUpdatedStatus
      .filter((b) => b.status === 'overdue')
      .reduce((sum, b) => sum + b.amount, 0);

    return { total, pending, approved, paid, overdue, billCount: billsWithUpdatedStatus.length };
  }, [billsWithUpdatedStatus]);

  // Chart data
  const pieChartData = [
    { name: 'Pending', value: stats.pending, color: '#f59e0b' },
    { name: 'Approved', value: stats.approved, color: '#3b82f6' },
    { name: 'Paid', value: stats.paid, color: '#22c55e' },
    { name: 'Overdue', value: stats.overdue, color: '#ef4444' },
  ].filter(d => d.value > 0);

  const categoryData = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      name: cat,
      value: billsWithUpdatedStatus.filter((b) => b.category === cat).reduce((sum, b) => sum + b.amount, 0),
    })).filter((d) => d.value > 0).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [billsWithUpdatedStatus]);

  // Monthly trend data
  const monthlyTrend = useMemo(() => {
    const months: { [key: string]: { paid: number; pending: number } } = {};
    billsWithUpdatedStatus.forEach((bill) => {
      const month = new Date(bill.dueDate).toLocaleString('default', { month: 'short' });
      if (!months[month]) months[month] = { paid: 0, pending: 0 };
      if (bill.status === 'paid') {
        months[month].paid += bill.amount;
      } else {
        months[month].pending += bill.amount;
      }
    });
    return Object.entries(months).map(([name, data]) => ({ name, ...data }));
  }, [billsWithUpdatedStatus]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleBillSelection = (id: string) => {
    const newSelected = new Set(selectedBills);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedBills(newSelected);
  };

  const toggleAllBills = () => {
    if (selectedBills.size === filteredBills.length) {
      setSelectedBills(new Set());
    } else {
      setSelectedBills(new Set(filteredBills.map((b) => b.id)));
    }
  };

  const getStatusIcon = (status: BillStatus) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'approved':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-gray-600" />;
      case 'scheduled':
        return <CalendarClock className="w-4 h-4 text-purple-600" />;
      default:
        return <Clock className="w-4 h-4 text-amber-600" />;
    }
  };

  const selectedApprovedBills = Array.from(selectedBills).filter(
    (id) => bills.find((b) => b.id === id)?.status === 'approved'
  );
  const selectedPendingBills = Array.from(selectedBills).filter(
    (id) => bills.find((b) => b.id === id)?.status === 'pending'
  );

  const clearFilters = () => {
    setFilterStatus(null);
    setFilterCategory(null);
    setSearchQuery('');
    setDateRange({ from: '', to: '' });
  };

  const exportToCSV = () => {
    const headers = ['Vendor', 'Invoice #', 'Amount', 'Due Date', 'Status', 'Category'];
    const rows = filteredBills.map((b) => [
      b.vendor,
      b.invoiceNumber,
      b.amount.toString(),
      b.dueDate,
      b.status,
      b.category,
    ]);
    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bills-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-accent/5 p-4 md:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Bill Payments</h1>
            <p className="mt-1 md:mt-2 text-sm md:text-base text-foreground/60">
              Manage vendor bills, approvals, and payments
            </p>
          </div>
          <div className="flex gap-2 md:gap-3">
            <Button
              variant="outline"
              onClick={exportToCSV}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button
              onClick={onAddBill}
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              <span>Add Bill</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 md:mb-8 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          <Card className="border-border bg-card p-4 md:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-foreground/60">Total Outstanding</p>
                <p className="mt-1 md:mt-2 text-xl md:text-3xl font-bold text-foreground">
                  {formatCurrency(stats.total - stats.paid)}
                </p>
                <p className="mt-1 text-xs text-foreground/50">{stats.billCount} bills total</p>
              </div>
              <div className="hidden md:block">
                <span className="text-3xl font-bold text-primary/20">₹</span>
              </div>
            </div>
          </Card>

          <Card className="border-border bg-card p-4 md:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-foreground/60">Pending Approval</p>
                <p className="mt-1 md:mt-2 text-xl md:text-3xl font-bold text-amber-600">
                  {formatCurrency(stats.pending)}
                </p>
                <p className="mt-1 text-xs text-foreground/50">
                  {billsWithUpdatedStatus.filter((b) => b.status === 'pending').length} bills
                </p>
              </div>
              <div className="hidden md:block">
                <Clock className="w-10 h-10 text-amber-600/20" />
              </div>
            </div>
          </Card>

          <Card className="border-border bg-card p-4 md:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-foreground/60">Ready to Pay</p>
                <p className="mt-1 md:mt-2 text-xl md:text-3xl font-bold text-blue-600">
                  {formatCurrency(stats.approved)}
                </p>
                <p className="mt-1 text-xs text-foreground/50">
                  {billsWithUpdatedStatus.filter((b) => b.status === 'approved').length} bills
                </p>
              </div>
              <div className="hidden md:block">
                <CheckCircle2 className="w-10 h-10 text-blue-600/20" />
              </div>
            </div>
          </Card>

          <Card className="border-border bg-card p-4 md:p-6 hover:shadow-md transition-shadow cursor-pointer hover:border-red-200"
            onClick={() => setFilterStatus('overdue')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-foreground/60">Overdue</p>
                <p className="mt-1 md:mt-2 text-xl md:text-3xl font-bold text-red-600">
                  {formatCurrency(stats.overdue)}
                </p>
                <p className="mt-1 text-xs text-red-500/80">
                  {billsWithUpdatedStatus.filter((b) => b.status === 'overdue').length} bills need attention
                </p>
              </div>
              <div className="hidden md:block">
                <AlertCircle className="w-10 h-10 text-red-600/20" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="mb-6 md:mb-8 grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
          <Card className="border-border bg-card p-4 md:p-6">
            <h3 className="mb-4 md:mb-6 text-base md:text-lg font-semibold text-foreground">
              Payment Status
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {pieChartData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-xs text-foreground/70">{entry.name}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-border bg-card p-4 md:p-6">
            <h3 className="mb-4 md:mb-6 text-base md:text-lg font-semibold text-foreground">
              Top Categories
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `₹${v / 1000}k`} />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="value" fill="var(--primary)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="border-border bg-card p-4 md:p-6">
            <h3 className="mb-4 md:mb-6 text-base md:text-lg font-semibold text-foreground">
              Monthly Trend
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Line type="monotone" dataKey="paid" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs text-foreground/70">Paid</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-xs text-foreground/70">Pending</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-4 md:mb-6 border-border bg-card p-4">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <input
                  type="text"
                  placeholder="Search vendors, invoice numbers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                {(filterStatus || filterCategory || dateRange.from || dateRange.to) && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                    {[filterStatus, filterCategory, dateRange.from, dateRange.to].filter(Boolean).length}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-border">
                <div>
                  <label className="block text-xs font-medium text-foreground/70 mb-1.5">Status</label>
                  <select
                    value={filterStatus || ''}
                    onChange={(e) => setFilterStatus((e.target.value as BillStatus) || null)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="rejected">Rejected</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground/70 mb-1.5">Category</label>
                  <select
                    value={filterCategory || ''}
                    onChange={(e) => setFilterCategory(e.target.value || null)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground/70 mb-1.5">Due From</label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground/70 mb-1.5">Due To</label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                {(filterStatus || filterCategory || dateRange.from || dateRange.to) && (
                  <div className="sm:col-span-2 lg:col-span-4">
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-foreground/60">
                      <RefreshCw className="w-3 h-3 mr-1" /> Clear all filters
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Status Quick Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterStatus === null ? 'default' : 'outline'}
                onClick={() => setFilterStatus(null)}
                size="sm"
                className="text-xs"
              >
                All ({billsWithUpdatedStatus.length})
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('pending')}
                size="sm"
                className="text-xs"
              >
                <Clock className="w-3 h-3 mr-1" />
                Pending ({billsWithUpdatedStatus.filter((b) => b.status === 'pending').length})
              </Button>
              <Button
                variant={filterStatus === 'approved' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('approved')}
                size="sm"
                className="text-xs"
              >
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Approved ({billsWithUpdatedStatus.filter((b) => b.status === 'approved').length})
              </Button>
              <Button
                variant={filterStatus === 'paid' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('paid')}
                size="sm"
                className="text-xs"
              >
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Paid ({billsWithUpdatedStatus.filter((b) => b.status === 'paid').length})
              </Button>
              <Button
                variant={filterStatus === 'overdue' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('overdue')}
                size="sm"
                className="text-xs text-red-600"
              >
                <AlertCircle className="w-3 h-3 mr-1" />
                Overdue ({billsWithUpdatedStatus.filter((b) => b.status === 'overdue').length})
              </Button>
            </div>
          </div>
        </Card>

        {/* Bulk Actions Bar */}
        {selectedBills.size > 0 && (
          <Card className="mb-4 border-primary/50 bg-primary/5 p-3 md:p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-sm font-medium text-foreground">
                {selectedBills.size} bill{selectedBills.size > 1 ? 's' : ''} selected
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedApprovedBills.length > 0 && (
                  <Button
                    size="sm"
                    onClick={() => onBulkPay(selectedApprovedBills)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <CreditCard className="w-4 h-4 mr-1" />
                    Pay {selectedApprovedBills.length} Bills
                  </Button>
                )}
                {selectedPendingBills.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onBulkApprove(selectedPendingBills)}
                  >
                    <CheckSquare className="w-4 h-4 mr-1" />
                    Approve {selectedPendingBills.length} Bills
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedBills(new Set())}
                  className="text-foreground/60"
                >
                  Clear selection
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Bills Table */}
        <Card className="border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-accent/5">
                <tr>
                  <th className="w-12 px-4 py-4">
                    <button onClick={toggleAllBills} className="p-1">
                      {selectedBills.size === filteredBills.length && filteredBills.length > 0 ? (
                        <CheckSquare className="w-5 h-5 text-primary" />
                      ) : (
                        <Square className="w-5 h-5 text-foreground/40" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left">
                    <button
                      onClick={() => toggleSort('vendor')}
                      className="flex items-center gap-1 text-xs md:text-sm font-semibold text-foreground hover:text-primary"
                    >
                      Vendor
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="hidden md:table-cell px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Invoice
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left">
                    <button
                      onClick={() => toggleSort('amount')}
                      className="flex items-center gap-1 text-xs md:text-sm font-semibold text-foreground hover:text-primary"
                    >
                      Amount
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="hidden sm:table-cell px-4 md:px-6 py-4 text-left">
                    <button
                      onClick={() => toggleSort('dueDate')}
                      className="flex items-center gap-1 text-xs md:text-sm font-semibold text-foreground hover:text-primary"
                    >
                      Due Date
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-4 md:px-6 py-4 text-right text-xs md:text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBills.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <FileText className="w-12 h-12 mx-auto text-foreground/20 mb-4" />
                      <p className="text-foreground/60 font-medium">No bills found</p>
                      <p className="text-sm text-foreground/40 mt-1">
                        {searchQuery || filterStatus || filterCategory
                          ? 'Try adjusting your filters'
                          : 'Click "Add Bill" to create your first bill'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredBills.map((bill) => {
                    const dueDateInfo = getDueDateLabel(bill.dueDate, bill.status);
                    return (
                      <tr
                        key={bill.id}
                        className={`hover:bg-accent/5 transition-colors ${selectedBills.has(bill.id) ? 'bg-primary/5' : ''}`}
                      >
                        <td className="w-12 px-4 py-4">
                          <button onClick={() => toggleBillSelection(bill.id)} className="p-1">
                            {selectedBills.has(bill.id) ? (
                              <CheckSquare className="w-5 h-5 text-primary" />
                            ) : (
                              <Square className="w-5 h-5 text-foreground/40" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <div>
                            <p className="font-medium text-foreground text-sm md:text-base">{bill.vendor}</p>
                            <p className="text-xs text-foreground/60 mt-0.5">{bill.category}</p>
                            <p className="text-xs text-foreground/50 md:hidden mt-0.5">{bill.invoiceNumber}</p>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4 text-sm text-foreground/80">
                          {bill.invoiceNumber}
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <p className="font-semibold text-foreground text-sm md:text-base">
                            {formatCurrency(bill.amount)}
                          </p>
                          {bill.isRecurring && (
                            <span className="inline-flex items-center gap-1 text-xs text-purple-600 mt-0.5">
                              <RefreshCw className="w-3 h-3" />
                              {bill.recurringFrequency}
                            </span>
                          )}
                        </td>
                        <td className="hidden sm:table-cell px-4 md:px-6 py-4">
                          <p className={`text-xs md:text-sm ${dueDateInfo.className}`}>
                            {dueDateInfo.label}
                          </p>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <div
                            className={`inline-flex items-center gap-1.5 rounded-full px-2 md:px-3 py-1 text-xs font-medium border ${getStatusColor(bill.status)}`}
                          >
                            {getStatusIcon(bill.status)}
                            <span className="capitalize hidden sm:inline">{bill.status}</span>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex justify-end gap-1 md:gap-2">
                            <Button
                              onClick={() => onViewBill(bill.id)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {bill.status === 'pending' && (
                              <>
                                <Button
                                  onClick={() => onApproveBill(bill.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                  title="Approve"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => onRejectBill(bill.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  title="Reject"
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            {bill.status === 'approved' && (
                              <Button
                                onClick={() => onPayBill(bill.id)}
                                size="sm"
                                className="bg-primary text-primary-foreground hover:bg-primary/90 h-8"
                              >
                                <CreditCard className="w-4 h-4 md:mr-1" />
                                <span className="hidden md:inline">Pay</span>
                              </Button>
                            )}
                            {(bill.status === 'overdue') && (
                              <Button
                                onClick={() => onPayBill(bill.id)}
                                size="sm"
                                variant="destructive"
                                className="h-8"
                              >
                                <CreditCard className="w-4 h-4 md:mr-1" />
                                <span className="hidden md:inline">Pay Now</span>
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {filteredBills.length > 0 && (
            <div className="border-t border-border px-4 md:px-6 py-3 flex items-center justify-between text-sm text-foreground/60">
              <p>
                Showing {filteredBills.length} of {billsWithUpdatedStatus.length} bills
              </p>
              <p className="hidden md:block">
                Total: {formatCurrency(filteredBills.reduce((sum, b) => sum + b.amount, 0))}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
