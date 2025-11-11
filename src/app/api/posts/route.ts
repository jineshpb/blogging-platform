import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { promises as fs } from "node:fs"
import path from "node:path"
import { z } from "zod"

const POSTS_DIRECTORY = path.join(process.cwd(), "content", "posts")

const PostPayloadSchema = z
  .object({
    slug: z.string().trim().min(1, "Slug is required"),
    content: z.string().trim().min(1, "Markdown content is required"),
    overwrite: z.boolean().optional(),
  })
  .strict()

const normaliseSlug = (value: string) => {
  const normalised = value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

  return normalised
}

const ensureDirectory = async () => {
  try {
    await fs.access(POSTS_DIRECTORY)
  } catch {
    await fs.mkdir(POSTS_DIRECTORY, { recursive: true })
  }
}

const writePost = async ({
  slug,
  content,
  overwrite,
}: {
  slug: string
  content: string
  overwrite?: boolean
}) => {
  await ensureDirectory()

  const filePath = path.join(POSTS_DIRECTORY, `${slug}.md`)

  try {
    if (!overwrite) {
      await fs.access(filePath)
      throw new Error("exists")
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error
    }
  }

  await fs.writeFile(filePath, content, "utf-8")

  return filePath
}

export const POST = async (request: Request) => {
  let rawBody: unknown

  try {
    rawBody = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    )
  }

  const parsedPayload = PostPayloadSchema.safeParse(rawBody)

  if (!parsedPayload.success) {
    return NextResponse.json(
      { error: parsedPayload.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  const { slug, content, overwrite } = parsedPayload.data
  const normalisedSlug = normaliseSlug(slug)

  if (!normalisedSlug) {
    return NextResponse.json(
      { error: "Provided slug results in an empty filename after sanitisation." },
      { status: 400 },
    )
  }

  try {
    const filePath = await writePost({
      slug: normalisedSlug,
      content,
      overwrite,
    })

    await Promise.all([
      revalidatePath("/"),
      revalidatePath(`/posts/${normalisedSlug}`),
    ])

    return NextResponse.json(
      {
        message: "Post saved successfully.",
        slug: normalisedSlug,
        location: `/posts/${normalisedSlug}`,
        filePath,
      },
      { status: overwrite ? 200 : 201 },
    )
  } catch (error) {
    if ((error as Error).message === "exists") {
      return NextResponse.json(
        {
          error:
            "A post with this slug already exists. Pass `overwrite: true` to replace it.",
        },
        { status: 409 },
      )
    }

    return NextResponse.json(
      { error: "Unable to save the post.", details: String(error) },
      { status: 500 },
    )
  }
}
