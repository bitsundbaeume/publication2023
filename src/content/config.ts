
import { z, defineCollection } from 'astro:content';

const publication2023Collection = defineCollection({
  type: 'content',
  schema: z.object({
    isDraft: z.boolean(),
    title: z.string().min(1),
    order: z.number(),
    seo: z.object({
      title: z.string().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().max(155).optional(),
      image: z.string().url().optional(),
    }).optional(),
  }),
});

export const collections = {
  'publication2023': publication2023Collection,
};
