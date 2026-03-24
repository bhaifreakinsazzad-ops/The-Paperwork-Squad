import { createClient } from '@supabase/supabase-js';

// ─── Client ────────────────────────────────────────────────
// PLACEHOLDER: replace with your real values from supabase.com → Settings → API
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Auth ──────────────────────────────────────────────────
export async function signUp(email: string, password: string, name: string, company?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, company, role: 'client' } },
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

// ─── Leads ─────────────────────────────────────────────────
export async function saveLead(payload: {
  name: string; email: string; phone?: string;
  services?: string[]; timeline?: string; message?: string;
  source?: string; meta?: object;
}) {
  const { data, error } = await supabase
    .from('leads')
    .insert([{ ...payload, source: payload.source ?? 'website', status: 'New' }])
    .select();
  if (error) throw error;
  return data;
}

export async function getLeads() {
  const { data, error } = await supabase
    .from('leads').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateLeadStatus(id: string, status: string) {
  const { error } = await supabase.from('leads').update({ status }).eq('id', id);
  if (error) throw error;
}

// ─── Cases ─────────────────────────────────────────────────
export async function getCasesForClient(clientId: string) {
  const { data, error } = await supabase
    .from('cases').select('*').eq('client_id', clientId).order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getAllCases() {
  const { data, error } = await supabase
    .from('cases').select('*, client_profiles(name, company)').order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateCaseStatus(caseId: string, status: string) {
  const { error } = await supabase
    .from('cases').update({ status, updated_at: new Date().toISOString() }).eq('id', caseId);
  if (error) throw error;
}

// ─── Tasks ─────────────────────────────────────────────────
export async function getTasksForCase(caseId: string) {
  const { data, error } = await supabase
    .from('tasks').select('*').eq('case_id', caseId).order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function updateTask(taskId: string, updates: object) {
  const { error } = await supabase
    .from('tasks').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', taskId);
  if (error) throw error;
}

// ─── Messages ──────────────────────────────────────────────
export async function getMessages(caseId: string) {
  const { data, error } = await supabase
    .from('messages').select('*').eq('case_id', caseId).order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function sendMessage(caseId: string, senderId: string, senderName: string, content: string) {
  const { data, error } = await supabase
    .from('messages').insert([{ case_id: caseId, sender_id: senderId, sender_name: senderName, content }]).select();
  if (error) throw error;
  return data;
}

// ─── Documents ─────────────────────────────────────────────
export async function uploadDocument(file: File, caseId: string, userId: string) {
  const ext = file.name.split('.').pop();
  const path = `${userId}/${caseId}/${Date.now()}.${ext}`;
  const { error: uploadError } = await supabase.storage.from('documents').upload(path, file);
  if (uploadError) throw uploadError;
  const { data: urlData } = supabase.storage.from('documents').getPublicUrl(path);
  const { data, error } = await supabase
    .from('documents')
    .insert([{ case_id: caseId, user_id: userId, name: file.name, size: file.size, storage_path: path, url: urlData.publicUrl, status: 'pending_review' }])
    .select();
  if (error) throw error;
  return data;
}

export async function getDocuments(caseId: string) {
  const { data, error } = await supabase
    .from('documents').select('*').eq('case_id', caseId).order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// ─── Invoices ──────────────────────────────────────────────
export async function getInvoicesForClient(clientId: string) {
  const { data, error } = await supabase
    .from('invoices').select('*').eq('client_id', clientId).order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getAllInvoices() {
  const { data, error } = await supabase
    .from('invoices').select('*, client_profiles(name)').order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
