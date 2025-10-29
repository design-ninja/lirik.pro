import type { GetStaticPathsOptions } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import siteConfig from '../data/site-config';
import { sortProjectsByLeadingNumberAsc } from '../utils/data-utils';
import { type Locale } from '../utils/i18n';

export type ProjectEntry = CollectionEntry<'projects'>;

export async function getProjects(locale: Locale) {
  const projects = await getCollection('projects', (entry) => entry.data.locale === locale);
  return projects.sort(sortProjectsByLeadingNumberAsc);
}

export function createProjectsPagination(locale: Locale) {
  return async function getStaticPaths({ paginate }: GetStaticPathsOptions) {
    const projects = await getProjects(locale);
    return paginate(projects, { pageSize: siteConfig.projectsPerPage });
  };
}

export async function getProjectWithNeighbors(locale: Locale, slug: string) {
  const projects = await getProjects(locale);
  const index = projects.findIndex((project) => project.data.path === slug);
  if (index === -1) {
    return { project: undefined, prevProject: null, nextProject: null } as const;
  }
  const project = projects[index];
  const prevProject = index + 1 < projects.length ? projects[index + 1] : null;
  const nextProject = index - 1 >= 0 ? projects[index - 1] : null;
  return { project, prevProject, nextProject } as const;
}

