import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  getDatasetStats,
  getTopIdeas,
  sampleDataset,
} from "@/lib/idea-data";

const stats = getDatasetStats(sampleDataset);
const topIdeas = getTopIdeas(sampleDataset, 4);
const categories = sampleDataset.categories;

const statusTone: Record<string, string> = {
  Idea: "bg-slate-800 text-slate-200",
  Validated: "bg-sky-500/15 text-sky-200",
  Blueprinted: "bg-violet-500/15 text-violet-200",
  "Ready to Build": "bg-emerald-500/15 text-emerald-200",
};

const complexityTone: Record<string, string> = {
  Low: "text-emerald-300",
  Medium: "text-amber-300",
  High: "text-rose-300",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8">
        <header className="overflow-hidden rounded-3xl border bg-card shadow-sm">
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
            <div className="space-y-4">
              <div className="inline-flex rounded-full border bg-muted px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Evidence-backed opportunity explorer
              </div>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                  Browse profitable ideas with structure, scoring, and execution
                  context.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  The product is now moving from repository scaffolding into a
                  usable exploration interface. This first slice is powered by a
                  normalized sample taxonomy so future category, list, and detail
                  views can reuse the same contract.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/compare" className={buttonVariants({ size: "lg" })}>
                  Compare ideas
                </Link>
                <Link
                  href="/map"
                  className={buttonVariants({ size: "lg", variant: "outline" })}
                >
                  Open map view
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border bg-muted/40 p-5">
                <p className="text-sm font-medium text-muted-foreground">
                  Minimum validation score
                </p>
                <p className="mt-3 text-3xl font-semibold">
                  {stats.minimumValidationScore}+
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Ideas below threshold are revised or replaced before entering
                  the main dataset.
                </p>
              </div>
              <div className="rounded-2xl border bg-muted/40 p-5">
                <p className="text-sm font-medium text-muted-foreground">
                  Current sample dataset
                </p>
                <p className="mt-3 text-3xl font-semibold">{stats.ideaCount}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Sample ideas already exercise category, sub-category, scoring,
                  pricing, and readiness fields.
                </p>
              </div>
              <div className="rounded-2xl border bg-muted/40 p-5 sm:col-span-2">
                <p className="text-sm font-medium text-muted-foreground">
                  What this UI slice proves
                </p>
                <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  <li>• Data-driven dashboard statistics</li>
                  <li>• Reusable idea list cards</li>
                  <li>• Status and complexity badges</li>
                  <li>• Category and niche context on each idea</li>
                </ul>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border bg-card p-5 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">
              Categories in sample
            </p>
            <p className="mt-3 text-3xl font-semibold">{stats.categoryCount}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Structured top-level markets currently modeled for UI development.
            </p>
          </article>
          <article className="rounded-2xl border bg-card p-5 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">
              Sub-categories in sample
            </p>
            <p className="mt-3 text-3xl font-semibold">
              {stats.subcategoryCount}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Niches nested beneath the current category set.
            </p>
          </article>
          <article className="rounded-2xl border bg-card p-5 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">
              Average validation score
            </p>
            <p className="mt-3 text-3xl font-semibold">{stats.averageScore}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Average across sample ideas using the shared rubric.
            </p>
          </article>
          <article className="rounded-2xl border bg-card p-5 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">
              Ready-to-build ideas
            </p>
            <p className="mt-3 text-3xl font-semibold">
              {stats.statusBreakdown["Ready to Build"]}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Ideas already framed as concrete build candidates.
            </p>
          </article>
        </section>

        <section className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Browse by category
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Navigate the current structured dataset
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Direct links into categories, niches, and idea detail pages
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {categories.map((category) => {
              const ideaCount = category.subcategories.reduce(
                (count, subcategory) => count + subcategory.projects.length,
                0,
              );

              return (
                <article
                  key={category.slug}
                  className="rounded-2xl border bg-background/60 p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          {category.subcategories.length} niches
                        </span>
                        <span className="rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          {ideaCount} ideas
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold">{category.name}</h3>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {category.thesis}
                      </p>
                    </div>

                    <Link
                      href="/map"
                      className={buttonVariants({ variant: "outline", size: "sm" })}
                    >
                      View on map
                    </Link>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {category.subcategories.map((subcategory) => (
                      <div
                        key={subcategory.slug}
                        className="rounded-2xl border bg-card p-4"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-medium">
                              {subcategory.name}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                              {subcategory.targetMarket}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {subcategory.projects.length} ideas
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
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
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-3xl border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Top opportunities
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  Highest-ranked ideas in the sample explorer
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Sorted by derived ranking score
              </p>
            </div>

            <div className="mt-6 grid gap-4">
              {topIdeas.map((idea) => (
                <article
                  key={`${idea.categorySlug}-${idea.subcategorySlug}-${idea.slug}`}
                  className="rounded-2xl border bg-background/60 p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          {idea.categoryName}
                        </span>
                        <span className="rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          {idea.subcategoryName}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusTone[idea.status]}`}
                        >
                          {idea.status}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold">{idea.name}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {idea.pitch}
                        </p>
                      </div>

                      <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                        {idea.summary}
                      </p>

                      <div className="pt-1">
                        <Link
                          href={`/ideas/${idea.categorySlug}/${idea.subcategorySlug}/${idea.slug}`}
                          className={buttonVariants({
                            variant: "outline",
                            size: "sm",
                          })}
                        >
                          View details
                        </Link>
                      </div>
                    </div>

                    <div className="grid min-w-56 gap-3 rounded-2xl border bg-card p-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Validation
                        </p>
                        <p className="mt-1 text-2xl font-semibold">
                          {idea.validationScore}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Pricing
                        </p>
                        <p className="mt-1 text-sm font-medium">
                          {idea.pricePoint.currency} {idea.pricePoint.startingAt}
                          {idea.pricePoint.target
                            ? ` → ${idea.pricePoint.target}`
                            : ""}
                          {" / "}
                          {idea.pricePoint.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Complexity
                        </p>
                        <p
                          className={`mt-1 text-sm font-medium ${complexityTone[idea.buildComplexity]}`}
                        >
                          {idea.buildComplexity}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <aside className="grid gap-6">
            <section className="rounded-3xl border bg-card p-6 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Status mix
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Readiness breakdown
              </h2>
              <div className="mt-6 grid gap-3">
                {Object.entries(stats.statusBreakdown).map(([status, count]) => (
                  <div
                    key={status}
                    className="flex items-center justify-between rounded-2xl border bg-background/60 px-4 py-3"
                  >
                    <span className="text-sm font-medium">{status}</span>
                    <span className="text-sm text-muted-foreground">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border bg-card p-6 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Complexity mix
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Build effort snapshot
              </h2>
              <div className="mt-6 grid gap-3">
                {Object.entries(stats.complexityBreakdown).map(
                  ([complexity, count]) => (
                    <div
                      key={complexity}
                      className="flex items-center justify-between rounded-2xl border bg-background/60 px-4 py-3"
                    >
                      <span className="text-sm font-medium">{complexity}</span>
                      <span className="text-sm text-muted-foreground">
                        {count}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}