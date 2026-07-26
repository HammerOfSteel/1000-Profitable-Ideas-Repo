# 🗺️ 1000 Profitable Ideas — Product + Repository Roadmap

This is the master implementation plan for turning this repository into two things at once:

1. **A rigorously researched dataset of profitable ideas**
2. **A user-friendly product for browsing, filtering, comparing, and expanding those ideas**

The work must happen **strictly phase-by-phase**. Each phase depends on verified output from the previous one. No later phase starts until the prior **Exit Gate** passes.

---

## How to read this roadmap

- **🎯 Objective** — the single outcome of the phase
- **🔗 Builds on** — what verified input this phase requires
- **🔬 Tasks** — concrete implementation and research work
- **📦 Deliverables** — artifacts that must exist at phase completion
- **✅ Exit Gate** — must all be true before the next phase starts
- **🚢 Push Checkpoint** — once the phase passes, commit and push the current `cline` branch

---

## Product principles

- **Evidence before intuition** — ideas only enter the system with linked, dated research evidence.
- **Schema before scale** — define the data contract before generating large amounts of content.
- **UI from proven primitives** — use established building blocks, not custom reinvention:
  - **Next.js + TypeScript**
  - **Tailwind CSS**
  - **shadcn/ui**
  - **TanStack Table** for dense sortable/filterable data views
  - **Recharts** or equivalent for dashboards/statistics
  - **React Flow** or equivalent for mindmap / graph exploration
- **One phase = one shippable checkpoint** — every phase should be small enough to land cleanly and push.
- **Views must match use cases** — cards, tables, stats, graph/mindmap, and detail views should all exist for a reason.
- **Templates must be actionable** — every idea should clearly communicate:
  - who it is for
  - what problem it solves
  - how the market validates it
  - price point / monetization
  - effort / complexity
  - how to start executing it

---

## End-state target

By the end of this roadmap, the repo should provide:

- A validated **10 → 100 → 1000** idea hierarchy
- A canonical structured data model for categories, sub-categories, and ideas
- A polished web UI for:
  - exploring ideas
  - filtering and sorting them
  - comparing them
  - understanding category statistics
  - viewing idea relationships in a mindmap/graph
- Standardized idea blueprints with clear execution guidance
- A repeatable workflow for continuously expanding and improving the content

---

## Current progress snapshot

**Last updated:** 2026-07-26

### Completed foundation work
- [x] Roadmap rewritten to cover both repository/data generation and frontend product implementation
- [x] Canonical taxonomy contract established in `taxonomy.json` and `docs/TAXONOMY_SCHEMA.md`
- [x] Validation rubric documented in `docs/VALIDATION_RUBRIC.md`
- [x] Research standard documented in `docs/RESEARCH_STANDARD.md`
- [x] `PROJECT_TEMPLATE.md` upgraded to match the canonical schema and actionable blueprint format
- [x] `scaffolder.py` updated to support:
  - [x] richer taxonomy skeleton
  - [x] partial validation by default
  - [x] strict final validation with `validate --strict`
  - [x] richer generated category/sub-category/project README content

### Completed frontend slices
- [x] Dedicated `web/` Next.js app created
- [x] TypeScript, Tailwind CSS, and `shadcn/ui` set up
- [x] Sample normalized dataset and helper layer added in `web/src/lib/idea-data.ts`
- [x] Core dashboard and top-ideas landing page implemented
- [x] Comparison view implemented at `/compare`
- [x] Category route implemented at `/ideas/[categorySlug]`
- [x] Sub-category route implemented at `/ideas/[categorySlug]/[subcategorySlug]`
- [x] Idea detail route implemented at `/ideas/[categorySlug]/[subcategorySlug]/[ideaSlug]`
- [x] Advanced hierarchy / mindmap-style view implemented at `/map`

### Completed sample content sync
- [x] Sample taxonomy data populated with:
  - [x] 2 categories
  - [x] 5 sub-categories
  - [x] 17 ideas
- [x] Added a new validated expansion slice under `Prosumer Productivity`:
  - [x] `AI Meeting Notes`
  - [x] `ActionRelay`
  - [x] `PrivateScribe`
  - [x] `SummaryLoop`
- [x] Added a new validated expansion slice under `Research Synthesis`:
  - [x] `BriefForge`
- [x] Added a new validated expansion slice under `Vertical SaaS`:
  - [x] `Vendor Risk Management`
  - [x] `VendorPilot`
  - [x] `QuestionnaireFlow`
  - [x] `RiskDigest`
  - [x] `RemediationLane`
  - [x] `ReviewClock`
  - [x] `EvidencePing`
- [x] Added a new validated expansion slice under `Compliance Workflows`:
  - [x] `ControlLedger`
- [x] Added a new validated expansion slice under `Client Reporting Automation`:
  - [x] `ReportBackfill`
  - [x] `SlideSignal`
- [x] Queued and documented the next likely expansion niche in research notes:
  - [x] `Vendor Risk Management for Lean Teams`
  - [x] strengthened with direct competitor-positioning evidence from `Third-Party Vendor Risk Management Software | UpGuard`
- [x] Sample repository structure generated under `Categories/`
- [x] Generated category/sub-category/project indexes now include useful content instead of placeholders
- [x] Removed tracked `example.com` placeholder evidence from the active taxonomy/frontend sample layers
- [x] Restored and standardized the canonical root `README.md` entrypoint
- [x] Sync root `README.md` to the current verified `2 categories / 5 sub-categories / 17 ideas` dataset state

### Verified so far
- [x] `python3 scaffolder.py validate`
- [x] `python3 scaffolder.py build taxonomy.json`
- [x] `CI=1 npm run lint` in `web/`
- [x] `npm run build` in `web/`
- [x] Dynamic app routes now compile for:
  - [x] `/ideas/[categorySlug]`
  - [x] `/ideas/[categorySlug]/[subcategorySlug]`
  - [x] `/ideas/[categorySlug]/[subcategorySlug]/[ideaSlug]`
- [x] Compare view now supports real query-driven category filtering and sorting
- [x] Consolidated post-navigation verification pass completed:
  - [x] repo validation passes in partial mode
  - [x] web lint passes
  - [x] web production build passes
- [x] Latest expanded partial dataset also verifies cleanly at:
  - [x] 2 categories
  - [x] 5 sub-categories
  - [x] 17 projects
- [x] `python3 scaffolder.py validate --strict` currently fails **for the expected reason**: the dataset is still intentionally below the final 10 / 100 / 1000 target
  - [x] Current strict-mode counts are `2 categories / 5 sub-categories / 17 projects`

### Still remaining
- [ ] Expand taxonomy from this seed dataset toward the full 10 / 100 / 1000 target
- [ ] Replace weaker market-discovery evidence with stronger direct research where possible
- [ ] Fill blueprint content at scale
- [ ] Pass `python3 scaffolder.py validate --strict` by reaching the full target counts
- [ ] Final QA, accessibility, performance, and release readiness pass

---

## Phase 0 — Product Reset, Scope Lock, and Architecture Direction

> Before building anything further, align the repository around the actual product we want:
> an evidence-backed idea database with a modern exploration UI.

**🎯 Objective:** Replace the current repo-only roadmap with a product-aware roadmap and lock the initial technical direction.

**🔗 Builds on:** Current repository mission in `README.md`, current `PROJECT_TEMPLATE.md`, current `scaffolder.py`.

**🔬 Tasks**
- [x] Confirm the roadmap now covers both:
  - [x] repository/data generation
  - [x] frontend product implementation
- [x] Confirm the initial app stack:
  - [x] Next.js
  - [x] TypeScript
  - [x] Tailwind CSS
  - [x] shadcn/ui
- [x] Decide whether the frontend lives:
  - [ ] at repo root, or
  - [x] in a dedicated `app/` or `web/` directory
- [x] Define the high-level product surface areas:
  - [x] Dashboard / stats overview
  - [x] Category browser
  - [x] Idea explorer
  - [x] Idea detail page
  - [x] Compare / shortlist workflow
  - [x] Mindmap / graph exploration view
- [~] Define what “phase completion” means operationally:
  - [x] code complete
  - [x] docs updated
  - [x] validated locally
  - [ ] pushed to `cline`

**📦 Deliverables**
- Updated `TODO.md`
- Locked initial stack decision
- Agreed product surface list
- Agreed repo layout direction

**✅ Exit Gate**
- [x] `TODO.md` reflects the actual intended product
- [x] Initial stack is explicitly documented
- [x] Product surface areas are clearly named
- [x] Future implementation can proceed without re-deciding scope

**🚢 Push Checkpoint**
- [ ] Commit and push the roadmap reset to the current `cline` branch

---

## Phase 1 — Canonical Idea Schema and Taxonomy Contract

> The UI will only be as good as the structure behind it. Before generating large amounts of content or building views, define the canonical shape of an idea.

**🎯 Objective:** Establish the single source of truth for categories, sub-categories, ideas, research evidence, and execution metadata.

**🔗 Builds on:** Phase 0 stack/layout direction.

**🔬 Tasks**
- [x] Expand the `taxonomy.json` contract beyond name + score + evidence
- [x] Define required fields for **categories**
  - [x] `id`
  - [x] `name`
  - [x] `slug`
  - [x] `thesis`
  - [x] `evidence`
- [x] Define required fields for **sub-categories**
  - [x] `id`
  - [x] `name`
  - [x] `slug`
  - [x] `thesis`
  - [x] `targetMarket`
  - [x] `evidence`
- [x] Define required fields for **ideas/projects**
  - [x] `id`
  - [x] `name`
  - [x] `slug`
  - [x] `pitch`
  - [x] `summary`
  - [x] `problem`
  - [x] `targetUsers`
  - [x] `marketType` (B2B / B2C / prosumer / marketplace / internal tooling etc.)
  - [x] `willingnessToPay`
  - [x] `distributionChannels`
  - [x] `pricingModel`
  - [x] `pricePoint`
  - [x] `validationScore`
  - [x] `buildComplexity`
  - [x] `timeToMvp`
  - [x] `revenueModel`
  - [x] `tags`
  - [x] `status`
  - [x] `evidence`
- [x] Define optional derived fields for product UX
  - [x] `sortingScore`
  - [x] `opportunitySize`
  - [x] `competitionLevel`
  - [x] `aiLeverage`
  - [x] `implementationReadiness`
- [x] Align `PROJECT_TEMPLATE.md` with the canonical schema
- [x] Document what fields are:
  - [x] human-authored
  - [x] research-derived
  - [x] computed for UI/statistics
- [x] Define naming and slugging conventions
- [x] Ensure `scaffolder.py` can evolve from this schema rather than fighting it

**📦 Deliverables**
- Updated canonical taxonomy contract
- Updated project blueprint field list
- Explicit required vs optional field definitions
- Schema decisions documented in the repo

**✅ Exit Gate**
- [x] A single canonical idea schema exists
- [x] Every field in the template maps to structured data
- [x] The schema supports both generation workflows and frontend display
- [x] No critical UI requirement depends on undefined data

**🚢 Push Checkpoint**
- [ ] Commit and push schema contract changes to `cline`

---

## Phase 2 — Research Rubric, Completion Rules, and Blueprint Template Hardening

> Before volume, lock the quality bar. Every idea must be readable, comparable, and expandable.

**🎯 Objective:** Define exactly what it means for an idea to be “valid,” “display-ready,” and “execution-ready.”

**🔗 Builds on:** Phase 1 canonical schema.

**🔬 Tasks**
- [x] Finalize the validation rubric in structured form
  - [x] Demand
  - [x] Willingness to pay
  - [x] Competition gap
  - [x] Feasibility
  - [x] Distribution
- [x] Set the minimum acceptance score
- [x] Define evidence standards
  - [x] dated links required
  - [x] allowed source types
  - [x] competitor and pricing evidence expectations
- [x] Define blueprint completeness states
  - [x] `Idea`
  - [x] `Validated`
  - [x] `Blueprinted`
  - [x] `Ready to Build`
- [x] Upgrade `PROJECT_TEMPLATE.md` so every idea clearly exposes:
  - [x] user group
  - [x] buyer / operator persona
  - [x] price point hypothesis
  - [x] effort / complexity
  - [x] market wedge
  - [x] execution starting point
- [x] Add a “How to Start” section to the blueprint standard
- [x] Add “What to Validate Next” to help users continue fleshing out ideas
- [x] Define which fields must exist before an idea can appear in the UI
- [x] Define which fields are required before an idea can be called “Blueprinted”

**📦 Deliverables**
- Validation rubric and research standard
- Hardened `PROJECT_TEMPLATE.md`
- Clearly defined idea completion statuses
- Display-readiness checklist for ideas

**✅ Exit Gate**
- [x] Every displayed idea has a consistent quality standard
- [x] Template fields support user decision-making, not just documentation
- [x] A reader can understand who the idea is for, why it matters, and how to begin

**🚢 Push Checkpoint**
- [ ] Commit and push rubric/template hardening to `cline`

---

## Phase 3 — Frontend Foundation and Design System Setup

> Build the shell before building the rooms.

**🎯 Objective:** Create the frontend foundation using proven dashboard/application primitives.

**🔗 Builds on:** Phase 2 data and quality contracts.

**🔬 Tasks**
- [x] Scaffold the frontend app in the chosen location
- [x] Set up:
  - [x] TypeScript
  - [x] Tailwind CSS
  - [x] shadcn/ui
  - [x] linting / formatting
- [~] Create the app shell:
  - [ ] top navigation
  - [ ] sidebar navigation
  - [x] responsive layout
  - [x] shared page container
- [~] Establish design tokens and usage rules
  - [x] spacing
  - [x] typography
  - [x] color usage
  - [ ] card/table/chart conventions
- [~] Add shared reusable UI primitives
  - [x] stat cards
  - [x] section headers
  - [ ] filters panel
  - [ ] badges
  - [ ] evidence/source chips
  - [ ] score display
  - [ ] empty/loading/error states
- [x] Decide route structure for the product
- [x] Create placeholder pages for all major surfaces

**📦 Deliverables**
- Running frontend app
- Shared layout and navigation
- Base component system
- Placeholder route structure

**✅ Exit Gate**
- [x] App runs locally without structural errors
- [x] Layout is responsive and reusable
- [~] No major UI work requires rethinking the shell
- [x] Proven component primitives are in place

**🚢 Push Checkpoint**
- [ ] Commit and push frontend foundation to `cline`

---

## Phase 4 — Data Ingestion, Normalization, and View Model Layer

> The UI should consume stable view data, not raw ad hoc files.

**🎯 Objective:** Build the pipeline that transforms repository content into predictable frontend-consumable data.

**🔗 Builds on:** Phase 3 frontend shell and Phase 1–2 schema rules.

**🔬 Tasks**
- [x] Decide how frontend data is loaded initially
  - [x] direct JSON import
  - [ ] generated static data files
  - [ ] build-time normalization script
- [x] Create a normalized frontend data layer for:
  - [x] categories
  - [x] sub-categories
  - [x] ideas
  - [x] tags
  - [x] scores
  - [x] statistics
- [x] Generate derived values for UX
  - [x] idea counts
  - [x] average scores
  - [ ] market breakdowns
  - [x] complexity distribution
  - [ ] pricing distribution
- [~] Create filter/sort definitions
  - [x] by category
  - [x] by sub-category
  - [x] by score
  - [x] by effort
  - [x] by market type
  - [x] by pricing model
  - [x] by readiness/status
- [x] Create seeded example content sufficient for UI development
- [x] Ensure data errors fail loudly instead of silently degrading

**📦 Deliverables**
- Frontend-consumable normalized data layer
- Derived statistics model
- Stable filters/sorts contract
- Seed dataset for development

**✅ Exit Gate**
- [x] UI can render from stable structured data
- [x] Filters and stats are driven by schema, not hardcoded assumptions
- [x] Adding future ideas/categories does not require rewriting views

**🚢 Push Checkpoint**
- [ ] Commit and push ingestion/view-model work to `cline`

---

## Phase 5 — Core Explorer UX: Dashboard, Lists, Cards, Tables, Detail Pages

> Deliver the main browsing experience first: clear, useful, searchable, sortable.

**🎯 Objective:** Ship the primary exploration experience for users who want to quickly find promising ideas.

**🔗 Builds on:** Phase 4 normalized data layer.

**🔬 Tasks**
- [x] Build the **Dashboard** view
  - [x] total ideas
  - [x] category distribution
  - [x] average validation score
  - [x] complexity breakdown
  - [ ] monetization / pricing snapshots
- [~] Build the **Category browser**
  - [x] category cards
  - [x] category detail pages
  - [x] linked sub-category navigation
- [~] Build the **Idea explorer**
  - [x] card view
  - [ ] dense table view
  - [ ] quick search
  - [ ] multi-filter support
  - [ ] multi-sort support
- [x] Build the **Idea detail page**
  - [x] pitch
  - [x] summary
  - [x] target users
  - [ ] market signals
  - [x] price point
  - [x] effort
  - [x] validation score
  - [x] evidence links
  - [ ] how-to-start section
- [ ] Add URL-persisted filter/sort state where sensible
- [x] Add compare / shortlist capability for users evaluating multiple ideas

**📦 Deliverables**
- Dashboard page
- Category and sub-category browsing pages
- Explorer with card and table modes
- Detailed idea page
- Compare / shortlist baseline

**✅ Exit Gate**
- [x] Users can discover and compare ideas without reading raw repo files
- [~] Filters and sorts are genuinely useful
- [~] Detail pages answer “what is this, for whom, why now, how hard, how to start?”
- [x] The main UX is already valuable even with partial data population

**🚢 Push Checkpoint**
- [ ] Commit and push core explorer UX to `cline`

---

## Phase 6 — Advanced Views: Mindmap, Relationship Navigation, and Insight Surfaces

> Once the basic explorer works, add views that help users think, not just search.

**🎯 Objective:** Add richer visualizations for understanding relationships, clusters, and strategic opportunity spaces.

**🔗 Builds on:** Phase 5 core explorer UX.

**🔬 Tasks**
- [x] Build a **mindmap / graph view**
  - [x] categories → sub-categories → ideas
  - [ ] pan/zoom
  - [ ] click-through to detail views
  - [ ] visual differentiation by score/status/complexity
- [x] Build at least one **matrix / strategic view**
  - [x] effort vs opportunity
  - [ ] complexity vs validation
  - [ ] B2B vs B2C vs price positioning
- [~] Add insight surfaces that help prioritization
  - [ ] best low-effort opportunities
  - [ ] highest-priced niches
  - [ ] most research-complete ideas
  - [x] underdeveloped categories
- [ ] Add relationship aids
  - [ ] related ideas
  - [ ] similar niches
  - [ ] adjacent buyer groups
- [~] Ensure these views remain legible on real-world data volumes

**📦 Deliverables**
- Mindmap / graph navigation
- At least one strategic matrix view
- Relationship-based idea recommendations
- Additional statistics / insight surfaces

**✅ Exit Gate**
- [x] Users can move between overview and detail intuitively
- [~] Advanced views reveal something useful beyond the core list/table
- [~] Graph/matrix views support actual prioritization decisions

**🚢 Push Checkpoint**
- [ ] Commit and push advanced exploration views to `cline`

---

## Phase 7 — Controlled Data Population: 10 Categories → 100 Sub-Categories → 1000 Ideas

> Now scale the content using the locked schema, template, and product surfaces already proven by sample data.

**🎯 Objective:** Populate the repository in validated batches without sacrificing consistency or usability.

**🔗 Builds on:** Phase 6 stable product surfaces and Phase 1–2 quality rules.

**🔬 Tasks**
- [~] Populate the **10 categories** with macro theses and evidence
- [~] Populate the **100 sub-categories** with niche theses and evidence
- [~] Populate ideas in controlled batches
  - [x] start with one pilot category
  - [ ] then one full set of 10 sub-categories
  - [ ] then scale category-by-category
- [x] Ensure every idea includes required structured fields
- [x] Run de-duplication across all ideas
- [x] Validate score thresholds before publication into the main dataset
- [x] Generate folders/files from the canonical taxonomy where appropriate
- [x] Keep the UI usable throughout partial-population states
- [x] Update indexes and statistics continuously as the dataset grows

**📦 Deliverables**
- Populated taxonomy across categories/sub-categories/ideas
- Research-backed evidence entries
- Generated repo structure aligned to the dataset
- No major mismatch between structured data and blueprint files

**✅ Exit Gate**
- [ ] Exactly 10 categories exist
- [ ] Exactly 100 sub-categories exist
- [~] Idea population is on track toward 1000 without schema drift
- [x] No displayed idea violates the minimum quality bar
- [x] Data and UI stay in sync

**🚢 Push Checkpoint**
- [ ] Commit and push each completed population batch to `cline`
- [ ] Commit and push again when the full 10/100/1000 target is reached

---

## Phase 8 — Blueprint Completion and Execution Guidance at Scale

> A list of ideas is useful; a list of ideas with concrete “what next?” guidance is much more valuable.

**🎯 Objective:** Bring ideas from “visible in the product” to “actionable as blueprints.”

**🔗 Builds on:** Phase 7 populated dataset.

**🔬 Tasks**
- [~] Complete idea blueprints category-by-category
- [~] Ensure each idea has:
  - [x] problem statement
  - [x] target audience
  - [x] evidence-backed profitability logic
  - [~] competitor landscape
  - [x] monetization strategy
  - [~] recommended stack
  - [x] MVP scope
  - [x] key risks
  - [x] how-to-start guidance
- [~] Flesh out linked `docs/` where appropriate
- [x] Flesh out linked `todo/` execution phases
- [x] Mark blueprint completeness in structured data
- [ ] Surface blueprint readiness inside the UI
- [~] Identify ideas needing more research vs ideas ready to build

**📦 Deliverables**
- Actionable blueprint content at scale
- Completion-status metadata
- UI support for identifying ready-to-build ideas

**✅ Exit Gate**
- [~] Users can not only browse ideas, but act on them
- [~] Blueprinted ideas expose enough detail to start execution
- [x] Completion status is visible and honest

**🚢 Push Checkpoint**
- [ ] Commit and push each completed blueprint batch to `cline`

---

## Phase 9 — QA, Accessibility, Performance, and Release Readiness

> Finish by making the product trustworthy, fast, and shippable.

**🎯 Objective:** Validate structure, UX quality, and release readiness across both the repository and the app.

**🔗 Builds on:** Phase 8 completed product + content system.

**🔬 Tasks**
- [~] Validate counts and structure
- [~] Validate internal links between repo artifacts
- [x] Validate frontend routes and rendering
- [ ] Test filter/sort/search behavior
- [~] Test graph/mindmap usability
- [ ] Review responsive behavior
- [ ] Review accessibility
  - [ ] keyboard navigation
  - [ ] contrast
  - [ ] semantic headings/labels
- [~] Review performance
  - [x] large list rendering
  - [ ] chart rendering
  - [ ] graph rendering
  - [x] build-time data generation
- [~] Spot-check idea quality across categories
- [ ] Finalize README and release instructions

**📦 Deliverables**
- Verified structure
- QA pass notes
- Release-ready README and app
- Clean publishable state

**✅ Exit Gate**
- [ ] Data counts and hierarchy are correct
- [x] Core UX works on realistic data
- [ ] Accessibility and performance are acceptable
- [ ] Repo and product are both ready to publish/use

**🚢 Push Checkpoint**
- [ ] Commit and push the release-ready state to `cline`

---

## Suggested implementation cadence

To keep work small and reviewable, prefer this rhythm inside every phase:

1. Define or adjust the contract
2. Implement the smallest useful slice
3. Validate locally
4. Update docs
5. Commit
6. Push `cline`

---

## What should happen next

The next practical implementation order from the **current** state is:

1. **Phase 7 expansion** — keep growing from the current seed dataset of 2 categories / 5 sub-categories / 17 ideas using real research
2. **Phase 5/6 refinement** — add stronger filter/sort explorer behavior on top of the now-complete route-level browsing flow
3. **Phase 8 refinement** — improve generated blueprint richness and surface readiness more clearly in the UI
4. **Phase 9** — accessibility, performance, and final release checks
5. **Final strict gate** — `python3 scaffolder.py validate --strict` has already been tested and currently fails as expected; return to it only after the full 10/100/1000 target exists

Everything after this point should build on the existing verified slices instead of restarting any foundation work.