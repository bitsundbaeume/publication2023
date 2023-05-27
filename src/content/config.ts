
import { z, defineCollection } from 'astro:content';

const publication2023Collection = defineCollection({
  type: 'content',
  schema: z.object({
    isDraft: z.boolean(),
    title: z.string().min(1),
    seo: z.object({
      title: z.string().min(1).optional(),
      metaTitle: z.string().min(1).optional(),
      metaDescription: z.string().min(70).max(155).optional(),
      image: z.string().url().optional(),
    }).optional(),
  }),
});

export const collections = {
  'publication2023': publication2023Collection,
};
