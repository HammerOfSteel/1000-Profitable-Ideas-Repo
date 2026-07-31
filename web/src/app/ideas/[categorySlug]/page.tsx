import Link from "next/link";
import { notFound } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { getDataset } from "@/lib/dataset";

type CategoryPageProps = {
  params: Promise<{
    categorySlug: string;
  }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = await params;

  const dataset = await getDataset();
  const category = dataset.categories.find(
    (entry) => entry.slug === categorySlug,
  );

  if (!category) {
    notFound();
  }

  const ideaCount = category.subcategories.reduce(
    (count, subcategory) => count + subcategory.projects.length,
    0,
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8 lg:px-8">
        <header className="rounded-3xl border bg-card p-6 shadow-sm lg:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
              Category
            </span>
            <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
              {category.subcategories.length} niches
            </span>
            <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
              {ideaCount} ideas
            </span>
          </div>

          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-balance">
                {category.name}
              </h1>
              <p className="text-lg leading-8 text-muted-foreground">
                {category.thesis}
              </p>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                Target market: {category.targetMarket}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Back to dashboard
              </Link>
              <Link href="/map" className={buttonVariants({ size: "sm" })}>
                Open map view
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Sub-categories
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Explore niches in this category
            </h2>

            <div className="mt-6 grid gap-4">
              {category.subcategories.map((subcategory) => (
                <article
                  key={subcategory.slug}
                  className="rounded-2xl border bg-background/60 p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          {subcategory.projects.length} ideas
                        </span>
                        {subcategory.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-xl font-semibold">
                        {subcategory.name}
                      </h3>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {subcategory.thesis}
                      </p>
                      <p className="text-sm leading-6 text-muted-foreground">
                        Target market: {subcategory.targetMarket}
                      </p>
                    </div>

                    <Link
                      href={`/ideas/${category.slug}/${subcategory.slug}`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                      })}
                    >
                      Open niche
                    </Link>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {subcategory.projects.map((project) => (
                      <Link
                        key={project.slug}
                        href={`/ideas/${category.slug}/${subcategory.slug}/${project.slug}`}
                        className={buttonVariants({
                          variant: "secondary",
                          size: "sm",
                        })}
                      >
                        {project.name}
                      </Link>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </article>

          <aside className="grid gap-6">
            <section className="rounded-3xl border bg-card p-6 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Evidence
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Source trail
              </h2>
              <div className="mt-6 space-y-3">
                {category.evidence.map((source) => (
                  <a
                    key={source.title}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-2xl border bg-background/60 p-4 transition-colors hover:bg-muted/40"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {source.title}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                      {source.sourceType} • accessed {source.accessedOn}
                    </p>
                    {source.notes ? (
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {source.notes}
                      </p>
                    ) : null}
                  </a>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border bg-card p-6 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Snapshot
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Category stats
              </h2>
              <div className="mt-6 grid gap-3">
                <div className="flex items-center justify-between rounded-2xl border bg-background/60 px-4 py-3">
                  <span className="text-sm font-medium">Sub-categories</span>
                  <span className="text-sm text-muted-foreground">
                    {category.subcategories.length}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border bg-background/60 px-4 py-3">
                  <span className="text-sm font-medium">Ideas</span>
                  <span className="text-sm text-muted-foreground">
                    {ideaCount}
                  </span>
                </div>
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}