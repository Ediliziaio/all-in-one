import { useParams, Link, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { Schema } from "@/components/Schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getArticleBySlug, getRelatedArticles, type Block } from "@/data/blog";
import { Clock, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

const categoryColors: Record<string, string> = {
  "Guida Pratica": "bg-blue-100 text-blue-800",
  "Budget & Risparmio": "bg-green-100 text-green-800",
  "Vita a Padova": "bg-orange-100 text-orange-800",
  "Vita Universitaria": "bg-purple-100 text-purple-800",
  "Per i Genitori": "bg-pink-100 text-pink-800",
};

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case "h2":
      return (
        <h2 key={i} className="font-display text-2xl font-bold text-foreground mt-10 mb-4 leading-snug">
          {block.content}
        </h2>
      );
    case "h3":
      return (
        <h3 key={i} className="font-display text-lg font-semibold text-foreground mt-6 mb-3">
          {block.content}
        </h3>
      );
    case "p":
      return (
        <p key={i} className="text-foreground/90 leading-relaxed mb-4">
          {block.content}
        </p>
      );
    case "ul":
      return (
        <ul key={i} className="list-none space-y-2 mb-5">
          {block.items?.map((item, j) => (
            <li key={j} className="flex gap-2 text-foreground/90 leading-relaxed">
              <span className="text-accent font-bold mt-0.5 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={i} className="list-none space-y-2 mb-5 counter-reset-item">
          {block.items?.map((item, j) => (
            <li key={j} className="flex gap-3 text-foreground/90 leading-relaxed">
              <span className="text-accent font-bold shrink-0 w-6 text-right">{j + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );
    case "callout":
      return (
        <div key={i} className="my-6 flex gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
          {block.emoji && <span className="text-xl shrink-0">{block.emoji}</span>}
          <p className="text-sm text-foreground/90 leading-relaxed">{block.content}</p>
        </div>
      );
    case "highlight":
      return (
        <div key={i} className="my-8 p-5 rounded-xl bg-accent/10 border border-accent/20">
          <p className="text-foreground font-medium leading-relaxed">{block.content}</p>
          <Button asChild size="sm" className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link to="/contatti">
              Richiedi informazioni <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      );
    default:
      return null;
  }
}

export default function BlogArticolo() {
  const { slug } = useParams<{ slug: string }>();
  const article = getArticleBySlug(slug ?? "");

  if (!article) return <Navigate to="/blog" replace />;

  const related = getRelatedArticles(article.slug);

  const dateFormatted = new Date(article.date).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Layout>
      <Seo
        title={article.seoTitle}
        description={article.seoDescription}
        canonical={`/blog/${article.slug}`}
        image={article.image}
        ogTitle={article.seoTitle}
        ogDescription={article.seoDescription}
        keywords={`${article.category} Padova studenti, ${article.title.split(":")[0]}`}
        article={{ datePublished: article.date, section: article.category }}
      />
      <Schema data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://studentatonapoleone.com/" },
          { "@type": "ListItem", position: 2, name: "Blog", item: "https://studentatonapoleone.com/blog" },
          { "@type": "ListItem", position: 3, name: article.title, item: `https://studentatonapoleone.com/blog/${article.slug}` },
        ],
      }} />

      {/* Breadcrumb */}
      <div className="container max-w-3xl pt-6">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-foreground line-clamp-1">{article.title}</span>
        </nav>
      </div>

      {/* Article header */}
      <header className="container max-w-3xl pt-8 pb-0">
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[article.category] ?? "bg-muted text-muted-foreground"}`}>
            {article.category}
          </span>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {article.readTime} minuti di lettura
          </span>
          <span className="text-sm text-muted-foreground hidden sm:block">{dateFormatted}</span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
          {article.title}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {article.excerpt}
        </p>
      </header>

      {/* Featured image */}
      <div className="container max-w-4xl mt-8">
        <div className="rounded-2xl overflow-hidden aspect-[2/1] md:aspect-[3/1]">
          <img
            src={article.image}
            alt={article.imageAlt}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Article body */}
      <article className="container max-w-3xl py-10 md:py-14">
        {article.blocks.map((block, i) => renderBlock(block, i))}
      </article>

      {/* Bottom CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="container max-w-3xl py-12 text-center">
          <BookOpen className="h-8 w-8 mx-auto mb-3 opacity-80" />
          <h2 className="font-display text-2xl font-bold mb-3">
            Hai trovato questo articolo utile?
          </h2>
          <p className="opacity-80 mb-6 max-w-lg mx-auto">
            Se stai cercando una stanza a Padova, lo Studentato Napoleone ha camere disponibili per il prossimo anno accademico. Contattaci senza impegno.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/camere">Vedi le camere</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground border-0"
            >
              <Link to="/contatti">
                Richiedi info <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container max-w-5xl">
            <h2 className="font-display text-xl font-bold text-foreground mb-6">
              Potrebbe interessarti anche
            </h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {related.map((rel) => (
                <Link key={rel.slug} to={`/blog/${rel.slug}`} className="group">
                  <article className="rounded-xl overflow-hidden border border-border bg-card hover:shadow-md transition-shadow h-full flex flex-col">
                    <div className="h-36 overflow-hidden">
                      <img
                        src={rel.image}
                        alt={rel.imageAlt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit mb-2 ${categoryColors[rel.category] ?? "bg-muted text-muted-foreground"}`}>
                        {rel.category}
                      </span>
                      <h3 className="font-display font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-3 leading-snug flex-1">
                        {rel.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-medium text-primary mt-3">
                        Leggi <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to blog */}
      <div className="container max-w-3xl py-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Torna al blog
        </Link>
      </div>
    </Layout>
  );
}
