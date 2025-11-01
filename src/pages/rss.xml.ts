import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getBlogPosts } from '../page-templates/blog-pagination';
import { getSiteLocaleConfig } from '../data/site-config';
import { getFirstParagraphFromMarkdown } from '../utils/markdown';
import { type Locale } from '../utils/i18n';
import { getRelativeLocaleUrl } from 'astro:i18n';

const locales: Locale[] = ['ru', 'en'];

export async function GET(context: APIContext) {
  const items = [] as {
    title: string;
    description: string;
    link: string;
    pubDate: Date;
  }[];

  for (const locale of locales) {
    const posts = await getBlogPosts(locale);
    const site = getSiteLocaleConfig(locale);

    for (const post of posts) {
      const link = getRelativeLocaleUrl(locale, `/blog/${post.data.path}/`);
      items.push({
        title: post.data.title,
        description: getFirstParagraphFromMarkdown(post.body) || post.data.seo?.description || site.blog.listing.description,
        link,
        pubDate: post.data.publishDate
      });
    }
  }

  const defaultLocale = getSiteLocaleConfig('ru');

  return rss({
    title: defaultLocale.title,
    description: defaultLocale.description,
    site: context.site ?? 'https://lirik.pro',
    items
  });
}
