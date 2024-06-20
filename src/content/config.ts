import { defineCollection, z } from "astro:content";

const projectsCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      image: image(),
      date: z.date(),
      tag: z.array(z.string()),
      link: z.string(),
    }),
});

export const collections = {
  projects: projectsCollection
};
