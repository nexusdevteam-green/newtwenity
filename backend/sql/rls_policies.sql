-- ============================================================
-- TUENTIES - Políticas Row Level Security (RLS)
-- Ejecuta este archivo DESPUÉS de schema.sql
-- ============================================================

-- ============================================================
-- Habilitar RLS en todas las tablas
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLÍTICAS: profiles
-- ============================================================

-- Cualquiera puede ver cualquier perfil (lectura pública)
CREATE POLICY "profiles_select_public"
  ON profiles FOR SELECT
  USING (true);

-- Un usuario solo puede actualizar su propio perfil
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Un usuario puede insertar su propio perfil (respaldo del trigger)
CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- POLÍTICAS: posts
-- ============================================================

-- Cualquiera puede leer todos los posts (feed público)
CREATE POLICY "posts_select_public"
  ON posts FOR SELECT
  USING (true);

-- Un usuario autenticado puede insertar sus propios posts
CREATE POLICY "posts_insert_own"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Un usuario solo puede actualizar sus propios posts
CREATE POLICY "posts_update_own"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Un usuario solo puede eliminar sus propios posts
CREATE POLICY "posts_delete_own"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- POLÍTICAS: likes
-- ============================================================

-- Cualquiera puede leer los likes (para contadores)
CREATE POLICY "likes_select_public"
  ON likes FOR SELECT
  USING (true);

-- Un usuario puede dar like (insertar) con su propio user_id
CREATE POLICY "likes_insert_own"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Un usuario puede eliminar su propio like
CREATE POLICY "likes_delete_own"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- POLÍTICAS: comments
-- ============================================================

-- Cualquiera puede leer los comentarios
CREATE POLICY "comments_select_public"
  ON comments FOR SELECT
  USING (true);

-- Un usuario autenticado puede insertar comentarios
CREATE POLICY "comments_insert_own"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Un usuario solo puede eliminar sus propios comentarios
CREATE POLICY "comments_delete_own"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- POLÍTICAS DE STORAGE
-- Ejecutar desde Supabase Dashboard > Storage > Policies
-- O crear las bucket policies manualmente:
-- ============================================================

-- Bucket: post-images
-- Policy:任何人 can read (public bucket)
-- Policy: Authenticated users can upload
-- Policy: Users can delete their own files

-- Bucket: avatars
-- Policy: Anyone can read (public bucket)
-- Policy: Authenticated users can upload
-- Policy: Users can update/delete their own avatar
