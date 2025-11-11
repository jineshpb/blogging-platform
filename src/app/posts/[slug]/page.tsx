import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { MarkdownContent } from "@/components/markdown-content"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/format"
import { getPostBySlug, getPostSummaries } from "@/lib/posts"

type PostPageProps = {
  params: { slug: string }
}

export const revalidate = 60

export const generateStaticParams = async () => {
  const posts = await getPostSummaries()

  if (posts.length === 0) {
    return []
  }

  return posts.map((post) => ({ slug: post.slug }))
}

export const generateMetadata = async ({
  params,
}: PostPageProps): Promise<Metadata> => {
  const slug = decodeURIComponent(params.slug)

  try {
    const post = await getPostBySlug(slug)

    return {
      title: `${post.title} — Pen & Pixels`,
      description: post.description,
    }
  } catch {
    return {
      title: "Post not found — Pen & Pixels",
    }
  }
}

const PostPage = async ({ params }: PostPageProps) => {
  const slug = decodeURIComponent(params.slug)

  if (!slug) {
    return notFound()
  }

  let post
  try {
    post = await getPostBySlug(slug)
  } catch {
    return notFound()
  }

  const publishedLabel = formatDate(post.publishedAt)

  return (
    <article className="flex flex-col gap-12">
      <header className="rounded-3xl border border-border/70 bg-card/70 p-8 shadow-sm sm:p-12">
        <div className="flex flex-col gap-4">
          <Badge variant="outline" className="w-fit border-dashed uppercase">
            {publishedLabel}
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {post.title}
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">{post.description}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.length === 0 ? (
            <Badge variant="secondary" className="uppercase tracking-wide">
              Untagged
            </Badge>
          ) : (
            post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="uppercase tracking-wide">
                {tag}
              </Badge>
            ))
          )}
        </div>
      </header>

      <MarkdownContent content={post.content} />
    </article>
  )
}

export default PostPage
