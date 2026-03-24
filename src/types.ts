// ─── User & Auth ───────────────────────────────────────────
export type UserRole = 'client' | 'case_manager' | 'admin' | 'super_admin';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  company?: string;
  role: UserRole;
  phone?: string;
}

// ─── Packages ──────────────────────────────────────────────
export interface Package {
  id: string;
  name: string;
  price: number;
  anchor: number;
  badge?: string;
  best: string;
  includes: string[];
  color: string;
  border: string;
}

// ─── Cases ─────────────────────────────────────────────────
export type CaseStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Waiting on Client'
  | 'In Process'
  | 'Filed'
  | 'Completed'
  | 'On Hold';

export type CasePriority = 'high' | 'medium' | 'low';

export interface Case {
  id: string;
  caseNumber: string;
  clientName: string;
  clientId: string;
  service: string;
  package: string;
  status: CaseStatus;
  stageIndex: number;
  stages: string[];
  assignedTo: string;
  dueDate: string;
  priority: CasePriority;
  createdAt: string;
}

// ─── Tasks ─────────────────────────────────────────────────
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskAssignee = 'client' | 'team';

export interface Task {
  id: number;
  title: string;
  caseLabel: string;
  priority: CasePriority;
  status: TaskStatus;
  assignedTo: TaskAssignee;
}

// ─── Messages ──────────────────────────────────────────────
export interface Message {
  id: number;
  from: string;
  content: string;
  time: string;
  self: boolean;
  internal?: boolean;
}

export interface Conversation {
  id: number;
  with: string;
  preview: string;
  time: string;
  unread: boolean;
}

// ─── Documents ─────────────────────────────────────────────
export type DocStatus = 'pending_review' | 'approved' | 'rejected' | 'needs_revision';

export interface Document {
  id: number;
  name: string;
  size: string;
  uploadedAt: string;
  status: DocStatus;
}

// ─── Invoices ──────────────────────────────────────────────
export type InvoiceStatus = 'paid' | 'due' | 'overdue';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  service: string;
  amount: number;
  status: InvoiceStatus;
  date: string;
  clientName?: string;
}

// ─── Leads ─────────────────────────────────────────────────
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Converted';

export interface Lead {
  id: number;
  name: string;
  email: string;
  service: string;
  source: string;
  status: LeadStatus;
  score: number;
  date: string;
}

// ─── Consultation Form ─────────────────────────────────────
export interface ConsultationData {
  name: string;
  email: string;
  phone: string;
  company: string;
  services: string[];
  timeline: string;
  message: string;
}

// ─── Valuation Calculator ──────────────────────────────────
export interface ValuationAnswers {
  industry?: string;
  annual_revenue?: string;
  years?: string;
  employees?: string;
  entity?: string;
  assets?: string;
  profitability?: string;
  goal?: string;
}

export interface ValuationResult {
  low: number;
  mid: number;
  high: number;
}
