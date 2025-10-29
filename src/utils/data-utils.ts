import { type CollectionEntry } from 'astro:content';
import { slugify } from './common-utils';
import { type Locale } from './i18n';

export function sortPostsByDateDesc(itemA: CollectionEntry<'blog'>, itemB: CollectionEntry<'blog'>) {
  return itemB.data.publishDate.getTime() - itemA.data.publishDate.getTime();
}

export function sortProjectsByLeadingNumberAsc(
  itemA: CollectionEntry<'projects'>,
  itemB: CollectionEntry<'projects'>
) {
  const extractLeadingNumber = (item: CollectionEntry<'projects'>) => {
    const match = item.slug.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
  };

  return extractLeadingNumber(itemA) - extractLeadingNumber(itemB);
}

export function getAllTags(posts: CollectionEntry<'blog'>[]) {
  const tags: string[] = [...new Set(posts.flatMap((post) => post.data.tags || []).filter(Boolean))];
  return tags
    .map((tag) => {
      return {
        name: tag,
        slug: slugify(tag)
      };
    })
    .filter((obj, pos, arr) => {
      return arr.map((mapObj) => mapObj.slug).indexOf(obj.slug) === pos;
    });
}

export function getPostsByTag(posts: CollectionEntry<'blog'>[], tagSlug: string, locale?: Locale) {
  const filteredPosts: CollectionEntry<'blog'>[] = posts.filter((post) => {
    if (locale && post.data.locale !== locale) return false;
    return (post.data.tags || []).map((tag) => slugify(tag)).includes(tagSlug);
  });
  return filteredPosts;
}
