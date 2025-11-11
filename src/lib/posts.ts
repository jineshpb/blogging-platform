import { promises as fs } from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { z } from "zod"

const POSTS_DIRECTORY = path.join(process.cwd(), "content", "posts")

const PostFrontMatterSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    description: z.string().trim().min(1).optional(),
    date: z.coerce.date().optional(),
    tags: z.array(z.string().trim().min(1)).optional(),
  })
  .strict()

export type PostFrontMatter = z.infer<typeof PostFrontMatterSchema>

export type PostSummary = {
  slug: string
  title: string
  description: string
  publishedAt: string
  tags: string[]
}

export type Post = PostSummary & {
  content: string
}

const readDirectorySafely = async () => {
  try {
    const entries = await fs.readdir(POSTS_DIRECTORY)
    return entries.filter((entry) => entry.endsWith(".md"))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await fs.mkdir(POSTS_DIRECTORY, { recursive: true })
      return []
    }

    throw error
  }
}

const deriveSlugFromFilename = (filename: string) => filename.replace(/\.md$/, "")

const toIsoString = (date: Date | undefined, fallback: Date) =>
  (date ?? fallback).toISOString()

const sanitiseTags = (tags: string[] | undefined) =>
  Array.from(new Set((tags ?? []).map((tag) => tag.toLowerCase())))

const buildSummary = ({
  slug,
  frontMatter,
  content,
  fallbackDate,
}: {
  slug: string
  frontMatter: PostFrontMatter
  content: string
  fallbackDate: Date
}): PostSummary & { content: string } => {
  const title = frontMatter.title ?? slug.replace(/-/g, " ")
  const description =
    frontMatter.description ?? `Read about ${title.toLowerCase()} in this blog post.`

  return {
    slug,
    title,
    description,
    publishedAt: toIsoString(frontMatter.date, fallbackDate),
    tags: sanitiseTags(frontMatter.tags),
    content,
  }
}

const readPostFile = async (slug: string) => {
  const filename = `${slug}.md`
  const filePath = path.join(POSTS_DIRECTORY, filename)
  const file = await fs.readFile(filePath, "utf-8")
  const stat = await fs.stat(filePath)
  const fallbackDate = stat.birthtime ?? stat.mtime

  const { data, content } = matter(file)
  const parsedFrontMatter = PostFrontMatterSchema.safeParse(data)

  if (!parsedFrontMatter.success) {
    const error = parsedFrontMatter.error.flatten()
    throw new Error(
      `Invalid front matter in ${filename}: ${JSON.stringify(error.fieldErrors)}`,
    )
  }

  return buildSummary({
    slug,
    frontMatter: parsedFrontMatter.data,
    content,
    fallbackDate,
  })
}

export const getPostSummaries = async (): Promise<PostSummary[]> => {
  const filenames = await readDirectorySafely()
  if (filenames.length === 0) {
    return []
  }

  const slugs = filenames.map(deriveSlugFromFilename)

  const posts = await Promise.all(slugs.map(readPostFile))

  return posts
    .sort((postA, postB) => (postA.publishedAt < postB.publishedAt ? 1 : -1))
    .map((post) => {
      const { content, ...summary } = post
      void content
      return summary
    })
}

export const getPostBySlug = async (slug: string): Promise<Post> => {
  if (!slug) {
    throw new Error("A slug is required to load a post.")
  }

  const post = await readPostFile(slug)
  return post
}
