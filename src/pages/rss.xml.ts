import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const articles = await getCollection('research');
  const sorted = articles.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'Monachil Capital Partners — Research & Insights',
    description: 'Market commentary, research papers, and thought leadership from Monachil Capital Partners.',
    site: context.site!.toString(),
    items: sorted.map(article => ({
      title: article.data.title,
      pubDate: article.data.date,
      description: article.data.description,
      link: `/research/${article.id}/`,
    })),
  });
}
