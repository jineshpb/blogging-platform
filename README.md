# Pen & Pixels

A markdown-first blog built with Next.js, Tailwind CSS, and shadcn/ui. Markdown files dropped into `content/posts` (or uploaded through the API) are rendered as full blog entries with syntax highlighting and GFM support.

## Stack
- Next.js App Router (TypeScript)
- Tailwind CSS v4 + shadcn/ui
- `gray-matter`, `react-markdown`, `remark-gfm`, `rehype-highlight`

## Getting Started

```bash
npm install
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) to browse the blog. The content is statically generated and revalidated every 60 seconds.

## Authoring Content

1. Add a new markdown file to `content/posts`. Use optional front matter to set `title`, `description`, `date`, and `tags`.
2. The home page lists all posts by newest publish date. Each post is rendered under `/posts/<slug>`.

Example front matter:

```md
---
title: "My First Post"
description: "Kicking off the blog with a quick hello."
date: "2025-11-11"
tags:
  - nextjs
  - tailwind
---

Write your content here...
```

## Publishing via API

You can create or overwrite posts programmatically with a JSON payload:

`POST /api/posts`

```json
{
  "slug": "my-first-post",
  "content": "---\ntitle: ...\n---\nMarkdown body here",
  "overwrite": false
}
```

- `slug`: Required. Sanitised to a filesystem-safe filename.
- `content`: Required markdown body (include front matter if desired).
- `overwrite`: Optional flag to replace an existing post.

### Example cURL Request

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "api-created-post",
    "content": "---\\ntitle: API Created Post\\ndate: 2025-11-11\\ntags: [api, nextjs]\\n---\\nContent from the API."
  }'
```

The endpoint responds with the new slug and the path to the saved markdown file. A `409` status is returned when a slug already exists unless `overwrite` is `true`.

## Scripts
- `npm run dev` – start the development server.
- `npm run build` – create an optimized production build.
- `npm run start` – serve the production build.
- `npm run lint` – run ESLint.
