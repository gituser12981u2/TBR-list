// api/routes/openLibRoutes.ts
import express from "express";
import {fetchBookCovers} from "../controllers/openLibController";

const router = express.Router();

router.get("/bookcovers", fetchBookCovers);

export default router;
