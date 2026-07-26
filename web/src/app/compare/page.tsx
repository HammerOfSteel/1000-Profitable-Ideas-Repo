import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { flattenIdeas, sampleDataset } from "@/lib/idea-data";

type ComparePageProps = {
  searchParams: Promise<{
    category?: string;
    sort?: string;
  }>;
};

const allIdeas = flattenIdeas(sampleDataset);
const categories = sampleDataset.categories;

function sortIdeas(
  ideas: typeof allIdeas,
  sort: string | undefined,
) {
  switch (sort) {
    case "price":
      return [...ideas].sort(
        (a, b) => b.pricePoint.startingAt - a.pricePoint.startingAt,
      );
    case "complexity":
      return [...ideas].sort((a, b) =>
        a.buildComplexity.localeCompare(b.buildComplexity),
      );
    case "readiness":
      return [...ideas].sort((a, b) =>
        b.status.localeCompare(a.status),
      );
    case "score":
    default:
      return [...ideas].sort((a, b) => b.validationScore - a.validationScore);
  }
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const { category, sort } = await searchParams;

  const filteredIdeas = category
    ? allIdeas.filter((idea) => idea.categorySlug === category)
    : allIdeas;

  const ideas = sortIdeas(filteredIdeas, sort);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8">
        <header className="rounded-3xl border bg-card p-6 shadow-sm lg:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Comparison view
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Compare ideas side by side
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
            Use category filters and sorting controls to compare the current
            dataset by validation score, pricing, readiness, and build profile.
          </p>

          <div className="mt-6 flex flex-col gap-4">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Filter by category
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/compare"
                  className={buttonVariants({
                    size: "sm",
                    variant: category ? "outline" : "default",
                  })}
                >
                  All categories
                </Link>
                {categories.map((entry) => (
                  <Link
                    key={entry.slug}
                    href={`/compare?category=${entry.slug}${sort ? `&sort=${sort}` : ""}`}
                    className={buttonVariants({
                      size: "sm",
                      variant: category === entry.slug ? "default" : "outline",
                    })}
                  >
                    {entry.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Sort by
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Validation score", value: "score" },
                  { label: "Starting price", value: "price" },
                  { label: "Complexity", value: "complexity" },
                  { label: "Readiness", value: "readiness" },
                ].map((option) => (
                  <Link
                    key={option.value}
                    href={`/compare?${category ? `category=${category}&` : ""}sort=${option.value}`}
                    className={buttonVariants({
                      size: "sm",
                      variant:
                        (sort ?? "score") === option.value ? "default" : "outline",
                    })}
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border bg-card p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Showing {ideas.length} idea{ideas.length === 1 ? "" : "s"}
              </p>
              <p className="text-sm text-muted-foreground">
                {category
                  ? `Filtered to ${categories.find((entry) => entry.slug === category)?.name ?? category}`
                  : "Across all current categories"}
              </p>
            </div>
            <Link href="/" className={buttonVariants({ variant: "outline", size: "sm" })}>
              Back to dashboard
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Idea</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Market</th>
                    <th className="px-4 py-3 font-medium">Score</th>
                    <th className="px-4 py-3 font-medium">Complexity</th>
                    <th className="px-4 py-3 font-medium">Pricing</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ideas.map((idea) => (
                    <tr
                      key={`${idea.categorySlug}-${idea.subcategorySlug}-${idea.slug}`}
                      className="border-t"
                    >
                      <td className="px-4 py-4 align-top">
                        <div className="space-y-1">
                          <Link
                            href={`/ideas/${idea.categorySlug}/${idea.subcategorySlug}/${idea.slug}`}
                            className="font-medium text-foreground underline-offset-4 hover:underline"
                          >
                            {idea.name}
                          </Link>
                          <p className="max-w-sm text-muted-foreground">
                            {idea.pitch}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top text-muted-foreground">
                        <div>
                          <Link
                            href={`/ideas/${idea.categorySlug}`}
                            className="underline-offset-4 hover:underline"
                          >
                            {idea.categoryName}
                          </Link>
                          <div>
                            <Link
                              href={`/ideas/${idea.categorySlug}/${idea.subcategorySlug}`}
                              className="underline-offset-4 hover:underline"
                            >
                              {idea.subcategoryName}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top text-muted-foreground">
                        {idea.marketType}
                      </td>
                      <td className="px-4 py-4 align-top font-medium">
                        {idea.validationScore}
                      </td>
                      <td className="px-4 py-4 align-top text-muted-foreground">
                        {idea.buildComplexity}
                        <div>{idea.timeToMvp}</div>
                      </td>
                      <td className="px-4 py-4 align-top text-muted-foreground">
                        {idea.pricePoint.currency} {idea.pricePoint.startingAt}
                        {idea.pricePoint.target
                          ? ` → ${idea.pricePoint.target}`
                          : ""}
                        <div>{idea.pricePoint.unit}</div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
                          {idea.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}