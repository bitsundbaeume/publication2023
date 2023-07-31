import { z, defineCollection } from "astro:content";

const publication2023Collection = defineCollection({
  type: "content",
  schema: z.object({
    isDraft: z.boolean().optional(),
    title: z.string().min(1),
    authors: z.array(z.string()).optional(),
    tag: z.string().optional(),
    chapter: z.number(),
    order: z.number(),
    headerImage: z
      .object({
        src: z.string(),
        alt: z.string().optional(),
        caption: z.string().optional(),
      })
      .optional(),
    seo: z
      .object({
        title: z.string().optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().max(155).optional(),
        image: z.string().url().optional(),
      })
      .optional(),
  }),
});

export const collections = {
  publication2023: publication2023Collection,
};
