import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().default('Raphaël Radzuweit'),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    readingTimeInMinutes: z.int(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    heroImage: z.string().optional(),
    youtubeId: z.string().optional(),
  })
});

const news = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    youtubeId: z.string().optional(),
  })
});

export const collections = {
  articles,
  news,
};
