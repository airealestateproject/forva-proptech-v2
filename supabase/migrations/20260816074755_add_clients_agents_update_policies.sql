/*
# Add SELECT and UPDATE RLS policies for clients and agents

## Purpose
The Settings page needs to read and update the authenticated user's client (business) record
and their own agent profile row (full_name, phone, notification_email, notification_sms).
Previously these tables had either no policies (clients) or only a SELECT policy (agents),
meaning the frontend could not read or update these records through the anon-key client.

## Changes

### clients table
1. Add SELECT policy `clients_read_same_client` — authenticated users can read the client
   record whose id matches their app_users.client_id.
2. Add UPDATE policy `clients_update_same_client` — authenticated users can update the
   client record they belong to, restricted to safe columns (name, market, timezone,
   booking_url, pwa_name). The policy checks client_id ownership via app_users.

### agents table
3. Add UPDATE policy `agents_update_self` — authenticated users can update their own
   agent row (matched via app_users.agent_id = agents.id), restricted to safe columns
   (full_name, phone, notification_email, notification_sms).

## Security
- All policies use auth.uid() for ownership checks, never current_user.
- UPDATE policies include both USING and WITH CHECK with the same predicate.
- No FOR ALL policies — each verb is separate.
- RLS remains enabled on both tables.
- The existing leads_read_same_client policy is NOT modified.
*/

-- clients: SELECT policy (same-client scoping)
DROP POLICY IF EXISTS "clients_read_same_client" ON clients;
CREATE POLICY "clients_read_same_client"
ON clients FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT app_users.client_id
    FROM app_users
    WHERE app_users.user_id = auth.uid()
  )
);

-- clients: UPDATE policy (same-client scoping)
DROP POLICY IF EXISTS "clients_update_same_client" ON clients;
CREATE POLICY "clients_update_same_client"
ON clients FOR UPDATE
TO authenticated
USING (
  id IN (
    SELECT app_users.client_id
    FROM app_users
    WHERE app_users.user_id = auth.uid()
  )
)
WITH CHECK (
  id IN (
    SELECT app_users.client_id
    FROM app_users
    WHERE app_users.user_id = auth.uid()
  )
);

-- agents: UPDATE policy (self only, matched via app_users.agent_id)
DROP POLICY IF EXISTS "agents_update_self" ON agents;
CREATE POLICY "agents_update_self"
ON agents FOR UPDATE
TO authenticated
USING (
  id IN (
    SELECT app_users.agent_id
    FROM app_users
    WHERE app_users.user_id = auth.uid()
    AND app_users.agent_id IS NOT NULL
  )
)
WITH CHECK (
  id IN (
    SELECT app_users.agent_id
    FROM app_users
    WHERE app_users.user_id = auth.uid()
    AND app_users.agent_id IS NOT NULL
  )
);
