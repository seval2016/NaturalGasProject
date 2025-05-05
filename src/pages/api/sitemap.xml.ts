import { GetServerSideProps } from 'next';

const Sitemap = () => {};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = 'https://www.senturksihhitesisat.com';
  
  const staticPages = [
    '',
    '/hizmetler',
    '/hizmetler/dogalgaz-tesisati',
    '/hizmetler/su-tesisati',
    '/hizmetler/kalorifer-tesisati',
    '/hizmetler/yerden-isitma',
    '/hizmetler/banyo-tadilat',
    '/hakkimizda',
    '/iletisim',
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages
        .map(
          (page) => `
            <url>
              <loc>${baseUrl}${page}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>weekly</changefreq>
              <priority>${page === '' ? '1.0' : '0.8'}</priority>
            </url>
          `
        )
        .join('')}
    </urlset>
  `;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap; 