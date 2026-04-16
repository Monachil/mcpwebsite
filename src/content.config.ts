import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const research = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    description: z.string(),
    pdf: z.string().optional(),
    thumbnail: z.string().optional(),
  }),
});

const legal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
  }),
});

const careers = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!README.md', '!**/_*.md'], base: './src/content/careers' }),
  schema: z.object({
    title: z.string(),
    tag: z.string(),
    summary: z.string(),
    location: z.string().default('Greenwich, CT'),
    employmentType: z.string().default('Full-time'),
    postedDate: z.coerce.date(),
    draft: z.boolean().default(false),
    order: z.number().optional(),
  }),
});

export const collections = { research, legal, careers };
