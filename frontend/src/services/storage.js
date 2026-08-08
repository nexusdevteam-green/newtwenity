import { apiUpload } from "./apiClient";

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
 * Sube una imagen de post al backend. Retorna la URL pública de la imagen.
 */
export async function uploadPostImage(file) {
  validateFile(file, MAX_FILE_SIZE);
  const { url } = await apiUpload("/uploads/post-image", file);
  return url;
}

/**
 * Sube o actualiza el avatar del usuario. Retorna la URL pública del avatar.
 */
export async function uploadAvatar(file) {
  validateFile(file, AVATAR_MAX_SIZE);
  const { url } = await apiUpload("/uploads/avatar", file);
  return url;
}
