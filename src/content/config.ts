import { defineCollection, z } from "astro:content";

const projectsCollection = defineCollection({
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    tags: z.string().optional(),
    link: z.string().url().optional(),
    image: image().refine((img) => img.width >= 1080, {
      message: "Изображение должно быть шириной не менее 1080 пикселей",
    }),
  }),
});


export const collections = {
  projects: projectsCollection,
};