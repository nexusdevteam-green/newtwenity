import { Router } from "express";
import authRoutes from "./auth.js";
import profileRoutes from "./profiles.js";
import postRoutes from "./posts.js";
import commentRoutes from "./comments.js";
import uploadRoutes from "./uploads.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/profiles", profileRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);
router.use("/uploads", uploadRoutes);

export default router;
