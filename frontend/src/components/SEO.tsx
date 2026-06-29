import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  schema?: any;
}

const SEO = ({ 
  title = "Toolkit by SatByte – Student Productivity & Utility Platform",
  description = "Discover productivity, academic, AI-powered, career, PDF, and utility tools built for students, developers, and creators. Free rank predictors, resume builders, and more.",
  keywords = "student tools, PDF tools, image tools, academic calculators, rank predictors, resume builders, productivity tools, API tools, developer utilities",
  ogImage = "https://os.satbyte.in/og-image.png",
  ogType = "website",
  canonicalUrl = "https://os.satbyte.in",
  schema
} : SEOProps) => {
  const fullTitle = title.includes('SatByte') ? title : `${title} | SatByte Toolkit`;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="SatByte Toolkit" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}

      {/* Default Website Schema */}
      {!schema && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "SatByte Toolkit",
            "url": "https://os.satbyte.in",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://os.satbyte.in/tools?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
