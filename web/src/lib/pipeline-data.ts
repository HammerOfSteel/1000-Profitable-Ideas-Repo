import "server-only";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type {
  Category,
  DerivedMetrics,
  EvidenceLink,
  IdeaProject,
  IdeaStatus,
  Subcategory,
  TaxonomyDataset,
} from "@/lib/idea-data";

// Raw shape produced by data/candidate_synthesizer.py (thinner schema).
type RawEvidenceSourced = { evidenceRefs?: string[]; description?: string };

type RawCandidate = {
  id: string;
  nicheLabel?: string;
  problemSummary?: string;
  comparableProducts?: string[];
  complexityNotes?: string;
  wedgeHypotheses?: RawEvidenceSourced[];
  acquisitionNotes?: string;
  maintainabilityNotes?: string;
  samuelStyleScore?: number;
  scoreBreakdown?: Record<string, number>;
  promotionStatus?: string;
  promotionRationale?: string;
  createdOn?: string;
  lastUpdated?: string;
};

// Richer shape produced once a candidate has been through deep-lane
// verification (data/deep_lane_engine.py).
type EvidencePoint = {
  source: string;
  metric: string;
  date?: string;
  confidence?: number;
};

type VerifiedCandidate = {
  id: string;
  name?: string;
  niche?: string;
  description?: string;
  problemStatement?: string;
  demandEvidence?: EvidencePoint[];
  willingnessToPayEvidence?: EvidencePoint[];
  competitionGapEvidence?: EvidencePoint[];
  distributionEvidence?: EvidencePoint[];
  validationScore?: Record<string, number> & { total?: number };
  mvpScope?: string;
  monetization?: string;
  acquisitionStrategy?: string;
  competitionAnalysis?: string;
  wedgeOpportunity?: string;
  unknowns?: string[];
  nextValidationSteps?: string[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

const PIPELINE_CATEGORY_SLUG = "live-pipeline";
const PIPELINE_SUBCATEGORY_SLUG = "automated-candidates";

function slugFromId(id: string) {
  return id.replace(/^candidate_/, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
}

function toEvidenceLink(point: EvidencePoint, sourceType: string): EvidenceLink {
  return {
    title: point.source,
    url: "#",
    accessedOn: point.date ?? "unknown",
    sourceType,
    notes: point.metric,
  };
}

function bucketFromScore(score: number, max: number): "Low" | "Medium" | "High" {
  const ratio = max > 0 ? score / max : 0;
  if (ratio >= 0.66) return "High";
  if (ratio >= 0.33) return "Medium";
  return "Low";
}

function mapStatus(status: string | undefined): IdeaStatus {
  const allowed: IdeaStatus[] = [
    "Idea",
    "Validated",
    "Blueprinted",
    "Ready to Build",
  ];
  return allowed.includes(status as IdeaStatus) ? (status as IdeaStatus) : "Idea";
}

function firstDollarAmount(text: string | undefined): number | undefined {
  if (!text) return undefined;
  const match = text.match(/\$(\d+(?:[.,]\d+)?)/);
  if (!match) return undefined;
  return Number(match[1].replace(",", ""));
}

async function readJsonDir<T>(dirPath: string): Promise<T[]> {
  try {
    const files = await readdir(dirPath);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));
    const contents = await Promise.all(
      jsonFiles.map(async (file) => {
        const raw = await readFile(path.join(dirPath, file), "utf-8");
        return JSON.parse(raw) as T;
      }),
    );
    return contents;
  } catch {
    return [];
  }
}

function adaptVerified(candidate: VerifiedCandidate): IdeaProject {
  const slug = slugFromId(candidate.id);
  const evidence: EvidenceLink[] = [
    ...(candidate.demandEvidence ?? []).map((p) => toEvidenceLink(p, "demand")),
    ...(candidate.willingnessToPayEvidence ?? []).map((p) =>
      toEvidenceLink(p, "willingness-to-pay"),
    ),
    ...(candidate.competitionGapEvidence ?? []).map((p) =>
      toEvidenceLink(p, "competition-gap"),
    ),
    ...(candidate.distributionEvidence ?? []).map((p) =>
      toEvidenceLink(p, "distribution"),
    ),
  ];

  const total = candidate.validationScore?.total ?? 0;
  const buildFeasibility = candidate.validationScore?.buildFeasibility ?? 0;
  const startingAt = firstDollarAmount(candidate.monetization) ?? 0;

  return {
    id: 0, // assigned by caller once merged
    name: candidate.name ?? candidate.niche ?? slug,
    slug,
    pitch: candidate.description ?? candidate.problemStatement ?? "",
    summary: candidate.description ?? "",
    problem: candidate.problemStatement ?? "",
    targetUsers: ["Derived from live pipeline evidence — see idea detail"],
    marketType: "B2B",
    willingnessToPay:
      candidate.willingnessToPayEvidence?.[0]?.metric ??
      "See willingness-to-pay evidence",
    distributionChannels: (candidate.distributionEvidence ?? []).map(
      (p) => p.source,
    ),
    pricingModel: "subscription",
    pricePoint: {
      currency: "USD",
      startingAt,
      unit: "per month",
    },
    validationScore: total,
    buildComplexity: bucketFromScore(buildFeasibility, 15),
    timeToMvp: candidate.mvpScope
      ? candidate.mvpScope.split("\n")[0].slice(0, 80)
      : "TBD",
    revenueModel: candidate.monetization?.split("\n")[0] ?? "TBD",
    status: mapStatus(candidate.status),
    tags: ["live-pipeline", "verified"],
    evidence,
    derived: {
      sortingScore: total,
      opportunitySize: bucketFromScore(
        candidate.validationScore?.demand ?? 0,
        25,
      ),
      competitionLevel: bucketFromScore(
        25 - (candidate.validationScore?.competitionGap ?? 0),
        25,
      ),
      aiLeverage: "Medium",
      implementationReadiness: bucketFromScore(buildFeasibility, 15),
    } satisfies DerivedMetrics,
  };
}

function adaptRawCandidate(candidate: RawCandidate): IdeaProject {
  const slug = slugFromId(candidate.id);
  const score = candidate.samuelStyleScore ?? 0;
  const buildFeasibility = candidate.scoreBreakdown?.buildFeasibility ?? 0;

  const evidence: EvidenceLink[] = (candidate.comparableProducts ?? []).map(
    (title) => ({
      title,
      url: "#",
      accessedOn: candidate.createdOn ?? "unknown",
      sourceType: "comparable-product",
    }),
  );

  return {
    id: 0,
    name: candidate.nicheLabel ?? slug,
    slug,
    pitch: candidate.problemSummary ?? "",
    summary: candidate.problemSummary ?? "",
    problem: candidate.problemSummary ?? "",
    targetUsers: ["Derived from live pipeline evidence — see idea detail"],
    marketType: "B2B",
    willingnessToPay: candidate.acquisitionNotes ?? "Unvalidated",
    distributionChannels: candidate.acquisitionNotes
      ? [candidate.acquisitionNotes]
      : [],
    pricingModel: "subscription",
    pricePoint: { currency: "USD", startingAt: 0, unit: "per month" },
    validationScore: score,
    buildComplexity: bucketFromScore(buildFeasibility, 15),
    timeToMvp: "TBD",
    revenueModel: candidate.maintainabilityNotes ?? "TBD",
    status:
      candidate.promotionStatus === "promote" ? "Validated" : "Idea",
    tags: ["live-pipeline", "candidate"],
    evidence,
    derived: {
      sortingScore: score,
      opportunitySize: bucketFromScore(
        candidate.scoreBreakdown?.demand ?? 0,
        25,
      ),
      competitionLevel: bucketFromScore(
        25 - (candidate.scoreBreakdown?.competitionGap ?? 0),
        25,
      ),
      aiLeverage: "Medium",
      implementationReadiness: bucketFromScore(buildFeasibility, 15),
    } satisfies DerivedMetrics,
  };
}

/**
 * Reads the real analyst-console pipeline output (data/candidates,
 * data/verified) from the repo root and adapts it into IdeaProject
 * records. Verified candidates take precedence over the thinner
 * candidate-stage record when both exist for the same id.
 */
export async function loadPipelineIdeas(): Promise<IdeaProject[]> {
  const repoRoot = path.join(process.cwd(), "..");
  const candidatesDir = path.join(repoRoot, "data", "candidates");
  const verifiedDir = path.join(repoRoot, "data", "verified");

  const [rawCandidates, verifiedCandidates] = await Promise.all([
    readJsonDir<RawCandidate>(candidatesDir),
    readJsonDir<VerifiedCandidate>(verifiedDir),
  ]);

  const verifiedIds = new Set(verifiedCandidates.map((c) => c.id));
  const projects: IdeaProject[] = [
    ...verifiedCandidates.map(adaptVerified),
    ...rawCandidates
      .filter((c) => !verifiedIds.has(c.id))
      .map(adaptRawCandidate),
  ];

  return projects.map((project, index) => ({ ...project, id: 100000 + index }));
}

/**
 * Builds a "Live Pipeline Data" category from whatever the real
 * analyst-console pipeline has produced so far, so the UI can surface
 * actual run output rather than requiring the pipeline to be re-run for
 * every dataset consumer.
 */
export async function loadPipelineCategory(): Promise<Category | null> {
  const projects = await loadPipelineIdeas();
  if (projects.length === 0) return null;

  const subcategory: Subcategory = {
    id: 900001,
    name: "Automated Candidates",
    slug: PIPELINE_SUBCATEGORY_SLUG,
    thesis:
      "Ideas surfaced directly by the analyst-console pipeline (candidate synthesis + deep-lane verification), not hand-curated.",
    targetMarket: "Varies per candidate — see individual evidence",
    tags: ["live-pipeline"],
    evidence: [],
    projects,
  };

  return {
    id: 900000,
    name: "Live Pipeline Data",
    slug: PIPELINE_CATEGORY_SLUG,
    thesis:
      "Populated automatically from data/candidates and data/verified each time the analyst-console pipeline runs. This is real output, not sample fixture data.",
    targetMarket: "Cross-category — pipeline output is not yet taxonomized",
    tags: ["live-pipeline"],
    evidence: [],
    subcategories: [subcategory],
  };
}

export async function mergeDatasetWithPipeline(
  dataset: TaxonomyDataset,
): Promise<TaxonomyDataset> {
  const pipelineCategory = await loadPipelineCategory();
  if (!pipelineCategory) return dataset;
  return {
    ...dataset,
    categories: [...dataset.categories, pipelineCategory],
  };
}
