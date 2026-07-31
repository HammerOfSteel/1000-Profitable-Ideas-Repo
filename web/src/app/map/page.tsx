import { flattenIdeas } from "@/lib/idea-data";
import { getDataset } from "@/lib/dataset";
import { MindMapView } from "@/components/mindmap/mind-map-view";

const complexityColumn: Record<string, string> = {
  Low: "Low effort",
  Medium: "Medium effort",
  High: "High effort",
};

const opportunityColumn: Record<string, string> = {
  Low: "Lower opportunity",
  Medium: "Mid opportunity",
  High: "High opportunity",
};

export default async function MapPage() {
  const dataset = await getDataset();
  const categories = dataset.categories;
  const ideas = flattenIdeas(dataset).sort(
    (a, b) => b.derived.sortingScore - a.derived.sortingScore,
  );
  const matrixIdeas = ideas.slice(0, 4);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8">
        <header className="rounded-3xl border bg-card p-6 shadow-sm lg:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Advanced exploration
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Mindmap-style hierarchy and opportunity mapping
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
            This slice turns the sample taxonomy into two complementary views:
            a relationship-oriented hierarchy and a strategic matrix for
            prioritizing ideas by effort and opportunity.
          </p>
        </header>

        <section className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Mindmap view
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Category → niche → idea relationships
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Click a category or niche to expand it, click an idea to open
              its detail page. Drag to pan, scroll to zoom.
            </p>
          </div>

          <div className="mt-6">
            <MindMapView categories={categories} />
          </div>
        </section>

        <section className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Strategic matrix
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Effort versus opportunity
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              First-pass prioritization from derived metrics
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {matrixIdeas.map((idea) => (
              <article
                key={`${idea.categorySlug}-${idea.subcategorySlug}-${idea.slug}`}
                className="rounded-2xl border bg-background/60 p-5"
              >
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
                    {opportunityColumn[idea.derived.opportunitySize]}
                  </span>
                  <span className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
                    {complexityColumn[idea.buildComplexity]}
                  </span>
                  <span className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
                    AI leverage: {idea.derived.aiLeverage}
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-semibold">{idea.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {idea.pitch}
                </p>

                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border bg-card px-4 py-3">
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                      Score
                    </dt>
                    <dd className="mt-1 text-lg font-semibold">
                      {idea.validationScore}
                    </dd>
                  </div>
                  <div className="rounded-2xl border bg-card px-4 py-3">
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                      Readiness
                    </dt>
                    <dd className="mt-1 text-lg font-semibold">
                      {idea.derived.implementationReadiness}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}