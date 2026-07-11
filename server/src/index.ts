import { mkdirSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import cors from "cors";
import express, { type Request, type Response } from "express";
import multer from "multer";
import {
  DATA_DIR,
  UPLOADS_DIR,
  addCard,
  deleteCard,
  getCard,
  listCards,
  type PhotoCard,
} from "./store.js";

const PORT = Number(process.env.PORT ?? 4000);

// Ensure storage directories exist before multer writes uploaded files.
mkdirSync(DATA_DIR, { recursive: true });
mkdirSync(UPLOADS_DIR, { recursive: true });
const TEMPLATES = ["birthday", "thankyou", "holiday", "wedding", "classic"];

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".img";
    cb(null, `${randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, file.mimetype.startsWith("image/"));
  },
});

app.use("/uploads", express.static(UPLOADS_DIR));

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "photo-cards", time: new Date().toISOString() });
});

app.get("/api/templates", (_req: Request, res: Response) => {
  res.json({ templates: TEMPLATES });
});

app.get("/api/cards", async (_req: Request, res: Response) => {
  res.json(await listCards());
});

app.get("/api/cards/:id", async (req: Request, res: Response) => {
  const card = await getCard(String(req.params.id));
  if (!card) {
    res.status(404).json({ error: "Card not found" });
    return;
  }
  res.json(card);
});

app.post(
  "/api/cards",
  upload.single("photo"),
  async (req: Request, res: Response) => {
    const title = String(req.body.title ?? "").trim();
    const message = String(req.body.message ?? "").trim();
    const recipient = String(req.body.recipient ?? "").trim();
    const template = String(req.body.template ?? "classic").trim();

    if (!title) {
      res.status(400).json({ error: "Title is required" });
      return;
    }
    if (!TEMPLATES.includes(template)) {
      res.status(400).json({ error: `Unknown template: ${template}` });
      return;
    }

    const card: PhotoCard = {
      id: randomUUID(),
      title,
      message,
      recipient,
      template,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      createdAt: new Date().toISOString(),
    };

    await addCard(card);
    res.status(201).json(card);
  },
);

app.delete("/api/cards/:id", async (req: Request, res: Response) => {
  const removed = await deleteCard(String(req.params.id));
  if (!removed) {
    res.status(404).json({ error: "Card not found" });
    return;
  }
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`[photo-cards] API listening on http://localhost:${PORT}`);
});
