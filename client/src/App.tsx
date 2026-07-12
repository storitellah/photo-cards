import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  createCard,
  deleteCard,
  fetchCards,
  fetchTemplates,
  type PhotoCard,
} from "./api";
import Clock from "./Clock";
import Footer from "./Footer";
import "./App.css";

const FALLBACK_TEMPLATES = [
  "birthday",
  "thankyou",
  "holiday",
  "wedding",
  "classic",
];

export default function App() {
  const [cards, setCards] = useState<PhotoCard[]>([]);
  const [templates, setTemplates] = useState<string[]>(FALLBACK_TEMPLATES);
  const [title, setTitle] = useState("");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [template, setTemplate] = useState("classic");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates()
      .then((t) => {
        if (t.length > 0) setTemplates(t);
      })
      .catch(() => setTemplates(FALLBACK_TEMPLATES));
    refreshCards();
  }, []);

  function refreshCards() {
    fetchCards()
      .then(setCards)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Failed to load cards"),
      );
  }

  function onPhotoChange(file: File | null) {
    setPhoto(file);
    setPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Please give your card a title.");
      return;
    }
    setSubmitting(true);
    try {
      await createCard({ title, recipient, message, template, photo });
      setTitle("");
      setRecipient("");
      setMessage("");
      setTemplate("classic");
      onPhotoChange(null);
      setFileInputKey((k) => k + 1);
      refreshCards();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create card");
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id: string) {
    try {
      await deleteCard(id);
      refreshCards();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete card");
    }
  }

  const cardCountLabel = useMemo(
    () => (cards.length === 1 ? "1 card" : `${cards.length} cards`),
    [cards.length],
  );

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">
          PhotoCards{" "}
          <span className="app__by">
            by{" "}
            <a
              href="https://storitellah.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Storitellah
            </a>
          </span>
        </h1>
        <p>Create, customize, and collect personalized photo cards.</p>
        <Clock />
      </header>

      <main className="layout">
        <section className="panel">
          <h2>Create a card</h2>
          <form className="form" onSubmit={onSubmit}>
            <label className="field">
              <span>Title *</span>
              <input
                type="text"
                value={title}
                placeholder="Happy Birthday!"
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label className="field">
              <span>Recipient</span>
              <input
                type="text"
                value={recipient}
                placeholder="For Grandma"
                onChange={(e) => setRecipient(e.target.value)}
              />
            </label>

            <label className="field">
              <span>Message</span>
              <textarea
                value={message}
                rows={3}
                placeholder="Wishing you a wonderful day!"
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>

            <label className="field">
              <span>Template</span>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
              >
                {templates.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Photo</span>
              <input
                key={fileInputKey}
                type="file"
                accept="image/*"
                onChange={(e) => onPhotoChange(e.target.files?.[0] ?? null)}
              />
            </label>

            {photoPreview && (
              <img
                className="preview"
                src={photoPreview}
                alt="Selected preview"
              />
            )}

            {error && <p className="error">{error}</p>}

            <button type="submit" disabled={submitting}>
              {submitting ? "Creating…" : "Create card"}
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="gallery__head">
            <h2>Your cards</h2>
            <span className="badge">{cardCountLabel}</span>
          </div>

          {cards.length === 0 ? (
            <p className="empty">No cards yet — create your first one!</p>
          ) : (
            <ul className="gallery">
              {cards.map((card) => (
                <li
                  key={card.id}
                  className={`card card--${card.template}`}
                  data-testid="photo-card"
                >
                  {card.imageUrl && (
                    <img
                      className="card__image"
                      src={card.imageUrl}
                      alt={card.title}
                    />
                  )}
                  <div className="card__body">
                    <span className="card__template">{card.template}</span>
                    <h3>{card.title}</h3>
                    {card.recipient && (
                      <p className="card__recipient">To: {card.recipient}</p>
                    )}
                    {card.message && (
                      <p className="card__message">{card.message}</p>
                    )}
                  </div>
                  <button
                    className="card__delete"
                    type="button"
                    onClick={() => onDelete(card.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
