import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { Schema } from "@/components/Schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { articles } from "@/data/blog";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const CATEGORIES = ["Tutti", "Guida Pratica", "Budget & Risparmio", "Vita a Padova", "Vita Universitaria", "Per i Genitori"];

const categoryColors: Record<string, string> = {
  "Guida Pratica": "bg-blue-100 text-blue-800",
  "Budget & Risparmio": "bg-green-100 text-green-800",
  "Vita a Padova": "bg-orange-100 text-orange-800",
  "Vita Universitaria": "bg-purple-100 text-purple-800",
  "Per i Genitori": "bg-pink-100 text-pink-800",
};

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("Tutti");

  const filtered = activeCategory === "Tutti"
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  const [featured, ...rest] = filtered;

  return (
    <Layout>
      <Seo
        title="Guide Studenti Padova — Alloggi, Budget e Vita Universitaria 2026"
        description="Guide pratiche per studenti universitari a Padova: come trovare stanza, quanto costa vivere, i migliori quartieri, studentato vs appartamento. Tutto aggiornato al 2026-27."
        canonical="/blog"
        keywords="guida studenti Padova, trovare casa Padova studenti, vivere a Padova università, blog studentato Padova, consigli affitto studenti Padova"
      />
      <Schema data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://studentatonapoleone.com/" },
          { "@type": "ListItem", position: 2, name: "Blog", item: "https://studentatonapoleone.com/blog" },
        ],
      }} />
      <Schema data={{
        "@context": "https://schema.org",
        "@type": "Blog",
        "@id": "https://studentatonapoleone.com/blog",
        name: "Guide per Studenti a Padova",
        description: "Guide pratiche per studenti universitari a Padova: trovare stanza, costi, quartieri e vita universitaria.",
        url: "https://studentatonapoleone.com/blog",
        publisher: {
          "@type": "Organization",
          name: "Studentato Napoleone Padova",
          url: "https://studentatonapoleone.com",
          logo: { "@type": "ImageObject", url: "https://studentatonapoleone.com/logo-napoleone.png" },
        },
        blogPost: articles.map((a) => ({
          "@type": "BlogPosting",
          headline: a.seoTitle,
          description: a.seoDescription,
          url: `https://studentatonapoleone.com/blog/${a.slug}`,
          datePublished: a.date,
          image: a.image,
        })),
      }} />

      {/* Hero */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4 gap-1.5">
            <BookOpen className="h-3 w-3" />
            Guide & Risorse
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Guide per Studenti a Padova
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trovare stanza a Padova, capire i costi, scegliere il quartiere giusto: guide pratiche scritte per chi studia all'Università di Padova.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <section className="sticky top-16 md:top-20 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="container overflow-x-auto">
          <div className="flex items-center gap-2 py-3 min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="container max-w-6xl">

          {/* Featured article */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-12"
            >
              <Link to={`/blog/${featured.slug}`} className="group block">
                <div className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-56 md:h-full min-h-[240px] overflow-hidden">
                    <img
                      src={featured.image}
                      alt={featured.imageAlt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground border-0">
                      In evidenza
                    </Badge>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center bg-card">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[featured.category] ?? "bg-muted text-muted-foreground"}`}>
                        {featured.category}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {featured.readTime} min
                      </span>
                    </div>
                    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-snug">
                      {featured.title}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {featured.excerpt}
                    </p>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
                      Leggi la guida <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Article grid */}
          {rest.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((article, i) => (
                <motion.div
                  key={article.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <Link to={`/blog/${article.slug}`} className="group block h-full">
                    <article className="h-full flex flex-col rounded-xl overflow-hidden border border-border bg-card hover:shadow-md transition-shadow">
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={article.image}
                          alt={article.imageAlt}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[article.category] ?? "bg-muted text-muted-foreground"}`}>
                            {article.category}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {article.readTime} min
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-3">
                          {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center gap-1 text-sm font-medium text-primary mt-4">
                          Leggi <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              Nessun articolo in questa categoria.
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-primary/5 border-t border-border">
        <div className="container max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">
            Cerchi una stanza a Padova?
          </h2>
          <p className="text-muted-foreground mb-6">
            Lo Studentato Napoleone ha camere singole e doppie disponibili per il prossimo anno accademico. Contattaci senza impegno — rispondiamo entro 24 ore.
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link to="/camere">
              Vedi le camere disponibili <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
