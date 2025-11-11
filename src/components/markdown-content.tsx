import ReactMarkdown from "react-markdown"
import type { Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"

import { cn } from "@/lib/utils"

type MarkdownContentProps = {
  content: string
}

const markdownComponents: Components = {
  h1: ({ className, ...props }) => (
    <h1
      className={cn(
        "text-4xl font-semibold tracking-tight text-foreground sm:text-5xl",
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        "mt-12 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        "mt-10 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl",
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn(
        "leading-8 text-muted-foreground [&:not(:first-child)]:mt-6",
        className,
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul
      className={cn(
        "mt-6 list-disc space-y-3 pl-6 text-muted-foreground marker:text-primary",
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn(
        "mt-6 list-decimal space-y-3 pl-6 text-muted-foreground marker:text-primary",
        className,
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("leading-7 text-muted-foreground", className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "mt-8 border-l-4 border-primary/60 pl-6 italic text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }) => (
    <a
      className={cn(
        "font-semibold text-primary underline-offset-4 transition hover:text-primary/80 hover:underline",
        className,
      )}
      {...props}
    />
  ),
  code: ({ className, children, ...props }) => {
    const isInline = typeof className !== "string"
    if (isInline) {
      return (
        <code
          className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-sm text-primary"
          {...props}
        >
          {children}
        </code>
      )
    }

    return (
      <code
        className={cn(
          "hljs block w-full rounded-xl border border-border/60 bg-muted/70 p-4 font-mono text-sm leading-relaxed",
          className,
        )}
        {...props}
      >
        {children}
      </code>
    )
  },
  pre: ({ className, children, ...props }) => (
    <pre
      className={cn(
        "group overflow-x-auto rounded-xl border border-border/60 bg-muted/40",
        className,
      )}
      {...props}
    >
      {children}
    </pre>
  ),
  hr: ({ className, ...props }) => (
    <hr
      className={cn(
        "my-12 border-t border-dashed border-border/70",
        className,
      )}
      {...props}
    />
  ),
}

export const MarkdownContent = ({ content }: MarkdownContentProps) => {
  if (!content.trim()) {
    return null
  }

  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
