import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import siteConfig from '../data/site-config.ts';
import { sortItemsByDateDesc } from '../utils/data-utils.ts';
import { getFirstParagraphFromMarkdown } from '../utils/markdown';

export async function GET(context) {
  const posts = (await getCollection('blog')).sort(sortItemsByDateDesc);
  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site,
    items: posts.map((item) => ({
      title: item.data.title,
      description: getFirstParagraphFromMarkdown(item.body) || item.data.seo?.description || '',
      link: `/blog/${item.slug}/`,
      pubDate: item.data.publishDate.setUTCHours(0)
    }))
  });
}
