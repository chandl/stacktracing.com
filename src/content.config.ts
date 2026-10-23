import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const schema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  description: z.string().optional(),
  image: z.string().optional(),
  wpPath: z.string(),
});

export const collections = {
  posts: defineCollection({ loader: glob({ pattern: '*.md', base: 'src/content/posts' }), schema }),
  pages: defineCollection({ loader: glob({ pattern: '*.md', base: 'src/content/pages' }), schema }),
};
