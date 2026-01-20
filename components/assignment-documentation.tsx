'use client';

import { Card } from '@/components/ui/card';
import { 
  Users, 
  BarChart3, 
  Zap, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  FileText,
  CreditCard,
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  Shield,
  Eye,
  Building2,
  ArrowRight,
  Target,
  Lightbulb,
  Layout,
  Palette,
  Code,
  Smartphone,
} from 'lucide-react';

export function AssignmentDocumentation() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-accent/5 p-4 md:p-8">
      <div className="container mx-auto max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Bill Payments Module
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            A comprehensive B2B SaaS solution for small businesses to manage vendor bills, 
            streamline approvals, and process payments efficiently.
          </p>
        </div>

        {/* Section 1: Problem Understanding */}
        <div className="mb-16">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
              1
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Problem Understanding</h2>
              <p className="text-foreground/60">Who we're building for and why</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Primary Users */}
            <Card className="border-border bg-card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Primary Users</h3>
              </div>
              <ul className="space-y-3">
                {[
                  { role: 'Finance Managers', desc: 'Bill tracking & approval workflows' },
                  { role: 'Business Owners', desc: 'Payment visibility & cash flow' },
                  { role: 'Accounting Teams', desc: 'Reconciliation & audit trails' },
                  { role: 'Operations Staff', desc: 'Vendor bill uploads' },
                ].map((user) => (
                  <li key={user.role} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground text-sm">{user.role}</p>
                      <p className="text-xs text-foreground/60">{user.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Pain Points */}
            <Card className="border-border bg-card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Key Pain Points</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Manual tracking across scattered systems',
                  'Missed due dates & late payment penalties',
                  'Lack of approval workflow visibility',
                  'Difficult payment reconciliation',
                  'No spending insights by category',
                ].map((pain, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                    </span>
                    <p className="text-sm text-foreground/80">{pain}</p>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Goals */}
            <Card className="border-border bg-card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Goals Achieved</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Centralized bill management hub',
                  'Streamlined approval workflows',
                  'Real-time status tracking',
                  'Financial insights & analytics',
                  'Complete audit compliance',
                ].map((goal, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Zap className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-foreground/80">{goal}</p>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        {/* Section 2: User Flow */}
        <div className="mb-16">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
              2
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">User Flow</h2>
              <p className="text-foreground/60">End-to-end bill payment journey</p>
            </div>
          </div>

          <Card className="border-border bg-card p-6 md:p-8 overflow-hidden">
            <div className="relative">
              {/* Flow Steps */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  {
                    icon: FileText,
                    title: 'Upload Bill',
                    steps: ['Select upload method', 'Enter bill details', 'Add vendor & category', 'Submit for approval'],
                    color: 'blue',
                  },
                  {
                    icon: CheckCircle2,
                    title: 'Review & Approve',
                    steps: ['Manager reviews bill', 'Verify details', 'Approve or reject', 'Activity logged'],
                    color: 'amber',
                  },
                  {
                    icon: CreditCard,
                    title: 'Make Payment',
                    steps: ['Select payment method', 'Choose timing', 'Confirm details', 'Process payment'],
                    color: 'green',
                  },
                  {
                    icon: BarChart3,
                    title: 'Track & Report',
                    steps: ['View payment history', 'Monitor status', 'Analyze spending', 'Export reports'],
                    color: 'purple',
                  },
                ].map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.title} className="relative">
                      <div className={`w-full rounded-xl bg-${step.color}-50 dark:bg-${step.color}-950/30 p-5 border border-${step.color}-200 dark:border-${step.color}-800`}>
                        <div className={`w-12 h-12 rounded-xl bg-${step.color}-100 dark:bg-${step.color}-900 flex items-center justify-center mb-4`}>
                          <Icon className={`w-6 h-6 text-${step.color}-600`} />
                        </div>
                        <h4 className="font-semibold text-foreground mb-3">{step.title}</h4>
                        <ul className="space-y-2">
                          {step.steps.map((s, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-foreground/70">
                              <div className="w-5 h-5 rounded-full bg-white dark:bg-foreground/10 flex items-center justify-center text-xs font-medium">
                                {i + 1}
                              </div>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {index < 3 && (
                        <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                          <ArrowRight className="w-6 h-6 text-foreground/20" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Section 3: Wireframes & Screens */}
        <div className="mb-16">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
              3
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Screen Designs</h2>
              <p className="text-foreground/60">Key screens and their features</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dashboard */}
            <Card className="border-border bg-card overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-linear-to-r from-blue-500 to-blue-600 p-4">
                <div className="flex items-center gap-3">
                  <Layout className="w-6 h-6 text-white" />
                  <h4 className="font-semibold text-white text-lg">Bills Dashboard</h4>
                </div>
              </div>
              <div className="p-5">
                <ul className="space-y-2.5">
                  {[
                    { icon: BarChart3, text: 'Overview stats with visual metrics' },
                    { icon: Filter, text: 'Advanced filtering & sorting' },
                    { icon: Search, text: 'Search by vendor, invoice, category' },
                    { icon: Eye, text: 'Status badges with color coding' },
                    { icon: CheckCircle2, text: 'Bulk selection & actions' },
                    { icon: Download, text: 'CSV export functionality' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                      <item.icon className="w-4 h-4 text-blue-600 shrink-0" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Add Bill */}
            <Card className="border-border bg-card overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-linear-to-r from-green-500 to-green-600 p-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-white" />
                  <h4 className="font-semibold text-white text-lg">Add New Bill</h4>
                </div>
              </div>
              <div className="p-5">
                <ul className="space-y-2.5">
                  {[
                    { icon: FileText, text: 'Upload invoice (PDF/Image) or manual entry' },
                    { icon: Building2, text: 'Vendor autocomplete suggestions' },
                    { icon: Calendar, text: 'Due date with validation' },
                    { icon: RefreshCw, text: 'Recurring bill scheduling' },
                    { icon: AlertCircle, text: 'Priority levels (Low/Medium/High)' },
                    { icon: CheckCircle2, text: 'Multi-step review before submit' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                      <item.icon className="w-4 h-4 text-green-600 shrink-0" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Bill Details */}
            <Card className="border-border bg-card overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-linear-to-r from-purple-500 to-purple-600 p-4">
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-white" />
                  <h4 className="font-semibold text-white text-lg">Bill Details</h4>
                </div>
              </div>
              <div className="p-5">
                <ul className="space-y-2.5">
                  {[
                    { icon: FileText, text: 'Complete bill information display' },
                    { icon: Eye, text: 'Invoice preview & download' },
                    { icon: CheckCircle2, text: 'Approve/Reject with comments' },
                    { icon: CreditCard, text: 'Quick pay action button' },
                    { icon: Clock, text: 'Activity timeline with audit log' },
                    { icon: Building2, text: 'Vendor information panel' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                      <item.icon className="w-4 h-4 text-purple-600 shrink-0" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Payment Flow */}
            <Card className="border-border bg-card overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-linear-to-r from-amber-500 to-amber-600 p-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-white" />
                  <h4 className="font-semibold text-white text-lg">Payment Flow</h4>
                </div>
              </div>
              <div className="p-5">
                <ul className="space-y-2.5">
                  {[
                    { icon: CreditCard, text: 'Multiple payment methods (ACH, Wire, Card)' },
                    { icon: Calendar, text: 'Schedule future payments' },
                    { icon: Shield, text: 'Secure payment confirmation' },
                    { icon: CheckCircle2, text: 'Transaction success screen' },
                    { icon: Download, text: 'Receipt download option' },
                    { icon: Zap, text: 'Progress indicator through steps' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                      <item.icon className="w-4 h-4 text-amber-600 shrink-0" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        </div>

        {/* Section 4: Implementation Details */}
        <div className="mb-16">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
              4
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">High-Fidelity Implementation</h2>
              <p className="text-foreground/60">Technical excellence & design details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Design System */}
            <Card className="border-border bg-card p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-3">Design System</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li>• Professional fintech palette</li>
                <li>• Semantic color tokens</li>
                <li>• Consistent typography</li>
                <li>• Smooth animations</li>
                <li>• Dark mode support</li>
              </ul>
            </Card>

            {/* Components */}
            <Card className="border-border bg-card p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-foreground mb-3">Components</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li>• Reusable UI components</li>
                <li>• Interactive data tables</li>
                <li>• Multi-step modal flows</li>
                <li>• Chart visualizations</li>
                <li>• Form validation</li>
              </ul>
            </Card>

            {/* UX Features */}
            <Card className="border-border bg-card p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-foreground mb-3">UX Features</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li>• Intuitive navigation</li>
                <li>• Toast notifications</li>
                <li>• Bulk operations</li>
                <li>• Quick filters</li>
                <li>• Keyboard shortcuts</li>
              </ul>
            </Card>

            {/* Responsive */}
            <Card className="border-border bg-card p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-foreground mb-3">Responsive</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li>• Mobile-first approach</li>
                <li>• Adaptive layouts</li>
                <li>• Touch-friendly targets</li>
                <li>• Progressive disclosure</li>
                <li>• Optimized for tablets</li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Key Features Summary */}
        <Card className="border-border bg-linear-to-br from-primary/5 via-primary/10 to-accent/10 p-8 text-center mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Complete Bill Payment Solution
          </h3>
          <p className="text-foreground/70 max-w-2xl mx-auto mb-6">
            This implementation provides small businesses with a professional, intuitive bill 
            payment management system that reduces administrative burden, improves financial 
            visibility, and ensures timely payments to vendors.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Bulk Payments', 'Recurring Bills', 'Approval Workflow', 'Payment Scheduling', 'Analytics', 'Export Reports'].map((feature) => (
              <span key={feature} className="px-4 py-2 rounded-full bg-card border border-border text-sm font-medium text-foreground">
                {feature}
              </span>
            ))}
          </div>
        </Card>

        {/* Tech Stack */}
        <Card className="border-border bg-card p-6">
          <h4 className="font-semibold text-foreground mb-4">Built With</h4>
          <div className="flex flex-wrap gap-2">
            {['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'Recharts', 'Headless UI', 'Lucide Icons', 'Sonner'].map((tech) => (
              <span key={tech} className="px-3 py-1.5 rounded-lg bg-accent/10 text-xs font-medium text-foreground/70">
                {tech}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
