import "server-only";

import { sampleDataset, type TaxonomyDataset } from "@/lib/idea-data";
import { mergeDatasetWithPipeline } from "@/lib/pipeline-data";

/**
 * The dataset every page should read from. Starts from the curated
 * sample taxonomy (categories/subcategories/projects used to shape the
 * browsing structure) and layers in whatever the real analyst-console
 * pipeline has actually produced under data/candidates + data/verified,
 * so the UI reflects live pipeline output instead of only fixtures.
 */
export async function getDataset(): Promise<TaxonomyDataset> {
  return mergeDatasetWithPipeline(sampleDataset);
}
