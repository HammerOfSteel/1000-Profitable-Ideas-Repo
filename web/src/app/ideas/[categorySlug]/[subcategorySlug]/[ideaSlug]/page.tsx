import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getComparableIdeas, getIdeaBySlugs, sampleDataset } from "@/lib/idea-data";

type IdeaDetailPageProps = {
  params: Promise<{
    categorySlug: string;
    subcategorySlug: string;
    ideaSlug: string;
  }>;
};

export default async function IdeaDetailPage({ params }: IdeaDetailPageProps) {
  const { categorySlug, subcategorySlug, ideaSlug } = await params;

  const idea = getIdeaBySlugs(
    sampleDataset,
    categorySlug,
    subcategorySlug,
    ideaSlug,
  );

  if (!idea) {
    notFound();
  }

  const comparableIdeas = getComparableIdeas(sampleDataset, idea.slug, 3);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8 lg:px-8">
        <header className="rounded-3xl border bg-card p-6 shadow-sm lg:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
              {idea.categoryName}
            </span>
            <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
              {idea.subcategoryName}
            </span>
            <span className="rounded-full border bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              {idea.status}
            </span>
          </div>

          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-balance">
                {idea.name}
              </h1>
              <p className="text-lg leading-8 text-muted-foreground">
                {idea.pitch}
              </p>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                {idea.summary}
              </p>
            </div>

            <div className="grid min-w-64 gap-3 rounded-2xl border bg-background/60 p-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Validation score
                </p>
                <p className="mt-1 text-3xl font-semibold">
                  {idea.validationScore}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Pricing hypothesis
                </p>
                <p className="mt-1 text-sm font-medium">
                  {idea.pricePoint.currency} {idea.pricePoint.startingAt}
                  {idea.pricePoint.target ? ` → ${idea.pricePoint.target}` : ""}
                  {" / "}
                  {idea.pricePoint.unit}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Build profile
                </p>
                <p className="mt-1 text-sm font-medium">
                  {idea.buildComplexity} • {idea.timeToMvp}
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Problem and audience
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Why this idea exists
            </h2>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-base font-semibold">Problem</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {idea.problem}
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold">Target users</h3>
                <ul className="mt-3 space-y-2">
                  {idea.targetUsers.map((user) => (
                    <li
                      key={user}
                      className="rounded-2xl border bg-background/60 px-4 py-3 text-sm text-muted-foreground"
                    >
                      {user}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold">Distribution channels</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {idea.distributionChannels.map((channel) => (
                    <li
                      key={channel}
                      className="rounded-full border px-3 py-1.5 text-sm text-muted-foreground"
                    >
                      {channel}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          <aside className="grid gap-6">
            <section className="rounded-3xl border bg-card p-6 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Monetization
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Business framing
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">Revenue model</p>
                  <p>{idea.revenueModel}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Willingness to pay</p>
                  <p>{idea.willingnessToPay}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Market type</p>
                  <p>{idea.marketType}</p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border bg-card p-6 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Evidence
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Source trail
              </h2>
              <div className="mt-6 space-y-3">
                {idea.evidence.map((source) => (
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
                  </a>
                ))}
              </div>
            </section>
          </aside>
        </section>

        <section className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Compare next
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Other high-signal ideas in the sample dataset
              </h2>
            </div>
            <Button variant="outline">Open comparison view</Button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {comparableIdeas.map((candidate) => (
              <article
                key={`${candidate.categorySlug}-${candidate.subcategorySlug}-${candidate.slug}`}
                className="rounded-2xl border bg-background/60 p-4"
              >
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {candidate.categoryName} / {candidate.subcategoryName}
                </p>
                <h3 className="mt-2 text-lg font-semibold">{candidate.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {candidate.pitch}
                </p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Score {candidate.validationScore}
                  </span>
                  <span className="text-muted-foreground">
                    {candidate.buildComplexity}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}