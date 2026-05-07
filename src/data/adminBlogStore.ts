import { articles as defaultArticles, type Block } from "./blog";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ArticleStatus = "published" | "draft";
export type BlockType = "h2" | "h3" | "p" | "ul" | "ol" | "callout" | "highlight";

export interface AdminArticle {
  id: string;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: number;
  image: string;
  imageAlt: string;
  blocks: Block[];
  status: ArticleStatus;
  // Advanced SEO
  focusKeyword: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  noIndex: boolean;
  customSchema: string;
  // Meta
  createdAt: string;
  updatedAt: string;
}

export interface SeoCheck {
  label: string;
  pass: "ok" | "warn" | "error" | "neutral";
  detail: string;
}

// ─── Storage ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = "sn_blog_articles_v3";

function articleToAdmin(a: (typeof defaultArticles)[number]): AdminArticle {
  return {
    id: a.slug,
    slug: a.slug,
    title: a.title,
    seoTitle: a.seoTitle,
    seoDescription: a.seoDescription,
    excerpt: a.excerpt,
    category: a.category,
    date: a.date,
    readTime: a.readTime,
    image: a.image,
    imageAlt: a.imageAlt,
    blocks: a.blocks,
    status: "published",
    focusKeyword: "",
    ogTitle: a.seoTitle,
    ogDescription: a.seoDescription,
    ogImage: a.image,
    canonicalUrl: `https://studentatonapoleone.com/blog/${a.slug}`,
    noIndex: false,
    customSchema: "",
    createdAt: a.date,
    updatedAt: a.date,
  };
}

export function loadArticles(): AdminArticle[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AdminArticle[];
  } catch {}
  const initial = defaultArticles.map(articleToAdmin);
  saveArticles(initial);
  return initial;
}

export function saveArticles(articles: AdminArticle[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch {}
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

let _counter = 0;
export function generateId(): string {
  return `art_${Date.now()}_${++_counter}`;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function createBlankArticle(): AdminArticle {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    slug: "",
    title: "",
    seoTitle: "",
    seoDescription: "",
    excerpt: "",
    category: "Guida Pratica",
    date: new Date().toISOString().split("T")[0],
    readTime: 5,
    image: "",
    imageAlt: "",
    blocks: [{ type: "p", content: "Inizia a scrivere il tuo articolo qui..." }],
    status: "draft",
    focusKeyword: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    canonicalUrl: "",
    noIndex: false,
    customSchema: "",
    createdAt: now,
    updatedAt: now,
  };
}

// ─── SEO Analysis ─────────────────────────────────────────────────────────────

export function computeSeoScore(a: AdminArticle): { score: number; checks: SeoCheck[] } {
  const kw = a.focusKeyword.toLowerCase().trim();
  const titleLen = (a.seoTitle || a.title).length;
  const descLen = a.seoDescription.length;
  const titleText = (a.seoTitle || a.title).toLowerCase();
  const descText = a.seoDescription.toLowerCase();
  const slugText = a.slug.toLowerCase();
  const wordCount = a.blocks
    .map((b) => [(b.content ?? ""), ...(b.items ?? [])].join(" "))
    .join(" ")
    .split(/\s+/).filter(Boolean).length;

  const checks: SeoCheck[] = [];
  let earned = 0;
  const max = 10;

  // 1. Title length
  if (titleLen >= 50 && titleLen <= 60) {
    checks.push({ label: "Titolo SEO ottimale (50–60 caratteri)", pass: "ok", detail: `${titleLen} caratteri — perfetto.` });
    earned++;
  } else if (titleLen >= 45 && titleLen <= 65) {
    checks.push({ label: "Titolo SEO accettabile", pass: "warn", detail: `${titleLen} caratteri — ottimale tra 50–60.` });
    earned += 0.5;
  } else if (titleLen > 0) {
    checks.push({ label: "Titolo SEO fuori range", pass: "error", detail: `${titleLen} caratteri — mantieni tra 50–60.` });
  } else {
    checks.push({ label: "Titolo SEO mancante", pass: "error", detail: "Inserisci un titolo SEO." });
  }

  // 2. Meta description length
  if (descLen >= 150 && descLen <= 160) {
    checks.push({ label: "Meta description ottimale (150–160 caratteri)", pass: "ok", detail: `${descLen} caratteri — perfetto.` });
    earned++;
  } else if (descLen >= 130 && descLen <= 175) {
    checks.push({ label: "Meta description accettabile", pass: "warn", detail: `${descLen} caratteri — ottimale tra 150–160.` });
    earned += 0.5;
  } else if (descLen > 0) {
    checks.push({ label: "Meta description fuori range", pass: "error", detail: `${descLen} caratteri — mantieni tra 150–160.` });
  } else {
    checks.push({ label: "Meta description mancante", pass: "error", detail: "Inserisci una meta description." });
  }

  // 3. Focus keyword in title
  if (!kw) {
    checks.push({ label: "Keyword focus non impostata", pass: "warn", detail: "Imposta una keyword focus per analisi complete." });
    earned += 0.5;
  } else if (titleText.includes(kw)) {
    checks.push({ label: "Keyword nel titolo SEO", pass: "ok", detail: `"${a.focusKeyword}" trovata nel titolo.` });
    earned++;
  } else {
    checks.push({ label: "Keyword assente nel titolo SEO", pass: "error", detail: `Inserisci "${a.focusKeyword}" nel titolo.` });
  }

  // 4. Focus keyword in description
  if (kw) {
    if (descText.includes(kw)) {
      checks.push({ label: "Keyword nella meta description", pass: "ok", detail: `"${a.focusKeyword}" trovata nella description.` });
      earned++;
    } else {
      checks.push({ label: "Keyword assente nella description", pass: "warn", detail: `Inserisci "${a.focusKeyword}" nella description.` });
    }
  }

  // 5. Keyword in slug
  if (kw) {
    const kwSlug = kw.replace(/\s+/g, "-");
    if (slugText.includes(kwSlug) || slugText.includes(kw.replace(/\s+/g, ""))) {
      checks.push({ label: "Keyword nello slug URL", pass: "ok", detail: `"${a.focusKeyword}" presente nello slug.` });
      earned++;
    } else {
      checks.push({ label: "Keyword assente nello slug", pass: "warn", detail: `Considera di includere "${a.focusKeyword}" nello slug.` });
      earned += 0.5;
    }
  }

  // 6. Slug quality
  if (a.slug.length > 0 && a.slug.length <= 60) {
    checks.push({ label: "Slug URL ottimale (≤60 caratteri)", pass: "ok", detail: `${a.slug.length} caratteri.` });
    earned++;
  } else if (a.slug.length > 60) {
    checks.push({ label: "Slug URL troppo lungo", pass: "warn", detail: `${a.slug.length} caratteri — accorcia sotto i 60.` });
    earned += 0.5;
  } else {
    checks.push({ label: "Slug URL mancante", pass: "error", detail: "Inserisci uno slug URL." });
  }

  // 7. Image alt text
  if (a.imageAlt.trim().length > 0) {
    checks.push({ label: "Alt text immagine presente", pass: "ok", detail: a.imageAlt });
    earned++;
  } else {
    checks.push({ label: "Alt text immagine mancante", pass: "error", detail: "L'alt text migliora accessibilità e SEO." });
  }

  // 8. Image present
  if (a.image.trim().length > 0) {
    checks.push({ label: "Immagine in evidenza presente", pass: "ok", detail: "Open Graph e social sharing funzioneranno." });
    earned++;
  } else {
    checks.push({ label: "Immagine mancante", pass: "warn", detail: "Aggiungi un'immagine in evidenza per i social." });
    earned += 0.5;
  }

  // 9. Content length
  if (wordCount >= 300) {
    checks.push({ label: `Contenuto ricco (${wordCount} parole)`, pass: "ok", detail: "Google preferisce contenuti completi e approfonditi." });
    earned++;
  } else if (wordCount >= 150) {
    checks.push({ label: `Contenuto breve (${wordCount} parole)`, pass: "warn", detail: "Punta a 300+ parole per posizionarti meglio." });
    earned += 0.5;
  } else {
    checks.push({ label: `Contenuto troppo breve (${wordCount} parole)`, pass: "error", detail: "Aggiungi più contenuto (min. 300 parole)." });
  }

  // 10. Excerpt
  if (a.excerpt.trim().length >= 50) {
    checks.push({ label: "Excerpt presente", pass: "ok", detail: "Usato come anteprima nelle card del blog." });
    earned++;
  } else {
    checks.push({ label: "Excerpt mancante", pass: "warn", detail: "Aggiungi una breve descrizione dell'articolo." });
  }

  return {
    score: Math.min(100, Math.round((earned / max) * 100)),
    checks,
  };
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function exportBlogTs(articles: AdminArticle[]): string {
  const published = articles.filter((a) => a.status === "published");
  const data = published.map((a) => ({
    slug: a.slug,
    title: a.title,
    seoTitle: a.seoTitle || a.title,
    seoDescription: a.seoDescription,
    excerpt: a.excerpt,
    category: a.category,
    date: a.date,
    readTime: a.readTime,
    image: a.image,
    imageAlt: a.imageAlt,
    blocks: a.blocks,
  }));

  return `// AUTO-GENERATED da AdminBlog — ${new Date().toLocaleString("it-IT")}
// Sostituisci il contenuto di src/data/blog.ts con questo file.

export type BlockType = "h2" | "h3" | "p" | "ul" | "ol" | "callout" | "highlight";

export interface Block {
  type: BlockType;
  content?: string;
  items?: string[];
  emoji?: string;
}

export interface BlogArticle {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: number;
  image: string;
  imageAlt: string;
  blocks: Block[];
}

export const articles: BlogArticle[] = ${JSON.stringify(data, null, 2)};

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getRelatedArticles(slug: string, count = 3): BlogArticle[] {
  return articles.filter((a) => a.slug !== slug).slice(0, count);
}
`;
}

export const CATEGORIES = [
  "Guida Pratica",
  "Budget & Risparmio",
  "Vita a Padova",
  "Vita Universitaria",
  "Per i Genitori",
  "News Studentato",
];

export const BLOCK_LABELS: Record<string, string> = {
  h2: "Titolo H2",
  h3: "Titolo H3",
  p: "Paragrafo",
  ul: "Lista puntata",
  ol: "Lista numerata",
  callout: "Box informativo",
  highlight: "Box CTA",
};
