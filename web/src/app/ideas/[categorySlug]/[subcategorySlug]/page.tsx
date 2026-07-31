import Link from "next/link";
import { notFound } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { getDataset } from "@/lib/dataset";

type SubcategoryPageProps = {
  params: Promise<{
    categorySlug: string;
    subcategorySlug: string;
  }>;
};

export default async function SubcategoryPage({
  params,
}: SubcategoryPageProps) {
  const { categorySlug, subcategorySlug } = await params;

  const dataset = await getDataset();
  const category = dataset.categories.find(
    (entry) => entry.slug === categorySlug,
  );

  if (!category) {
    notFound();
  }

  const subcategory = category.subcategories.find(
    (entry) => entry.slug === subcategorySlug,
  );

  if (!subcategory) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8 lg:px-8">
        <header className="rounded-3xl border bg-card p-6 shadow-sm lg:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
              {category.name}
            </span>
            <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
              Niche
            </span>
            <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
              {subcategory.projects.length} ideas
            </span>
          </div>

          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-balance">
                {subcategory.name}
              </h1>
              <p className="text-lg leading-8 text-muted-foreground">
                {subcategory.thesis}
              </p>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                Target market: {subcategory.targetMarket}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/ideas/${category.slug}`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Back to category
              </Link>
              <Link href="/compare" className={buttonVariants({ size: "sm" })}>
                Open compare view
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-3xl border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Ideas in this niche
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Browse current build candidates
            </h2>

            <div className="mt-6 grid gap-4">
              {subcategory.projects.map((project) => (
                <article
                  key={project.slug}
                  className="rounded-2xl border bg-background/60 p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          {project.status}
                        </span>
                        <span className="rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          {project.buildComplexity}
                        </span>
                        <span className="rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          Score {project.validationScore}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold">{project.name}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {project.pitch}
                        </p>
                      </div>

                      <p className="text-sm leading-6 text-muted-foreground">
                        {project.summary}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid min-w-56 gap-3 rounded-2xl border bg-card p-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Pricing
                        </p>
                        <p className="mt-1 text-sm font-medium">
                          {project.pricePoint.currency} {project.pricePoint.startingAt}
                          {project.pricePoint.target
                            ? ` → ${project.pricePoint.target}`
                            : ""}
                          {" / "}
                          {project.pricePoint.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Time to MVP
                        </p>
                        <p className="mt-1 text-sm font-medium">
                          {project.timeToMvp}
                        </p>
                      </div>
                      <Link
                        href={`/ideas/${category.slug}/${subcategory.slug}/${project.slug}`}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })}
                      >
                        View details
                      </Link>
                    </div>
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
                {subcategory.evidence.map((source) => (
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
                Niche stats
              </h2>
              <div className="mt-6 grid gap-3">
                <div className="flex items-center justify-between rounded-2xl border bg-background/60 px-4 py-3">
                  <span className="text-sm font-medium">Ideas</span>
                  <span className="text-sm text-muted-foreground">
                    {subcategory.projects.length}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border bg-background/60 px-4 py-3">
                  <span className="text-sm font-medium">Target market</span>
                  <span className="text-right text-sm text-muted-foreground">
                    {subcategory.targetMarket}
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