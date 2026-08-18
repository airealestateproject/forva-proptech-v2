/*
# Production Readiness Part 1: Schema additions + is_super_admin function

Creates the is_super_admin() SECURITY DEFINER function first, then adds columns,
tables, and RLS policies that reference it.
*/

-- ============================================================
-- 1. is_super_admin() SECURITY DEFINER function — MUST come first
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM app_users
    WHERE user_id = auth.uid()
    AND role = 'super_admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;

-- ============================================================
-- 2. agents table — add avatar_url and notification_in_app
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'agents' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE agents ADD COLUMN avatar_url text;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'agents' AND column_name = 'notification_in_app'
  ) THEN
    ALTER TABLE agents ADD COLUMN notification_in_app boolean NOT NULL DEFAULT true;
  END IF;
END $$;

-- ============================================================
-- 3. closed_deals table
-- ============================================================
CREATE TABLE IF NOT EXISTS closed_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  transaction_price numeric,
  closing_date date,
  lead_source text,
  commission_amount numeric,
  notes text,
  status text NOT NULL DEFAULT 'user_declared' CHECK (status IN ('user_declared', 'verified')),
  declared_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  declared_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_closed_deals_client_id ON closed_deals(client_id);
CREATE INDEX IF NOT EXISTS idx_closed_deals_lead_id ON closed_deals(lead_id);
CREATE INDEX IF NOT EXISTS idx_closed_deals_agent_id ON closed_deals(agent_id);

ALTER TABLE closed_deals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "closed_deals_read_same_client" ON closed_deals;
CREATE POLICY "closed_deals_read_same_client"
ON closed_deals FOR SELECT
TO authenticated
USING (
  public.is_super_admin()
  OR client_id IN (
    SELECT app_users.client_id FROM app_users WHERE app_users.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "closed_deals_insert_same_client" ON closed_deals;
CREATE POLICY "closed_deals_insert_same_client"
ON closed_deals FOR INSERT
TO authenticated
WITH CHECK (
  client_id IN (
    SELECT app_users.client_id FROM app_users WHERE app_users.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "closed_deals_update_same_client" ON closed_deals;
CREATE POLICY "closed_deals_update_same_client"
ON closed_deals FOR UPDATE
TO authenticated
USING (
  public.is_super_admin()
  OR client_id IN (
    SELECT app_users.client_id FROM app_users WHERE app_users.user_id = auth.uid()
  )
)
WITH CHECK (
  client_id IN (
    SELECT app_users.client_id FROM app_users WHERE app_users.user_id = auth.uid()
  )
);

-- ============================================================
-- 4. subscriptions table
-- ============================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL UNIQUE REFERENCES clients(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'trial' CHECK (plan IN ('trial', 'solo', 'team', 'agency')),
  status text NOT NULL DEFAULT 'trialing' CHECK (status IN ('trialing', 'active', 'canceled', 'past_due', 'incomplete')),
  monthly_price numeric,
  trial_ends_at timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  canceled_at timestamptz,
  provider text,
  provider_customer_id text,
  provider_subscription_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_client_id ON subscriptions(client_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "subscriptions_read_own" ON subscriptions;
CREATE POLICY "subscriptions_read_own"
ON subscriptions FOR SELECT
TO authenticated
USING (
  public.is_super_admin()
  OR client_id IN (
    SELECT app_users.client_id FROM app_users WHERE app_users.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "subscriptions_insert_own" ON subscriptions;
CREATE POLICY "subscriptions_insert_own"
ON subscriptions FOR INSERT
TO authenticated
WITH CHECK (
  client_id IN (
    SELECT app_users.client_id FROM app_users WHERE app_users.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "subscriptions_update_own" ON subscriptions;
CREATE POLICY "subscriptions_update_own"
ON subscriptions FOR UPDATE
TO authenticated
USING (
  public.is_super_admin()
  OR client_id IN (
    SELECT app_users.client_id FROM app_users WHERE app_users.user_id = auth.uid()
  )
)
WITH CHECK (
  client_id IN (
    SELECT app_users.client_id FROM app_users WHERE app_users.user_id = auth.uid()
  )
);

-- ============================================================
-- 5. leads UPDATE policy
-- ============================================================
DROP POLICY IF EXISTS "leads_update_same_client" ON leads;
CREATE POLICY "leads_update_same_client"
ON leads FOR UPDATE
TO authenticated
USING (
  client_id IN (
    SELECT app_users.client_id FROM app_users WHERE app_users.user_id = auth.uid()
  )
)
WITH CHECK (
  client_id IN (
    SELECT app_users.client_id FROM app_users WHERE app_users.user_id = auth.uid()
  )
);

-- ============================================================
-- 6. agent_notifications UPDATE and INSERT policies
-- ============================================================
DROP POLICY IF EXISTS "notifications_update_same_client" ON agent_notifications;
CREATE POLICY "notifications_update_same_client"
ON agent_notifications FOR UPDATE
TO authenticated
USING (
  client_id IN (
    SELECT app_users.client_id FROM app_users WHERE app_users.user_id = auth.uid()
  )
)
WITH CHECK (
  client_id IN (
    SELECT app_users.client_id FROM app_users WHERE app_users.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "notifications_insert_same_client" ON agent_notifications;
CREATE POLICY "notifications_insert_same_client"
ON agent_notifications FOR INSERT
TO authenticated
WITH CHECK (
  client_id IN (
    SELECT app_users.client_id FROM app_users WHERE app_users.user_id = auth.uid()
  )
);

-- ============================================================
-- 7. activities SELECT and INSERT policies
-- ============================================================
DROP POLICY IF EXISTS "activities_read_same_client" ON activities;
CREATE POLICY "activities_read_same_client"
ON activities FOR SELECT
TO authenticated
USING (
  public.is_super_admin()
  OR EXISTS (
    SELECT 1 FROM leads
    WHERE leads.id = activities.lead_id
    AND leads.client_id IN (
      SELECT app_users.client_id FROM app_users WHERE app_users.user_id = auth.uid()
    )
  )
);

DROP POLICY IF EXISTS "activities_insert_same_client" ON activities;
CREATE POLICY "activities_insert_same_client"
ON activities FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM leads
    WHERE leads.id = activities.lead_id
    AND leads.client_id IN (
      SELECT app_users.client_id FROM app_users WHERE app_users.user_id = auth.uid()
    )
  )
);

-- ============================================================
-- 8. Super Admin platform-wide read policies
-- ============================================================

DROP POLICY IF EXISTS "leads_read_all_super_admin" ON leads;
CREATE POLICY "leads_read_all_super_admin"
ON leads FOR SELECT
TO authenticated
USING (public.is_super_admin());

DROP POLICY IF EXISTS "agents_read_all_super_admin" ON agents;
CREATE POLICY "agents_read_all_super_admin"
ON agents FOR SELECT
TO authenticated
USING (public.is_super_admin());

DROP POLICY IF EXISTS "clients_read_all_super_admin" ON clients;
CREATE POLICY "clients_read_all_super_admin"
ON clients FOR SELECT
TO authenticated
USING (public.is_super_admin());

DROP POLICY IF EXISTS "app_users_read_all_super_admin" ON app_users;
CREATE POLICY "app_users_read_all_super_admin"
ON app_users FOR SELECT
TO authenticated
USING (public.is_super_admin());

DROP POLICY IF EXISTS "notifications_read_all_super_admin" ON agent_notifications;
CREATE POLICY "notifications_read_all_super_admin"
ON agent_notifications FOR SELECT
TO authenticated
USING (public.is_super_admin());

DROP POLICY IF EXISTS "appointments_read_all_super_admin" ON appointments;
CREATE POLICY "appointments_read_all_super_admin"
ON appointments FOR SELECT
TO authenticated
USING (public.is_super_admin());

-- ============================================================
-- 9. Storage bucket for avatars
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "avatar_read_all" ON storage.objects;
CREATE POLICY "avatar_read_all"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatar_upload_own" ON storage.objects;
CREATE POLICY "avatar_upload_own"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "avatar_update_own" ON storage.objects;
CREATE POLICY "avatar_update_own"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "avatar_delete_own" ON storage.objects;
CREATE POLICY "avatar_delete_own"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
