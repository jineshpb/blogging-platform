import Link from "next/link"

import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { getPostSummaries } from "@/lib/posts"

export const revalidate = 60

const HomePage = async () => {
  const posts = await getPostSummaries()

  return (
    <div className="flex flex-col gap-16">
      <section className="flex flex-col gap-4 rounded-3xl border border-border/80 bg-card/70 p-8 shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Blog</p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Pen & Pixels is a markdown-first blog for thoughtful engineering notes.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
          Drop a markdown file into the posts folder or publish straight from your tooling via the REST API.
          Every entry is rendered with Tailwind CSS and shadcn/ui components for a cohesive reading experience.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="#writing" aria-label="Jump to the latest writing">
              Explore Posts
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/api/posts" aria-label="View the posts API endpoint">
              API Reference
            </Link>
          </Button>
        </div>
      </section>

      <section id="writing" aria-label="Latest blog posts" className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Latest writing
          </h2>
          <p className="text-muted-foreground">
            Fresh posts are sourced directly from markdown files living in <code className="rounded bg-muted px-2 py-1 font-mono text-sm">content/posts</code>.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 bg-muted/40 p-10 text-center text-muted-foreground">
            <p>No posts yet. Publish one by sending a POST request to <code className="rounded bg-background px-2 py-1 font-mono text-sm">/api/posts</code> with a markdown payload.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default HomePage
