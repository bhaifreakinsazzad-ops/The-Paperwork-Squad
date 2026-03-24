-- ============================================================
-- THE PAPERWORK SQUAD — SUPABASE DATABASE SCHEMA v2
-- Paste this entire file into: Supabase → SQL Editor → Run
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── client_profiles ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS client_profiles (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name          TEXT,
  email         TEXT,
  phone         TEXT,
  company       TEXT,
  role          TEXT DEFAULT 'client'
                  CHECK (role IN ('client','case_manager','admin','super_admin','billing')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── leads ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  services    TEXT[],
  timeline    TEXT,
  message     TEXT,
  source      TEXT DEFAULT 'website',
  status      TEXT DEFAULT 'New'
                CHECK (status IN ('New','Contacted','Qualified','Proposal Sent','Converted','Lost')),
  score       INTEGER DEFAULT 50,
  assigned_to UUID REFERENCES client_profiles(id),
  meta        JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── cases ────────────────────────────────────────────────
CREATE SEQUENCE IF NOT EXISTS case_number_seq START 1001;

CREATE TABLE IF NOT EXISTS cases (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  case_number   TEXT UNIQUE,
  client_id     UUID REFERENCES client_profiles(id) ON DELETE CASCADE,
  service       TEXT NOT NULL,
  package       TEXT,
  status        TEXT DEFAULT 'Submitted'
                  CHECK (status IN ('Submitted','Under Review','Waiting on Client',
                                    'In Process','Filed','Completed','On Hold','Cancelled')),
  stage_index   INTEGER DEFAULT 0,
  stages        TEXT[],
  assigned_to   UUID REFERENCES client_profiles(id),
  due_date      DATE,
  priority      TEXT DEFAULT 'medium' CHECK (priority IN ('high','medium','low')),
  internal_notes TEXT,
  client_notes  TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION set_case_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.case_number IS NULL THEN
    NEW.case_number := 'TPS-' || LPAD(NEXTVAL('case_number_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_case_number ON cases;
CREATE TRIGGER trg_case_number
  BEFORE INSERT ON cases
  FOR EACH ROW EXECUTE FUNCTION set_case_number();

-- ── tasks ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  case_id     UUID REFERENCES cases(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  priority    TEXT DEFAULT 'medium' CHECK (priority IN ('high','medium','low')),
  status      TEXT DEFAULT 'pending'
                CHECK (status IN ('pending','in_progress','completed','blocked')),
  assigned_to TEXT DEFAULT 'client' CHECK (assigned_to IN ('client','team')),
  due_date    DATE,
  completed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── messages ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  case_id     UUID REFERENCES cases(id) ON DELETE CASCADE,
  sender_id   UUID REFERENCES auth.users(id),
  sender_name TEXT NOT NULL,
  content     TEXT NOT NULL,
  internal    BOOLEAN DEFAULT FALSE,
  read_by     UUID[],
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── documents ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  case_id       UUID REFERENCES cases(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES auth.users(id),
  name          TEXT NOT NULL,
  size          BIGINT,
  storage_path  TEXT NOT NULL,
  url           TEXT,
  status        TEXT DEFAULT 'pending_review'
                  CHECK (status IN ('pending_review','approved','rejected','needs_revision')),
  admin_note    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── invoices ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id                       UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invoice_number           TEXT UNIQUE,
  client_id                UUID REFERENCES client_profiles(id) ON DELETE CASCADE,
  case_id                  UUID REFERENCES cases(id),
  service                  TEXT NOT NULL,
  amount                   DECIMAL(10,2) NOT NULL,
  status                   TEXT DEFAULT 'due'
                             CHECK (status IN ('due','paid','overdue','cancelled','refunded')),
  due_date                 DATE,
  stripe_payment_intent_id TEXT,
  stripe_payment_id        TEXT,
  paid_at                  TIMESTAMPTZ,
  notes                    TEXT,
  created_at               TIMESTAMPTZ DEFAULT NOW(),
  updated_at               TIMESTAMPTZ DEFAULT NOW()
);

-- ── notifications ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  message    TEXT,
  type       TEXT DEFAULT 'info' CHECK (type IN ('info','success','warning','error')),
  read       BOOLEAN DEFAULT FALSE,
  link       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── activity_logs ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_logs (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  actor_id    UUID REFERENCES auth.users(id),
  actor_name  TEXT,
  action      TEXT NOT NULL,
  entity_type TEXT,
  entity_id   UUID,
  meta        JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Storage bucket ────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT DO NOTHING;

-- ── Row Level Security ────────────────────────────────────
ALTER TABLE client_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads             ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases             ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks             ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages          ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents         ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices          ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs     ENABLE ROW LEVEL SECURITY;

-- Helper: is the calling user an admin?
CREATE OR REPLACE FUNCTION is_admin(uid UUID)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM client_profiles
    WHERE user_id = uid
      AND role IN ('admin','super_admin','case_manager','billing')
  );
END;
$$;

-- client_profiles
CREATE POLICY "own profile read"    ON client_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own profile write"   ON client_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "admin all profiles"  ON client_profiles FOR ALL    USING (is_admin(auth.uid()));
CREATE POLICY "insert on signup"    ON client_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- leads
CREATE POLICY "admin manages leads" ON leads FOR ALL USING (is_admin(auth.uid()));

-- cases
CREATE POLICY "client reads own cases"  ON cases FOR SELECT USING (
  client_id IN (SELECT id FROM client_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "admin manages all cases" ON cases FOR ALL USING (is_admin(auth.uid()));

-- tasks
CREATE POLICY "client reads own tasks"   ON tasks FOR SELECT USING (
  case_id IN (SELECT id FROM cases WHERE client_id IN (SELECT id FROM client_profiles WHERE user_id = auth.uid()))
);
CREATE POLICY "client updates own tasks" ON tasks FOR UPDATE USING (
  case_id IN (SELECT id FROM cases WHERE client_id IN (SELECT id FROM client_profiles WHERE user_id = auth.uid()))
);
CREATE POLICY "admin manages all tasks"  ON tasks FOR ALL USING (is_admin(auth.uid()));

-- messages
CREATE POLICY "client reads visible msgs" ON messages FOR SELECT USING (
  internal = FALSE AND
  case_id IN (SELECT id FROM cases WHERE client_id IN (SELECT id FROM client_profiles WHERE user_id = auth.uid()))
);
CREATE POLICY "client sends messages"    ON messages FOR INSERT WITH CHECK (
  case_id IN (SELECT id FROM cases WHERE client_id IN (SELECT id FROM client_profiles WHERE user_id = auth.uid()))
);
CREATE POLICY "admin manages all msgs"   ON messages FOR ALL USING (is_admin(auth.uid()));

-- documents
CREATE POLICY "user reads own docs"    ON documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user uploads docs"      ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admin manages all docs" ON documents FOR ALL    USING (is_admin(auth.uid()));

-- invoices
CREATE POLICY "client reads own invoices" ON invoices FOR SELECT USING (
  client_id IN (SELECT id FROM client_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "admin manages all invoices" ON invoices FOR ALL USING (is_admin(auth.uid()));

-- notifications
CREATE POLICY "user reads own notifs"    ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user marks notifs read"   ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "admin creates notifs"     ON notifications FOR INSERT USING (is_admin(auth.uid()));

-- activity_logs (admin read only)
CREATE POLICY "admin reads logs" ON activity_logs FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "system inserts logs" ON activity_logs FOR INSERT WITH CHECK (true);

-- ── Triggers ──────────────────────────────────────────────

-- Auto-create client_profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO client_profiles (user_id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role','client')
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- updated_at auto-refresh
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER touch_client_profiles  BEFORE UPDATE ON client_profiles  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER touch_cases            BEFORE UPDATE ON cases            FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER touch_tasks            BEFORE UPDATE ON tasks            FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER touch_documents        BEFORE UPDATE ON documents        FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER touch_invoices         BEFORE UPDATE ON invoices         FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ── Indexes ───────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_cases_client      ON cases(client_id);
CREATE INDEX IF NOT EXISTS idx_tasks_case        ON tasks(case_id);
CREATE INDEX IF NOT EXISTS idx_messages_case     ON messages(case_id);
CREATE INDEX IF NOT EXISTS idx_documents_case    ON documents(case_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client   ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_leads_status      ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created     ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifs_user       ON notifications(user_id);

-- ── Post-setup: promote first admin ───────────────────────
-- Run this after creating your admin account in Supabase Auth:
-- UPDATE client_profiles SET role = 'super_admin' WHERE email = 'admin@tps.com';
