export const SiteFooter = () => {
  return (
    <footer className="border-t border-border/60 bg-background/80">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-6 py-10 text-sm text-muted-foreground sm:px-8">
        <p>Built with Next.js, Tailwind CSS, and shadcn/ui.</p>
        <p>Drop a markdown file into the content directory or POST to the API to publish instantly.</p>
      </div>
    </footer>
  )
}
