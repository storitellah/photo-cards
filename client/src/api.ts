export interface PhotoCard {
  id: string;
  title: string;
  message: string;
  recipient: string;
  template: string;
  imageUrl: string | null;
  createdAt: string;
}

export interface NewCardInput {
  title: string;
  message: string;
  recipient: string;
  template: string;
  photo: File | null;
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) detail = body.error;
    } catch {
      // ignore body parse errors
    }
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}

export async function fetchCards(): Promise<PhotoCard[]> {
  return handle<PhotoCard[]>(await fetch("/api/cards"));
}

export async function fetchTemplates(): Promise<string[]> {
  const data = await handle<{ templates: string[] }>(
    await fetch("/api/templates"),
  );
  return data.templates;
}

export async function createCard(input: NewCardInput): Promise<PhotoCard> {
  const form = new FormData();
  form.append("title", input.title);
  form.append("message", input.message);
  form.append("recipient", input.recipient);
  form.append("template", input.template);
  if (input.photo) form.append("photo", input.photo);

  return handle<PhotoCard>(
    await fetch("/api/cards", { method: "POST", body: form }),
  );
}

export async function deleteCard(id: string): Promise<void> {
  const res = await fetch(`/api/cards/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) {
    throw new Error("Failed to delete card");
  }
}
