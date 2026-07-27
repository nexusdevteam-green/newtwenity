import { supabase } from "./supabase";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const AVATAR_MAX_SIZE = 2 * 1024 * 1024; // 2MB

/**
 * Valida que el archivo sea una imagen permitida y no exceda el tamaño máximo.
 */
function validateFile(file, maxSize) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      `Tipo de archivo no permitido: ${file.type}. Usa JPG, PNG, WebP o GIF.`
    );
  }
  if (file.size > maxSize) {
    throw new Error(
      `El archivo excede el tamaño máximo de ${Math.round(maxSize / 1024 / 1024)}MB.`
    );
  }
}

/**
 * Sube una imagen de post a Supabase Storage.
 * Retorna la URL pública de la imagen.
 */
export async function uploadPostImage(file) {
  validateFile(file, MAX_FILE_SIZE);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No hay usuario autenticado");

  const fileExt = file.name.split(".").pop();
  const filePath = `${user.id}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("post-images").getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Sube o actualiza el avatar del usuario.
 * Retorna la URL pública del avatar.
 */
export async function uploadAvatar(file) {
  validateFile(file, AVATAR_MAX_SIZE);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No hay usuario autenticado");

  const fileExt = file.name.split(".").pop();
  const filePath = `${user.id}/avatar.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Elimina una imagen de post del storage.
 */
export async function deletePostImage(filePath) {
  const { error } = await supabase.storage
    .from("post-images")
    .remove([filePath]);
  if (error) throw error;
}
