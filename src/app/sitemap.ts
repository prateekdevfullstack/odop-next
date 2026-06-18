import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Replace this with your actual production domain when you deploy
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://odop.up.gov.in';

  // These are the main static routes found in your Navbar
  const staticRoutes = [
    '', // Homepage
    '/about',
    '/about/odop-cell',
    '/about/government-orders',
    '/districts',
    '/contact-us',
    '/media/gallery',
    '/media/video-gallery',
    '/media/press-release',
    '/resources/cfc-list',
    '/resources/cfc-list/gallery',
    '/knowledge-base/project-report',
    '/knowledge-base/success-story',
  ];

  // We loop through all static routes and automatically generate 
  // both the URL and the hreflang alternates for English and Hindi.
  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
    // This 'alternates' block automatically handles the perfect SEO setup
    // It tells Google exactly where the Hindi version of the page lives
    alternates: {
      languages: {
        en: `${baseUrl}${route}`,
        hi: `${baseUrl}/hi${route}`,
      },
    },
  }));

  // Note: If you want to add dynamic pages (like your /[district] pages), 
  // you would fetch them from the database here and map them into sitemapEntries just like above.

  return sitemapEntries;
}
