import Link from "next/link"
import { PenSquare } from "lucide-react"

import { Button } from "@/components/ui/button"

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "#writing", label: "Writing" },
]

export const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6 sm:px-8">
        <Link
          href="/"
          aria-label="Return to the blog homepage"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <PenSquare className="size-5" aria-hidden="true" />
          <span>Pen & Pixels</span>
        </Link>

        <div className="flex items-center gap-6">
          <nav aria-label="Primary navigation" className="hidden items-center gap-4 md:flex">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-label={link.label}
                className="text-sm font-medium text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Button asChild variant="outline">
            <Link
              href="/api/posts"
              aria-label="View the posts API endpoint"
              className="flex items-center gap-2 text-sm font-semibold"
            >
              <PenSquare className="size-4" aria-hidden="true" />
              <span>API</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
