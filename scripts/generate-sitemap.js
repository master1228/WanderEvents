const fs = require('fs');
const path = require('path');

// Конфигурация сайта
const SITE_URL = process.env.SITE_URL || 'https://wanderevents.pl';
const BUILD_DIR = path.join(__dirname, '..', 'build');

// Список всех страниц сайта
const pages = [
  // Русские страницы (x-default)
  { url: '/', changefreq: 'daily', priority: '1.0' },
  { url: '/merch', changefreq: 'weekly', priority: '0.9' },
  { url: '/welcome', changefreq: 'weekly', priority: '0.8' },
  { url: '/faq/brand', changefreq: 'monthly', priority: '0.6' },
  
  // Английские страницы
  { url: '/en/', changefreq: 'daily', priority: '1.0' },
  { url: '/en/merch', changefreq: 'weekly', priority: '0.9' },
  { url: '/en/welcome', changefreq: 'weekly', priority: '0.8' },
  { url: '/en/faq/brand', changefreq: 'monthly', priority: '0.6' },
  
  // Польские страницы  
  { url: '/pl/', changefreq: 'daily', priority: '1.0' },
  { url: '/pl/merch', changefreq: 'weekly', priority: '0.9' },
  { url: '/pl/welcome', changefreq: 'weekly', priority: '0.8' },
  { url: '/pl/faq/brand', changefreq: 'monthly', priority: '0.6' }
];

// Функция генерации XML
function generateSitemapXML() {
  const currentDate = new Date().toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  pages.forEach(page => {
    const fullUrl = `${SITE_URL}${page.url}`.replace(/\/+$/, '') || SITE_URL;
    xml += `
  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  return xml;
}

// Создаём директорию build если её нет
if (!fs.existsSync(BUILD_DIR)) {
  fs.mkdirSync(BUILD_DIR, { recursive: true });
}

// Генерируем и сохраняем sitemap
const sitemapXML = generateSitemapXML();
const sitemapPath = path.join(BUILD_DIR, 'sitemap.xml');

fs.writeFileSync(sitemapPath, sitemapXML, 'utf8');

// Также копируем в public для разработки
const publicSitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(publicSitemapPath, sitemapXML, 'utf8');

console.log('✅ Sitemap generated successfully!');
console.log(`📍 Build sitemap: ${sitemapPath}`);
console.log(`📍 Public sitemap: ${publicSitemapPath}`);
console.log(`🔗 URLs included: ${pages.length}`);
console.log(`🌐 Site URL: ${SITE_URL}`);
