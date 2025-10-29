import { defineCollection, z } from 'astro:content';

const seoSchema = z.object({
  title: z.string().min(5).max(120).optional(),
  description: z.string().min(15).max(160).optional(),
  image: z
    .object({
      src: z.string(),
      alt: z.string().optional()
    })
    .optional(),
  pageType: z.enum(['website', 'article']).default('website')
});

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    publishDate: z.string().transform((s, ctx) => {
      // Support DD-MM-YYYY and ISO
      const ddmmyyyy = /^(\d{2})-(\d{2})-(\d{4})$/;
      const m = s.match(ddmmyyyy);
      let d: Date | null = null;
      if (m) {
        const [_, dd, mm, yyyy] = m;
        const iso = `${yyyy}-${mm}-${dd}`;
        d = new Date(iso);
      } else {
        d = new Date(s);
      }
      if (isNaN(d.getTime())) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid date format' });
        return z.NEVER;
      }
      return d;
    }),
    updatedDate: z
      .union([z.string(), z.date()])
      .optional()
      .transform((val) => {
        if (!val) return undefined;
        if (val instanceof Date) return val;
        const ddmmyyyy = /^(\d{2})-(\d{2})-(\d{4})$/;
        const m = val.match(ddmmyyyy);
        if (m) {
          const [_, dd, mm, yyyy] = m;
          return new Date(`${yyyy}-${mm}-${dd}`);
        }
        const d = new Date(val);
        return isNaN(d.getTime()) ? undefined : d;
      }),
    isFeatured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    seo: seoSchema.optional()
  })
});

const pages = defineCollection({
  schema: z.object({
    title: z.string(),
    seo: seoSchema.optional()
  })
});

const projects = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      tags: z.array(z.string()).default([]),
      link: z.string().optional(),
      isFeatured: z.boolean().default(false),
      seo: seoSchema.optional(),
      cover: image()
    })
});

const components = defineCollection({
  schema: z.object({
    id: z.string(),
    texts: z.record(z.string())
  })
});

export const collections = { blog, pages, projects, components };
