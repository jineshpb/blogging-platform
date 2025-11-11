import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { formatDate } from "@/lib/format"
import type { PostSummary } from "@/lib/posts"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type PostCardProps = {
  post: PostSummary
}

export const PostCard = ({ post }: PostCardProps) => {
  const publishedLabel = formatDate(post.publishedAt)

  return (
    <article className="group rounded-2xl border border-border/70 bg-card/60 shadow-sm transition hover:border-primary/60 hover:shadow-lg">
      <Link
        href={`/posts/${post.slug}`}
        aria-label={`Read ${post.title}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Card className="h-full border-none bg-transparent p-0 shadow-none">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
                {post.title}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {post.description}
              </CardDescription>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-muted-foreground">
              <span>{publishedLabel}</span>
              <ArrowUpRight
                className="size-4 text-primary transition group-hover:translate-x-1 group-hover:-translate-y-1"
                aria-hidden="true"
              />
            </div>
          </CardHeader>

          <CardContent className="flex flex-wrap gap-2 border-t border-dashed border-border/60 pt-6">
            {post.tags.length === 0 ? (
              <Badge variant="outline" className="border-dashed uppercase">
                Untagged
              </Badge>
            ) : (
              post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="uppercase tracking-wide">
                  {tag}
                </Badge>
              ))
            )}
          </CardContent>
        </Card>
      </Link>
    </article>
  )
}
