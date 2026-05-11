import { Helmet } from "react-helmet-async";

const SITE_NAME = "Studentato Napoleone Padova";
const SITE_URL = "https://studentatonapoleone.com";
const DEFAULT_IMAGE = "https://studentatonapoleone.com/logo-napoleone.png";
const TWITTER_HANDLE = "@studentatonapoleone";
const ROBOTS_DEFAULT = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

/** Geo coordinates of Padova city center */
const GEO = { region: "IT-PD", placename: "Padova, Italia", icbm: "45.4064, 11.8768" };

interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  noindex?: boolean;
  /** Extra comma-separated keywords for <meta name="keywords"> */
  keywords?: string;
  /** Override OG title (without site suffix) — ideal for articles to avoid truncation in social previews */
  ogTitle?: string;
  /** Override OG description */
  ogDescription?: string;
  article?: {
    datePublished: string;
    dateModified?: string;
    author?: string;
    section?: string;
  };
}

const BASE_KEYWORDS =
  "studentato Padova, alloggio studenti Padova, camere studenti Padova, affitto stanza Padova, posto letto Padova università, affitto camera singola Padova, stanze in affitto Padova studenti, casa studenti Padova";

export function Seo({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  noindex = false,
  keywords,
  ogTitle,
  ogDescription,
  article,
}: SeoProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const socialTitle = ogTitle ?? fullTitle;
  const socialDescription = ogDescription ?? description;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : undefined;
  const allKeywords = keywords ? `${BASE_KEYWORDS}, ${keywords}` : BASE_KEYWORDS;

  const articleSchema = article && canonicalUrl
    ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description,
        image,
        url: canonicalUrl,
        datePublished: article.datePublished,
        dateModified: article.dateModified ?? article.datePublished,
        author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
          logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-napoleone.png` },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
        ...(article.section && { articleSection: article.section }),
        inLanguage: "it-IT",
        isPartOf: { "@type": "Blog", "@id": `${SITE_URL}/blog`, name: `Blog ${SITE_NAME}` },
      })
    : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <meta name="language" content="Italian" />
      <meta name="author" content={SITE_NAME} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta name="robots" content={noindex ? "noindex,nofollow" : ROBOTS_DEFAULT} />

      {/* Local GEO signals — Padova */}
      <meta name="geo.region" content={GEO.region} />
      <meta name="geo.placename" content={GEO.placename} />
      <meta name="ICBM" content={GEO.icbm} />

      {/* Open Graph */}
      <meta property="og:title" content={socialTitle} />
      <meta property="og:description" content={socialDescription} />
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={`${title} — ${SITE_NAME}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="it_IT" />
      {article && <meta property="article:published_time" content={article.datePublished} />}
      {article?.dateModified && <meta property="article:modified_time" content={article.dateModified} />}
      {article?.section && <meta property="article:section" content={article.section} />}
      {article && <meta property="article:author" content={SITE_NAME} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={socialTitle} />
      <meta name="twitter:description" content={socialDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={`${title} — ${SITE_NAME}`} />

      {articleSchema && (
        <script type="application/ld+json">{articleSchema}</script>
      )}
    </Helmet>
  );
}
