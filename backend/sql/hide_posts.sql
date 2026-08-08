-- ============================================================
-- TUENTIES - Migración: ocultar publicaciones propias
-- Ejecuta este archivo en el SQL Editor de Supabase Dashboard
-- (después de schema.sql y rls_policies.sql)
-- ============================================================

ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN NOT NULL DEFAULT false;

-- Un post oculto solo lo puede seguir viendo su propio autor.
DROP POLICY IF EXISTS "posts_select_public" ON posts;
CREATE POLICY "posts_select_public"
  ON posts FOR SELECT
  USING (NOT is_hidden OR auth.uid() = user_id);
