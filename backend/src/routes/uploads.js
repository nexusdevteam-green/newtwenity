import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth.js";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_POST_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

function fileExtension(filename) {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop() : "jpg";
}

router.post("/post-image", requireAuth, upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No se ha enviado ningún archivo." });
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    return res.status(400).json({
      error: `Tipo de archivo no permitido: ${file.mimetype}. Usa JPG, PNG, WebP o GIF.`,
    });
  }
  if (file.size > MAX_POST_IMAGE_SIZE) {
    return res.status(400).json({ error: "El archivo excede el tamaño máximo de 5MB." });
  }

  const filePath = `${req.user.id}/${Date.now()}.${fileExtension(file.originalname)}`;
  const { error: uploadError } = await req.supabase.storage
    .from("post-images")
    .upload(filePath, file.buffer, { contentType: file.mimetype, cacheControl: "3600", upsert: false });

  if (uploadError) return res.status(400).json({ error: uploadError.message });

  const {
    data: { publicUrl },
  } = req.supabase.storage.from("post-images").getPublicUrl(filePath);

  res.json({ url: publicUrl });
});

router.post("/avatar", requireAuth, upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No se ha enviado ningún archivo." });
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    return res.status(400).json({
      error: `Tipo de archivo no permitido: ${file.mimetype}. Usa JPG, PNG, WebP o GIF.`,
    });
  }
  if (file.size > MAX_AVATAR_SIZE) {
    return res.status(400).json({ error: "El archivo excede el tamaño máximo de 2MB." });
  }

  const filePath = `${req.user.id}/avatar.${fileExtension(file.originalname)}`;
  const { error: uploadError } = await req.supabase.storage
    .from("avatars")
    .upload(filePath, file.buffer, { contentType: file.mimetype, cacheControl: "3600", upsert: true });

  if (uploadError) return res.status(400).json({ error: uploadError.message });

  const {
    data: { publicUrl },
  } = req.supabase.storage.from("avatars").getPublicUrl(filePath);

  res.json({ url: publicUrl });
});

export default router;
