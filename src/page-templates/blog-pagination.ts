import type { GetStaticPathsOptions } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import siteConfig from '../data/site-config';
import { sortPostsByDateDesc } from '../utils/data-utils';
import { type Locale } from '../utils/i18n';

export async function getBlogPosts(locale: Locale) {
  const posts = await getCollection('blog', (entry) => entry.data.locale === locale);
  return posts.sort(sortPostsByDateDesc);
}

export function createBlogPagination(locale: Locale) {
  return async function getStaticPaths({ paginate }: GetStaticPathsOptions) {
    const posts = await getBlogPosts(locale);
    return paginate(posts, { pageSize: siteConfig.postsPerPage });
  };
}

export async function findBlogPost(locale: Locale, slug: string) {
  const posts = await getBlogPosts(locale);
  return posts.find((post) => post.data.path === slug);
}

export type BlogEntry = CollectionEntry<'blog'>;

export async function getBlogPostWithNeighbors(locale: Locale, slug: string) {
  const posts = await getBlogPosts(locale);
  const index = posts.findIndex((post) => post.data.path === slug);
  if (index === -1) {
    return { post: undefined, prevPost: null, nextPost: null } as const;
  }
  const post = posts[index];
  const prevPost = index + 1 < posts.length ? posts[index + 1] : null;
  const nextPost = index - 1 >= 0 ? posts[index - 1] : null;
  return { post, prevPost, nextPost } as const;
}

