import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const DATA_DIR = path.resolve(__dirname, "..", "data");
export const UPLOADS_DIR = path.resolve(__dirname, "..", "uploads");
const DATA_FILE = path.join(DATA_DIR, "cards.json");

export interface PhotoCard {
  id: string;
  title: string;
  message: string;
  recipient: string;
  template: string;
  imageUrl: string | null;
  createdAt: string;
}

async function ensureStorage(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf8");
  }
}

async function readAll(): Promise<PhotoCard[]> {
  await ensureStorage();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw) as PhotoCard[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(cards: PhotoCard[]): Promise<void> {
  await ensureStorage();
  await fs.writeFile(DATA_FILE, JSON.stringify(cards, null, 2), "utf8");
}

export async function listCards(): Promise<PhotoCard[]> {
  const cards = await readAll();
  return cards.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getCard(id: string): Promise<PhotoCard | undefined> {
  const cards = await readAll();
  return cards.find((c) => c.id === id);
}

export async function addCard(card: PhotoCard): Promise<PhotoCard> {
  const cards = await readAll();
  cards.push(card);
  await writeAll(cards);
  return card;
}

export async function deleteCard(id: string): Promise<boolean> {
  const cards = await readAll();
  const next = cards.filter((c) => c.id !== id);
  if (next.length === cards.length) return false;
  await writeAll(next);
  return true;
}
