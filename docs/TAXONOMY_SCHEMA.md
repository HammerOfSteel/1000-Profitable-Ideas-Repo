# Taxonomy Schema

This document defines the canonical data contract for the `1000 Profitable Ideas` dataset.

## Goals

The schema must support all of the following:

- repository scaffolding
- validation workflows
- research traceability
- frontend browsing and filtering
- statistics and derived views
- blueprint readiness tracking

## Top-level structure

```json
{
  "schemaVersion": "1.0.0",
  "meta": {
    "project": "1000 Profitable Ideas",
    "description": "Canonical structured dataset for categories, sub-categories, and validated idea blueprints.",
    "lastUpdated": null,
    "minimumValidationScore": 70
  },
  "categories": []
}
```

## Top-level fields

| Field | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| `schemaVersion` | `string` | Yes | Version of the taxonomy contract |
| `meta` | `object` | Yes | Dataset metadata |
| `categories` | `array` | Yes | Ordered list of category nodes |

## `meta` object

| Field | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| `project` | `string` | Yes | Human-readable dataset/project name |
| `description` | `string` | Yes | Dataset summary |
| `lastUpdated` | `string \| null` | Yes | ISO date or `null` during bootstrap |
| `minimumValidationScore` | `number` | Yes | Shared acceptance threshold |

---

## Category node

```json
{
  "id": 1,
  "name": "Vertical SaaS",
  "slug": "vertical-saas",
  "thesis": "Niche B2B workflows support higher willingness to pay and lower support complexity.",
  "targetMarket": "Small and midsize niche businesses",
  "tags": ["b2b", "saas", "workflow"],
  "evidence": [],
  "subcategories": []
}
```

### Category fields

| Field | Type | Required | Kind | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `number` | Yes | Authored | Stable ordering key |
| `name` | `string` | Yes | Authored | Display name |
| `slug` | `string` | Yes | Authored | URL and folder-safe identifier |
| `thesis` | `string` | Yes | Research-derived | Macro profitability thesis |
| `targetMarket` | `string` | Yes | Research-derived | Summary of intended buyer space |
| `tags` | `string[]` | No | Authored | Browse/filter support |
| `evidence` | `EvidenceLink[]` | Yes | Research-derived | Dated links supporting the thesis |
| `subcategories` | `Subcategory[]` | Yes | Authored | Ordered child nodes |

---

## Sub-category node

```json
{
  "id": 1,
  "name": "Compliance Workflows",
  "slug": "compliance-workflows",
  "thesis": "Manual compliance processes are repetitive, painful, and tied to deadlines.",
  "targetMarket": "Small regulated teams with recurring documentation needs",
  "tags": ["compliance", "b2b"],
  "evidence": [],
  "projects": []
}
```

### Sub-category fields

| Field | Type | Required | Kind | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `number` | Yes | Authored | Stable ordering key within parent |
| `name` | `string` | Yes | Authored | Display name |
| `slug` | `string` | Yes | Authored | URL and folder-safe identifier |
| `thesis` | `string` | Yes | Research-derived | Niche profitability thesis |
| `targetMarket` | `string` | Yes | Research-derived | Buyer/user niche summary |
| `tags` | `string[]` | No | Authored | Browse/filter support |
| `evidence` | `EvidenceLink[]` | Yes | Research-derived | Dated links supporting the niche |
| `projects` | `IdeaProject[]` | Yes | Authored | Ordered idea nodes |

---

## Idea / project node

```json
{
  "id": 1,
  "name": "AuditTrail AI",
  "slug": "audittrail-ai",
  "pitch": "Automated compliance evidence capture for boutique HR teams.",
  "summary": "Collects, organizes, and exports recurring compliance evidence in one workflow.",
  "problem": "Teams lose time assembling evidence from scattered systems before every audit cycle.",
  "targetUsers": [
    "HR managers at 20-200 employee firms",
    "Operations leads handling compliance documentation"
  ],
  "marketType": "B2B",
  "willingnessToPay": "Existing spend on consultants, manual labor, and compliance software indicates budget.",
  "distributionChannels": [
    "LinkedIn outbound",
    "HR communities",
    "Compliance consultants"
  ],
  "pricingModel": "subscription",
  "pricePoint": {
    "currency": "USD",
    "startingAt": 49,
    "target": 149,
    "unit": "per month"
  },
  "validationScore": 78,
  "buildComplexity": "Medium",
  "timeToMvp": "2-4 weeks",
  "revenueModel": "SaaS subscription",
  "status": "Validated",
  "tags": ["b2b", "compliance", "automation"],
  "evidence": [],
  "derived": {
    "sortingScore": 78,
    "opportunitySize": "Medium",
    "competitionLevel": "Medium",
    "aiLeverage": "High",
    "implementationReadiness": "Medium"
  }
}
```

### Idea/project fields

| Field | Type | Required | Kind | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `number` | Yes | Authored | Stable ordering key within parent |
| `name` | `string` | Yes | Authored | Idea title |
| `slug` | `string` | Yes | Authored | URL and folder-safe identifier |
| `pitch` | `string` | Yes | Authored | One-line explanation |
| `summary` | `string` | Yes | Authored | Short product summary |
| `problem` | `string` | Yes | Research-derived | Pain/problem statement |
| `targetUsers` | `string[]` | Yes | Research-derived | Personas or user groups |
| `marketType` | `string` | Yes | Research-derived | `B2B`, `B2C`, `Prosumer`, `Marketplace`, etc. |
| `willingnessToPay` | `string` | Yes | Research-derived | Proof of buyer budget |
| `distributionChannels` | `string[]` | Yes | Research-derived | Reachable channels |
| `pricingModel` | `string` | Yes | Research-derived | Subscription, usage, one-time, etc. |
| `pricePoint` | `PricePoint` | Yes | Research-derived | Pricing hypothesis |
| `validationScore` | `number` | Yes | Computed | Shared rubric score |
| `buildComplexity` | `string` | Yes | Authored | `Low`, `Medium`, `High` |
| `timeToMvp` | `string` | Yes | Authored | Estimated delivery range |
| `revenueModel` | `string` | Yes | Research-derived | Monetization summary |
| `status` | `string` | Yes | Computed | `Idea`, `Validated`, `Blueprinted`, `Ready to Build` |
| `tags` | `string[]` | No | Authored | Browse/filter support |
| `evidence` | `EvidenceLink[]` | Yes | Research-derived | Dated links supporting the idea |
| `derived` | `DerivedMetrics` | No | Computed | UI-specific metrics |

---

## Supporting types

### `EvidenceLink`

```json
{
  "title": "Example source",
  "url": "https://example.com",
  "accessedOn": "2026-07-26",
  "sourceType": "market-report",
  "notes": "Supports willingness to pay"
}
```

| Field | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| `title` | `string` | Yes | Human-readable source title |
| `url` | `string` | Yes | Canonical URL |
| `accessedOn` | `string` | Yes | ISO date |
| `sourceType` | `string` | Yes | Example: `market-report`, `competitor-pricing`, `community-thread`, `search-trend` |
| `notes` | `string` | No | Why this source matters |

### `PricePoint`

```json
{
  "currency": "USD",
  "startingAt": 49,
  "target": 149,
  "unit": "per month"
}
```

| Field | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| `currency` | `string` | Yes | ISO-like currency code |
| `startingAt` | `number` | Yes | Entry price hypothesis |
| `target` | `number` | No | Higher-value target tier |
| `unit` | `string` | Yes | Example: `per month`, `per user/month`, `one-time` |

### `DerivedMetrics`

```json
{
  "sortingScore": 78,
  "opportunitySize": "Medium",
  "competitionLevel": "Medium",
  "aiLeverage": "High",
  "implementationReadiness": "Medium"
}
```

| Field | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| `sortingScore` | `number` | No | Frontend ranking helper |
| `opportunitySize` | `string` | No | Relative market/opportunity marker |
| `competitionLevel` | `string` | No | Low/Medium/High |
| `aiLeverage` | `string` | No | Low/Medium/High |
| `implementationReadiness` | `string` | No | Low/Medium/High |

---

## Field ownership

## Human-authored

- `id`
- `name`
- `slug`
- `pitch`
- `summary`
- `tags`
- initial `buildComplexity`
- initial `timeToMvp`

## Research-derived

- `thesis`
- `targetMarket`
- `problem`
- `targetUsers`
- `marketType`
- `willingnessToPay`
- `distributionChannels`
- `pricingModel`
- `pricePoint`
- `revenueModel`
- `evidence`

## Computed / workflow-derived

- `validationScore`
- `status`
- `derived.*`
- `meta.lastUpdated`

---

## Frontend expectations

The frontend should be able to depend on this schema for:

- hierarchical navigation
- filtering by market, effort, score, pricing, and status
- dashboard statistics
- compare views
- graph / mindmap relationships
- detail pages with evidence and next-step guidance

---

## Notes for `scaffolder.py`

The current scaffolder requires only these fields for basic operation:

- category: `id`, `name`, `thesis`
- sub-category: `id`, `name`, `thesis`
- project: `id`, `name`, `pitch`

Future upgrades should preserve backward compatibility while gradually validating the richer schema defined here.