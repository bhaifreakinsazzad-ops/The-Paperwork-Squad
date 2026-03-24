import type { Package, Case, Task, Invoice, Lead, Conversation, Message, AppUser } from '../types';

// ─── Packages (from your brief) ────────────────────────────
export const PACKAGES: Package[] = [
  {
    id: 'launch-starter',
    name: 'Launch Starter',
    price: 99,
    anchor: 297,
    best: 'Best for startups & consultants',
    color: 'from-blue-50 to-blue-50/50',
    border: 'border-blue-200',
    includes: [
      'Premium landing page',
      'Mobile optimization',
      'Contact form setup',
      'Domain & hosting guidance',
      'Business email support',
      'SEO-ready structure',
      'Pixel-ready setup',
    ],
  },
  {
    id: 'growth-builder',
    name: 'Growth Builder',
    price: 249,
    anchor: 599,
    badge: 'Most Popular',
    best: 'Best for growing businesses',
    color: 'from-[#FFF5F5] to-[#FFF5F5]',
    border: 'border-[#D93A3A]/40',
    includes: [
      'Multi-page website',
      'Lead capture forms',
      'Conversion-focused design',
      'Analytics tracking setup',
      'Full SEO structure',
      '2 revision rounds',
      'Priority support',
    ],
  },
  {
    id: 'revenue-system',
    name: 'Revenue System',
    price: 449,
    anchor: 899,
    best: 'Best for ecommerce & lead gen',
    color: 'from-navy/5 to-navy/5',
    border: 'border-navy/20',
    includes: [
      'Ecommerce or lead system',
      'Booking & inquiry flow',
      'CRM-ready structure',
      'Conversion-first design',
      'Pixel & analytics ready',
      '3 promo creatives',
      'Dedicated account manager',
    ],
  },
];

export const SERVICES = [
  { id: 'formation', title: 'Business Formation', desc: 'LLC, Corporation, Registered Agent — done right.' },
  { id: 'compliance', title: 'Compliance & Paperwork', desc: 'EIN, licenses, operating agreements & more.' },
  { id: 'trucking', title: 'Trucking Setup', desc: 'MC number, DOT, authority, IFTA — full setup.' },
  { id: 'funding', title: 'Funding & Business Credit', desc: 'Build fundability. Access capital. Scale faster.' },
  { id: 'websites', title: 'Websites & Digital Systems', desc: 'High-conversion sites built to perform.' },
  { id: 'apps', title: 'Custom Apps & Automation', desc: 'Portals, dashboards, AI workflows — we build it.' },
] as const;

export const STATS = [
  { num: '2,400+', label: 'Businesses Launched' },
  { num: '$12M+', label: 'Funding Accessed' },
  { num: '98%', label: 'Client Satisfaction' },
  { num: '48hr', label: 'Avg. Turnaround' },
] as const;

export const FAQS = [
  { q: 'How long does business formation take?', a: 'Most LLC formations are completed within 3–7 business days depending on your state. Expedited options are available.' },
  { q: 'Do I need to be in the US to use your services?', a: 'We primarily serve US-based businesses and those forming US entities. International clients are welcome for digital services.' },
  { q: 'What documents do I need to get started?', a: 'Basic ID and your business idea are enough to start. Our portal guides you through everything step by step.' },
  { q: 'Can I upgrade my package later?', a: 'Absolutely. You can add services or upgrade at any time directly from your client dashboard.' },
  { q: 'Do you offer refunds?', a: 'We offer a satisfaction guarantee. If we can\'t deliver what was promised, we\'ll make it right or refund you.' },
  { q: 'How do I communicate with my team?', a: 'Via the portal messaging center, email, or phone (Growth Builder and above). All communication is tracked in your dashboard.' },
] as const;

// ─── Demo users ─────────────────────────────────────────────
export const DEMO_USERS: AppUser[] = [
  { id: 'u1', name: 'Alex Johnson', email: 'client@demo.com', company: 'Johnson Logistics LLC', role: 'client' },
  { id: 'u2', name: 'TPS Admin', email: 'admin@tps.com', company: 'The Paperwork Squad', role: 'super_admin' },
];

// ─── Demo portal data ────────────────────────────────────────
export const DEMO_CASES: Case[] = [
  {
    id: 'c1', caseNumber: 'TPS-1001', clientName: 'Alex Johnson', clientId: 'u1',
    service: 'Business Formation', package: 'Growth Builder', status: 'In Process',
    stageIndex: 2, stages: ['Submitted', 'Under Review', 'In Process', 'Filed', 'Completed'],
    assignedTo: 'Mike R.', dueDate: 'Jan 18, 2026', priority: 'high', createdAt: '2025-12-01',
  },
  {
    id: 'c2', caseNumber: 'TPS-1002', clientName: 'Alex Johnson', clientId: 'u1',
    service: 'Website Build', package: 'Launch Starter', status: 'Waiting on Client',
    stageIndex: 1, stages: ['Package Selected', 'Assets Requested', 'Content Submitted', 'Building', 'Delivered'],
    assignedTo: 'Sara T.', dueDate: 'Jan 22, 2026', priority: 'medium', createdAt: '2025-12-05',
  },
];

export const DEMO_TASKS: Task[] = [
  { id: 1, title: 'Upload Government-Issued ID', caseLabel: 'TPS-1001 · Business Formation', priority: 'high', status: 'pending', assignedTo: 'client' },
  { id: 2, title: 'Submit EIN Application Form', caseLabel: 'TPS-1001 · Business Formation', priority: 'high', status: 'pending', assignedTo: 'client' },
  { id: 3, title: 'Upload Business Logo & Brand Assets', caseLabel: 'TPS-1002 · Website Build', priority: 'medium', status: 'pending', assignedTo: 'client' },
  { id: 4, title: 'Approve Website Content Draft', caseLabel: 'TPS-1002 · Website Build', priority: 'medium', status: 'completed', assignedTo: 'client' },
  { id: 5, title: 'Sign Operating Agreement', caseLabel: 'TPS-1001 · Business Formation', priority: 'low', status: 'completed', assignedTo: 'client' },
];

export const DEMO_INVOICES: Invoice[] = [
  { id: 'i1', invoiceNumber: 'TPS-2025-001', service: 'Growth Builder Package', amount: 249, status: 'paid', date: 'Dec 1, 2025', clientName: 'Alex Johnson' },
  { id: 'i2', invoiceNumber: 'TPS-2025-002', service: 'Expedited Filing Add-on', amount: 75, status: 'due', date: 'Jan 5, 2026', clientName: 'Alex Johnson' },
];

export const DEMO_CONVERSATIONS: Conversation[] = [
  { id: 1, with: 'TPS Team', preview: 'Your LLC formation is now in progress. Expected completion...', time: '2h ago', unread: true },
  { id: 2, with: 'TPS Support', preview: 'We received your intake form. A specialist has been assigned.', time: '1d ago', unread: false },
  { id: 3, with: 'Billing Team', preview: 'Invoice TPS-2025-002 has been generated for your review.', time: '2d ago', unread: false },
];

export const DEMO_MESSAGES: Message[] = [
  { id: 1, from: 'TPS Team', content: 'Hello! Your LLC formation case is now in progress. Our team has started the filing process.', time: '2h ago', self: false },
  { id: 2, from: 'You', content: 'Great! How long until it\'s completed?', time: '1h ago', self: true },
  { id: 3, from: 'TPS Team', content: 'Typically 3–7 business days. We\'ll notify you at each stage. Meanwhile, please complete your pending tasks.', time: '1h ago', self: false },
];

export const DEMO_LEADS: Lead[] = [
  { id: 1, name: 'Robert Chen', email: 'rchen@example.com', service: 'Trucking Setup', source: 'Valuation Calculator', status: 'New', score: 85, date: 'Jan 8' },
  { id: 2, name: 'Sarah Mitchell', email: 'smitch@mail.com', service: 'LLC Formation', source: 'Consultation Form', status: 'Contacted', score: 72, date: 'Jan 7' },
  { id: 3, name: 'DeShawn Brooks', email: 'dbrooks@biz.com', service: 'Business Credit', source: 'Fundability Checker', status: 'Qualified', score: 91, date: 'Jan 6' },
  { id: 4, name: 'Maria Lopez', email: 'mlopez@co.com', service: 'Website Build', source: 'Valuation Calculator', status: 'New', score: 67, date: 'Jan 5' },
  { id: 5, name: 'James Park', email: 'jpark@firm.com', service: 'Custom App', source: 'Referral', status: 'Proposal Sent', score: 88, date: 'Jan 4' },
];

// ─── Stripe payment links (PLACEHOLDER — create in Stripe Dashboard) ────
export const STRIPE_LINKS = {
  'launch-starter': 'https://buy.stripe.com/REPLACE_ME',
  'growth-builder': 'https://buy.stripe.com/REPLACE_ME',
  'revenue-system': 'https://buy.stripe.com/REPLACE_ME',
  'custom': 'https://buy.stripe.com/REPLACE_ME',
} as const;
