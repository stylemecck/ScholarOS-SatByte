import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://os.satbyte.in';

const pages = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/tools', priority: '0.9', changefreq: 'weekly' },
  { path: '/pricing', priority: '0.8', changefreq: 'monthly' },
  { path: '/docs', priority: '0.8', changefreq: 'weekly' },
  { path: '/tutorials', priority: '0.8', changefreq: 'weekly' },
  { path: '/developer', priority: '0.8', changefreq: 'weekly' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/support', priority: '0.7', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
  { path: '/cookies', priority: '0.3', changefreq: 'yearly' },
  { path: '/security', priority: '0.3', changefreq: 'yearly' },
  { path: '/feedback', priority: '0.5', changefreq: 'monthly' },
  { path: '/status', priority: '0.5', changefreq: 'monthly' },
  { path: '/design', priority: '0.5', changefreq: 'monthly' },
  // AI Premium Tools
  { path: '/tools/ai-study-assistant', priority: '0.9', changefreq: 'weekly' },
  { path: '/tools/ai-interview-prep', priority: '0.9', changefreq: 'weekly' },
  { path: '/tools/career-roadmaps', priority: '0.9', changefreq: 'weekly' },
  { path: '/tools/ai-pdf-workspace', priority: '0.9', changefreq: 'weekly' },
];

const generateSitemap = () => {
  const lastmod = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static Pages
  pages.forEach(page => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${page.path}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Dynamic Tool Pages from toolsConfig.ts
  try {
    const configPath = path.join(process.cwd(), 'src', 'utils', 'toolsConfig.ts');
    const content = fs.readFileSync(configPath, 'utf8');
    const regex = /path:\s*['"]([^'"]+)['"]/g;
    let match;
    const toolPaths = new Set();
    while ((match = regex.exec(content)) !== null) {
      toolPaths.add(match[1]);
    }
    toolPaths.forEach(toolPath => {
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}${toolPath}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });
  } catch (err) {
    console.error('⚠️ Failed to dynamically extract tools from toolsConfig.ts:', err.message);
  }

  xml += `</urlset>`;

  const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(outputPath, xml);
  console.log(`✅ Sitemap generated at ${outputPath}`);
};

generateSitemap();
