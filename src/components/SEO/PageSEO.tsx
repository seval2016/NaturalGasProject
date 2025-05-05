import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';

interface PageSEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  noindex?: boolean;
  structuredData?: any;
}

const PageSEO = ({
  title,
  description,
  canonical,
  image,
  noindex = false,
  structuredData,
}: PageSEOProps) => {
  const router = useRouter();
  const url = canonical || `https://www.senturksihhitesisat.com${router.asPath}`;

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={url}
        noindex={noindex}
        openGraph={{
          url,
          title,
          description,
          images: image
            ? [
                {
                  url: image,
                  width: 1200,
                  height: 630,
                  alt: title,
                },
              ]
            : undefined,
        }}
      />
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </>
  );
};

export default PageSEO; 