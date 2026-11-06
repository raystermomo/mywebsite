// Shared by the builder and local server so every page has a working preview URL.
export const pages = [
  { id: 'home', slug: 'index' },
  { id: 'research', slug: 'research' },
  { id: 'projects', slug: 'projects' },
  { id: 'awards', slug: 'background' },
  { id: 'skills', slug: 'skills' },
];

export function pageFile(page, lang) {
  if (page.id === 'home') return lang === 'ja' ? 'ja.html' : 'index.html';
  return `${page.slug}${lang === 'ja' ? '-ja' : ''}.html`;
}
