import { defineCollection } from 'astro:content';
import { z } from 'astro/zod'
import { glob } from 'astro/loaders';

// Schema correspondant aux champs Sveltia CMS definis dans
// public/admin/config.yml (collections "authors" et "posts").
// Les champs optionnels ont des valeurs par defaut pour que les
// entrees creees via le CMS passent la validation Zod.

const authors = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/authors' }),
	schema: z.object({
		name: z.string(),
		bio: z.string().optional(),
	}),
});

const posts = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
	schema: z.object({
		// string
		title: z.string(),
		// text
		description: z.string().max(300).optional(),
		// datetime (type: date -> stocke "YYYY-MM-DD")
		publish_date: z.coerce.date(),
		// boolean
		draft: z.boolean().default(false),
		// select
		category: z.enum(['tech', 'design', 'culture']).default('tech'),
		// list (sous-champ unique)
		tags: z.array(z.string()).default([]),
		// color
		accent_color: z.string().optional(),
		// number (value_type: int)
		rating: z.number().int().min(0).max(10).optional(),
		// image
		cover: z.string().optional(),
		// file
		attachment: z.string().optional(),
		// map (GeoJSON)
		location: z.string().optional(),
		// relation (value_field: name de la collection authors)
		author: z.string().optional(),
		// relation (value_field: {{slug}} de la collection posts elle-meme)
		related_posts: z.array(z.string()).default([]),
		// list (sous-champs multiples)
		links: z
			.array(z.object({ label: z.string(), url: z.string().url() }))
			.default([]),
		// object
		metadata: z
			.object({
				language: z.string().default('en'),
				featured: z.boolean().default(false),
			})
			.default({ language: 'en', featured: false }),
		// keyvalue
		stats: z.record(z.string(), z.string()).default({}),
		// code
		snippet: z.object({ code: z.string(), lang: z.string() }).optional(),
		// compute
		rating_summary: z.string().optional(),
		// uuid
		uuid: z.string().optional(),
		// hidden
		layout: z.string().default('post'),
		// richtext : le champ "body" est ecrit sous le front matter,
		// Astro l'expose via entry.body (pas dans le schema).
	}),
});

export const collections = { authors, posts };
