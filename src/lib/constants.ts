import type { Package } from '../types';

export const STATS = [
  { label: 'Businesses helped', value: '1,200+' },
  { label: 'Avg. response time', value: '< 24 hrs' },
  { label: 'Client satisfaction', value: '98%' },
];

export const PACKAGES: Package[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 299,
    anchor: 499,
    best: 'Ideal for simple business setup',
    includes: ['Business formation', 'Basic filing support', 'Email support'],
    color: 'bg-white',
    border: 'border-gray-200',
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 699,
    anchor: 999,
    badge: 'Most Popular',
    best: 'Best for growing operators',
    includes: ['Everything in Starter', 'Compliance assistance', 'Priority handling'],
    color: 'bg-white',
    border: 'border-accent',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 1499,
    anchor: 1999,
    best: 'Done-with-you premium support',
    includes: ['Everything in Growth', 'Dedicated specialist', 'Advanced support'],
    color: 'bg-white',
    border: 'border-gray-200',
  },
];

export const FAQS = [
  {
    q: 'What does The Paperwork Squad do?',
    a: 'We help with business formation, compliance, paperwork systems, and client workflow support.',
  },
  {
    q: 'Do I get a client portal?',
    a: 'Yes. Clients can log in, track case progress, upload documents, and view invoices.',
  },
  {
    q: 'Can your team support trucking and funding-related setup?',
    a: 'Yes. The platform is structured to support trucking setup, compliance, and funding readiness workflows.',
  },
];
