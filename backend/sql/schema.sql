-- ============================================================
-- TUENTIES - Esquema completo de base de datos
-- Ejecuta este archivo en el SQL Editor de Supabase Dashboard
-- ============================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLA: profiles
-- Perfil de usuario extendido. Se crea automáticamente al
-- registrarse un usuario en auth.users mediante un trigger.
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  birthday TEXT NOT NULL DEFAULT '',
  study_or_work TEXT NOT NULL DEFAULT '',
  pet TEXT NOT NULL DEFAULT '',
  hobbies TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE profiles IS 'Perfiles de usuario extendidos, sincronizados con auth.users';

-- ============================================================
-- TABLA: posts
-- Publicaciones tipo blog/estado. Pueden tener imagen opcional.
-- ============================================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE posts IS 'Publicaciones de los usuarios en el muro';

-- ============================================================
-- TABLA: likes
-- Cada usuario puede dar "me gusta" una sola vez por post.
-- ============================================================
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

COMMENT ON TABLE likes IS 'Me gusta de los usuarios en las publicaciones';

-- ============================================================
-- TABLA: comments
-- Comentarios en las publicaciones.
-- ============================================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE comments IS 'Comentarios en las publicaciones';

-- ============================================================
-- ÍNDICES para rendimiento
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- ============================================================
-- FUNCIÓN: handle_new_user()
-- Se ejecuta al crear un usuario en auth.users.
-- Crea automáticamente su perfil en profiles.
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  raw_name TEXT;
  clean_username TEXT;
  counter INT := 0;
  final_username TEXT;
BEGIN
  -- Obtener el nombre del metadata del usuario
  raw_name := COALESCE(NEW.raw_user_meta_data->>'display_name', '');
  IF raw_name = '' THEN
    raw_name := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
  END IF;

  -- Generar username limpio: minúsculas, sin espacios, solo alfanuméricos y guiones
  clean_username := lower(regexp_replace(raw_name, '[^a-zA-Z0-9]', '', 'g'));
  IF clean_username = '' THEN
    clean_username := split_part(NEW.email, '@', 1);
  END IF;

  -- Asegurar que el username sea único
  final_username := clean_username;
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := clean_username || counter::TEXT;
  END LOOP;

  -- Insertar el perfil
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    final_username,
    raw_name,
    'https://i.pravatar.cc/300?u=' || NEW.email
  );

  RETURN NEW;
END;
$$;

-- ============================================================
-- TRIGGER: on_auth_user_created
-- Ejecuta handle_new_user cuando se inserta un usuario en auth.users.
-- ============================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- FUNCIÓN: update_updated_at()
-- Actualiza el campo updated_at automáticamente.
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS set_updated_at ON profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON posts;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- FUNCIÓN: get_post_likes_count(post_id)
-- Retorna el número de likes de un post.
-- ============================================================
CREATE OR REPLACE FUNCTION get_post_likes_count(p_post_id UUID)
RETURNS BIGINT
LANGUAGE sql
STABLE
AS $$
  SELECT COUNT(*)::BIGINT FROM likes WHERE post_id = p_post_id;
$$;

-- ============================================================
-- FUNCIÓN: get_post_comments_count(post_id)
-- Retorna el número de comentarios de un post.
-- ============================================================
CREATE OR REPLACE FUNCTION get_post_comments_count(p_post_id UUID)
RETURNS BIGINT
LANGUAGE sql
STABLE
AS $$
  SELECT COUNT(*)::BIGINT FROM comments WHERE post_id = p_post_id;
$$;

-- ============================================================
-- FUNCIÓN: has_user_liked_post(user_id, post_id)
-- Verifica si un usuario ya dio like a un post.
-- ============================================================
CREATE OR REPLACE FUNCTION has_user_liked_post(p_user_id UUID, p_post_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM likes WHERE user_id = p_user_id AND post_id = p_post_id
  );
$$;

-- ============================================================
-- STORAGE BUCKETS
-- Ejecutar desde el Dashboard de Supabase > Storage > New Bucket
-- Bucket: post-images
--   - Public: true
--   - File size limit: 5MB
--   - Allowed MIME types: image/jpeg, image/png, image/webp, image/gif
--
-- Bucket: avatars
--   - Public: true
--   - File size limit: 2MB
--   - Allowed MIME types: image/jpeg, image/png, image/webp
-- ============================================================
-- NOTA: Los buckets se crean desde el dashboard de Supabase,
-- no desde SQL. Abre Supabase Dashboard > Storage > New Bucket.
