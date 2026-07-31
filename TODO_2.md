# TODO_2 — Samuel-First Research Backend Roadmap

This file is the active roadmap for the next system we want to build.

It replaces the idea of continuing to run the old research workflow manually across many ideas.

From this point forward, the priority is:

1. build the data-gathering backend first
2. build the data-processing backend second
3. test the backend by using Samuel Rondot's style of sourcing and filtering to produce 3 real project ideas
4. build a new UI around that backend and those outputs
5. analyze the DNA of the 3 successful candidates to learn how to generate more ideas
6. use the old deeper method only afterward, and only as a verification layer on shortlisted ideas

The old method is no longer the default discovery workflow.

---

## Strategic decision

We are not going to keep running the old method manually for broad idea generation.

The old method is too expensive in time and tokens to be the front door.

Samuel Rondot's method is better suited for the first stage because it is faster at locating real, already-working opportunities using visible winners, traction proof, simple product shapes, and replicable acquisition paths.

So the system we build now should be designed around Samuel-style sourcing and first-pass triage.

The deeper evidence-heavy method still matters, but only later.

Its new role is:

- verify shortlisted ideas more deeply
- gather stronger quantitative support after candidate selection
- strengthen the final explanation of why a given idea is profitable

It is no longer the thing we run first on everything.

---

## Product goal

Build a backend-driven research product that can:

1. collect the best available source data for Samuel-style idea discovery
2. process that data into structured evidence and candidate dossiers
3. rank and explain candidate ideas well enough to surface 3 strong project ideas
4. present those ideas in a much better UI built on the same general stack direction we already chose
5. later support deeper verification of those shortlisted ideas using the older, more quantitative validation workflow

This means the product should become an evidence engine first and a browsing UI second.

---

## What the system must do first

Before we think about scaling to many categories or many ideas, the system must prove it can do one thing well:

- use Samuel-style research logic to discover 3 real project ideas from high-quality sources

If it cannot do that, everything else is premature.

So the first major milestone is not:

- expand the dataset broadly

The first major milestone is:

- build the backend and use it to produce 3 concrete idea outputs we trust enough to study further

---

## Samuel-first operating model

The backend should be designed around these first-pass questions:

1. What product already exists and clearly works?
2. What evidence shows it works?
3. How does it appear to acquire customers?
4. Does the demand look real rather than purely bought by huge spend?
5. Is the product simple enough to build and maintain?
6. What wedge or improvement opportunity exists?
7. Is this a good candidate for a solo or small-team AI-assisted build?

That is the heart of the initial discovery backend.

---

## Source strategy

We should not use many mediocre sources.

We should use the best source types available for this specific workflow.

The source system should prioritize sources that help answer Samuel-style questions directly.

## Priority source classes

### 1. Public founder proof

Purpose:

- detect live proof that a product category or product instance makes money or has meaningful traction

Examples:

- build-in-public posts
- public MRR or Stripe screenshots
- founder breakdowns
- interview transcripts

### 2. Competitor pricing pages

Purpose:

- anchor willingness to pay and packaging reality

### 3. Traffic and acquisition signals

Purpose:

- understand whether the growth path looks replicable

Examples:

- SEO footprint indicators
- ad-library presence if visible
- content-channel evidence
- affiliate or referral evidence

### 4. Review and complaint sources

Purpose:

- identify wedge opportunities and real user frustration

### 5. Marketplace and ecosystem counts

Purpose:

- identify crowded but active markets and validate that a niche is commercially alive

### 6. Community discussion sources

Purpose:

- identify pain, repeat problems, recurring buyer behavior, and underserved segments

## Source-selection rule

Every source class we adopt should answer at least one of these:

- does this prove traction?
- does this prove willingness to pay?
- does this reveal acquisition?
- does this reveal simplicity or complexity?
- does this reveal wedge opportunities?

If a source does not help answer one of those, it should not be in the first backend.

---

## Backend architecture

The backend should have four core layers.

## Layer 1: Source registry

This is the approved source catalog.

Each source definition should include:

- source name
- source class
- why it matters for Samuel-style discovery
- collection method
- freshness expectations
- data fields expected from it
- what decision dimensions it supports

## Layer 2: Raw ingestion

This layer fetches and stores raw source material with provenance.

Store:

- URL
- timestamp
- raw text or structured response snapshot
- collector metadata
- parser metadata
- fetch outcome

Rule:

- raw evidence must exist before any synthesis or scoring

## Layer 3: Evidence normalization

This layer converts raw inputs into standardized evidence records.

Each evidence record should capture:

- entity hint
- source type
- claim type supported
- extracted metric
- extracted date
- extraction confidence
- notes about what this evidence means

## Layer 4: Candidate synthesis

This layer groups evidence into candidate idea dossiers.

Each candidate dossier should contain:

- niche label
- comparable product set
- traction proof summary
- pricing proof summary
- acquisition-path summary
- complexity or maintainability notes
- wedge hypotheses
- first-pass Samuel-style score
- recommendation status

---

## Storage design

We need storage that is easy to process, reprocess, inspect, and later feed into a UI.

## 1. Source registry

Suggested path:

- `data/source-registry/*.json`

Purpose:

- define what the backend is allowed to gather and why

## 2. Raw evidence

Suggested path:

- `data/evidence/raw/YYYY-MM-DD/<source>/<id>.json`

Suggested shape:

```json
{
  "id": "raw_ev_001",
  "sourceName": "Founder post",
  "sourceClass": "public-founder-proof",
  "url": "https://example.com/post",
  "fetchedAt": "2026-07-29T12:00:00Z",
  "collector": "collector-v1",
  "contentType": "text/html",
  "rawTextPath": "data/evidence/raw/2026-07-29/public-founder-proof/raw_ev_001.txt",
  "metadata": {
    "supports": ["traction", "willingness-to-pay"],
    "entityHint": "candidate_video-automation_01"
  }
}
```

## 3. Normalized evidence

Suggested path:

- `data/evidence/normalized/YYYY-MM-DD/*.json`

Suggested shape:

```json
{
  "id": "ev_norm_001",
  "entityType": "candidate",
  "entityId": "candidate_video-automation_01",
  "sourceClass": "public-founder-proof",
  "supports": ["traction", "willingness-to-pay"],
  "title": "Founder revenue proof",
  "url": "https://example.com/post",
  "accessedOn": "2026-07-29",
  "claim": "This product category shows public proof of monetization",
  "metric": "$12K MRR screenshot",
  "metricValue": 12000,
  "metricUnit": "usd_mrr",
  "extractionConfidence": 0.93,
  "assumption": false,
  "notes": "useful for first-pass Samuel-style traction validation"
}
```

## 4. Candidate dossiers

Suggested path:

- `data/candidates/<candidate-id>.json`

Suggested contents:

- comparable winners
- traction evidence references
- acquisition evidence references
- pricing evidence references
- complexity notes
- wedge ideas
- Samuel-style score
- promotion decision

## 5. Verified idea dossiers

Suggested path:

- `data/verified/<idea-id>.json`

Purpose:

- later-stage output where the old deeper method has been applied to a shortlisted idea

Important:

- this is downstream, not part of the first backend milestone

---

## What the backend must prove before UI work begins

The backend must successfully produce 3 real project ideas using Samuel-style discovery logic.

For each of the 3 ideas, it should be able to show:

1. the existing winners or proof sources behind the idea
2. the traction signals used
3. the pricing or monetization anchors used
4. the acquisition clues used
5. the reason the product seems simple enough or manageable enough
6. the proposed wedge or improvement angle
7. the reason the candidate was promoted

If the backend cannot produce these 3 outputs convincingly, UI work should wait.

---

## New sequence of work

This is now the intended execution order.

## Phase A — Define the source system

Objective:

- identify the best Samuel-style sources and define exactly what each one is for

Tasks:

- [x] define priority source classes
- [x] choose the best source families in each class
- [x] document what each source can prove
- [x] define freshness rules
- [x] define collection rules and limits

Exit gate:

- [x] we have a source registry that clearly explains what data we want and why

## Phase B — Define the storage and evidence contracts

Objective:

- define exactly how raw evidence, normalized evidence, and candidate dossiers are stored

Tasks:

- [x] finalize raw evidence schema
- [x] finalize normalized evidence schema
- [x] finalize candidate dossier schema
- [x] define traceability links between them
- [x] define confidence and uncertainty fields

Exit gate:

- [x] the backend has a stable data contract before implementation begins

## Phase C — Build the data-gathering backend

Objective:

- build the collection layer for fetching and storing raw source material

Tasks:

- [x] implement source registry loading
- [x] implement raw fetch jobs
- [x] implement raw snapshot storage
- [x] implement provenance tracking
- [x] implement deduplication and retry behavior

Exit gate:

- [x] the system can repeatedly gather raw source data from approved sources

## Phase D — Build the data-processing backend

Objective:

- extract and normalize the fields needed for Samuel-style triage

Tasks:

- [x] extract metrics, counts, prices, dates, and entity hints
- [x] classify evidence by support dimension
- [x] attach confidence and notes
- [x] build normalized evidence output
- [x] group evidence into candidate dossiers

Exit gate:

- [x] the system can turn raw source material into structured candidate-ready evidence

## Phase E — Test the backend by finding 3 project ideas

Objective:

- prove the backend is useful by producing 3 strong project ideas using Samuel's method

Tasks:

- [x] run the backend on selected source pools
- [x] shortlist candidate ideas
- [x] review the candidate dossiers
- [x] promote 3 real project ideas
- [x] document exactly why each one was selected

Exit gate:

- [x] we have 3 project ideas that are convincing enough to study and build around

## Phase F — Build the Deep Lane engine

Objective:

- expand promoted candidates with broader evidence coverage

Tasks:

- [x] Expand promoted candidates with broader evidence coverage
- [x] Score them against the canonical rubric
- [x] Generate project-ready blueprint drafts
- [x] Attach explicit unknowns and next-validation steps

Exit gate:

- [x] Promoted candidates can graduate into repo-grade canonical records

## Phase G — Upgrade the UI into an analyst console

Objective:

- create a better UI using the same general stack direction but with a layout designed for backend-produced evidence and candidate dossiers

Tasks:

- [x] Add evidence-inspection views
- [x] Add candidate triage and compare screens
- [x] Add provenance-aware detail pages
- [x] Add promote/reject workflow states
- [x] Add execution-readiness and profitability explanation panels

Exit gate:

- [x] A user can understand the full reasoning chain behind any candidate or idea

---

## Hard rules for this roadmap

### Rule 1: No more broad manual execution of the old method

We are not going back to manually doing deep validation across large numbers of ideas as the default workflow.

### Rule 2: Backend first

The evidence backend must be built and tested before major new UI work.

### Rule 3: Source quality over source quantity

Prefer the best sources that answer Samuel-style questions clearly.

### Rule 4: Raw evidence before synthesis

No LLM summary should exist without stored raw evidence behind it.

### Rule 5: 3 real ideas before scale

The backend must prove itself on 3 real ideas before we worry about broader idea generation at scale.

### Rule 6: Old method becomes verification-only

The old workflow is retained, but only for strengthening and verifying shortlisted ideas.

---

## Final operating model

The intended operating model is now:

1. backend collects high-quality Samuel-style evidence
2. backend processes that evidence into candidate dossiers
3. backend surfaces 3 strong project ideas
4. product UI is built around those outputs
5. idea DNA is analyzed from the successful candidates
6. deeper old-method validation is applied afterward to the shortlisted ideas only

That is the actual order of work now.

- finding build-worthy app candidates inside already-proven markets

It is not better than ours for the full repository mission:

- building a canonical, evidence-backed, reusable database of profitable ideas

So the correct move is not to switch from our method to his method.

The correct move is to create a **split workflow**:

1. **Fast Lane** for quick candidate discovery and triage
2. **Deep Lane** for canonical validation and blueprint generation

Then automate as much of both lanes as possible.

---

## Product thesis for the automation layer

We should build a backend that can do four jobs reliably:

1. gather evidence from approved sources
2. normalize that evidence into a consistent machine-readable format
3. synthesize it into candidate ideas, scores, and rationale
4. feed a UI where a human can understand exactly why an idea looks profitable and what would need to happen next

The LLM should not be the source of truth.

The source of truth should be:

- raw collected evidence
- normalized evidence records
- explicit scoring logic
- traceable synthesis notes

The LLM should help with:

- extraction
- summarization
- clustering
- explanation
- drafting blueprints

But not with inventing unsupported market claims.

---

## Why this roadmap is necessary

The current workflow has three scaling limits.

### 1. It is too manual for 10 -> 100 -> 1000 at high evidence quality

The current standard is correct, but hand-collecting quantifiable, dated evidence at each level is slow.

### 2. It spends LLM time on work that could become deterministic

Much of the current effort is spent on tasks that are at least partly automatable:

- fetching source pages
- extracting numbers, dates, and pricing
- classifying evidence type
- producing normalized storage records
- generating first-pass comparison tables

### 3. It lacks a formal system boundary between research and presentation

Right now, the repository contains the output, but not yet a clearly defined research engine behind the output.

That should change.

---

## The proposed split workflow

## Track 1: Fast Lane

Purpose:

- find promising idea candidates quickly
- reduce token burn on low-quality ideas
- decide whether something deserves deeper validation

Inputs:

- public founder proof
- competitor pricing pages
- traffic/acquisition signals
- marketplace counts
- review complaints
- community discussions

Output:

- candidate idea dossiers
- fast triage score
- recommendation: reject, watchlist, or promote to Deep Lane

Best use cases:

- idea-level discovery
- cloneable/proven-winner analysis
- quick ranking inside known categories

This is where Samuel's approach fits best.

## Track 2: Deep Lane

Purpose:

- produce canonical repo entries
- satisfy the evidence contract in [docs/RESEARCH_STANDARD.md](/Users/terrygoleman/Documents/dev/1000-Profitable-Ideas-Repo/docs/RESEARCH_STANDARD.md)
- produce reusable blueprints and trustworthy scores

Inputs:

- promoted candidate dossier from Fast Lane
- broader cross-source validation
- more rigorous niche and competition evidence
- explicit uncertainty tracking

Output:

- category/sub-category/project records fit for the canonical dataset
- blueprint-ready idea pages
- validation score with traceable support

Best use cases:

- final inclusion in taxonomy
- public-facing ranking and filtering
- execution-ready project understanding

---

## High-level system design

The automation system should have five layers.

## Layer 1: Source registry

This is the approved list of evidence sources and source types.

Examples:

- competitor pricing pages
- app marketplaces
- review sites
- founder build-in-public posts
- public traffic estimators or SEO signals
- job boards
- public communities
- regulatory or government pages where relevant

Each source definition should include:

- source name
- source type
- collection method
- freshness expectations
- what claims it can support
- reliability notes

## Layer 2: Raw ingestion

This layer fetches and stores raw source material before any interpretation.

Store:

- raw URL
- fetched timestamp
- raw HTML or extracted text snapshot
- parser used
- collection job metadata

Goal:

- never lose the original evidence
- let parsing improve later without needing to rediscover the source

## Layer 3: Evidence normalization

This layer converts raw material into structured evidence objects.

Each normalized record should answer:

- what is the claim?
- what metric supports it?
- what source supports it?
- what evidence type is it?
- what entity does it belong to?
- how fresh is it?
- how confident is the extraction?

## Layer 4: Synthesis and scoring

This layer groups evidence into:

- niches
- candidate ideas
- comparable products
- wedges
- score explanations

This is where LLM assistance is useful, but it must work from normalized evidence records rather than from memory.

## Layer 5: UI and analyst workflow

This layer lets a human:

- inspect raw proof
- see normalized evidence
- see score explanations
- compare candidates
- promote or reject ideas
- understand why an idea is profitable and what to build first

---

## Storage design

We need a storage strategy that preserves provenance and supports automated processing.

Recommended data split:

### 1. Source registry

Suggested path:

- `data/source-registry/*.json`

Purpose:

- canonical configuration for where data comes from and how to treat it

### 2. Raw evidence snapshots

Suggested path:

- `data/evidence/raw/YYYY-MM-DD/<source>/<hash>.json`

Suggested record shape:

```json
{
  "id": "raw_ev_001",
  "sourceName": "UpGuard pricing",
  "sourceType": "competitor-pricing",
  "url": "https://example.com/pricing",
  "fetchedAt": "2026-07-29T12:00:00Z",
  "collector": "fetch_webpage-v1",
  "httpStatus": 200,
  "contentType": "text/html",
  "rawTextPath": "data/evidence/raw/2026-07-29/competitor-pricing/raw_ev_001.txt",
  "metadata": {
    "entityHint": "vendor-risk-software",
    "notes": "supports pricing and packaging comparison"
  }
}
```

### 3. Normalized evidence records

Suggested path:

- `data/evidence/normalized/YYYY-MM-DD/*.json`

Suggested record shape:

```json
{
  "id": "ev_norm_001",
  "entityType": "idea-candidate",
  "entityId": "candidate_vendorpilot_clone_01",
  "supports": ["willingness-to-pay", "competition", "distribution"],
  "sourceType": "competitor-pricing",
  "title": "Vendor risk product pricing page",
  "url": "https://example.com/pricing",
  "accessedOn": "2026-07-29",
  "metric": "$199/month entry plan",
  "metricValue": 199,
  "metricUnit": "usd_per_month",
  "claim": "Customers in this niche are offered software at a meaningful recurring price point",
  "extractionConfidence": 0.94,
  "assumption": false,
  "notes": "supports willingness to pay baseline"
}
```

### 4. Candidate dossiers

Suggested path:

- `data/candidates/<candidate-id>.json`

Purpose:

- one machine-readable file per idea candidate in Fast Lane

Suggested contents:

- problem summary
- niche label
- comparable products
- evidence references
- wedge hypotheses
- acquisition notes
- fast-lane score
- promotion status

### 5. Canonical project records

These remain aligned to current taxonomy and blueprint structures after Deep Lane promotion.

---

## What we should automate first

Order matters. Start where the work is repetitive and deterministic.

## Automation phase A: approved-source inventory

Objective:

- define where we trust data from before building collectors

Tasks:

- create source classes
- define what each source can support
- define freshness rules
- define collection limits

Deliverable:

- a source registry file or directory

## Automation phase B: raw fetch backend

Objective:

- collect and store raw evidence reproducibly

Tasks:

- implement fetch jobs
- save snapshots with timestamps
- record failures and retries
- deduplicate by URL + content hash

Deliverable:

- raw evidence archive

## Automation phase C: evidence extraction backend

Objective:

- turn raw pages into normalized evidence objects

Tasks:

- extract pricing
- extract counts and metrics
- extract dates
- classify source type
- attach entity hints and support dimensions

Deliverable:

- normalized evidence records

## Automation phase D: fast-lane candidate engine

Objective:

- use Samuel-style logic to identify promising idea candidates quickly

Tasks:

- group evidence around comparable products
- compute simple triage signals
- infer wedge opportunities from complaints and gaps
- flag replicable acquisition signals
- label maintainability level

Deliverable:

- candidate dossiers with promote/reject/watchlist recommendation

## Automation phase E: deep-lane validation engine

Objective:

- expand promoted candidates into canonical repo-grade records

Tasks:

- collect broader source coverage
- fill evidence dimensions required by the rubric
- compute explanation-backed scores
- emit project blueprint drafts

Deliverable:

- repo-ready structured idea records

## Automation phase F: analyst UI

Objective:

- make all of this navigable and trustworthy

Tasks:

- source browser
- evidence browser
- candidate comparison view
- promote/reject controls
- rationale and source trace view
- blueprint preview view

Deliverable:

- a serious operator UI, not just a static idea gallery

---

## Exact research questions the backend must answer

For every idea candidate, the system should be able to answer:

1. What market or niche is this in?
2. What observable pain or need exists?
3. What quantifiable evidence supports demand?
4. What quantifiable evidence supports willingness to pay?
5. What products already prove this market works?
6. How do those products acquire users?
7. What wedge or gap exists?
8. How complex does the product appear to build and maintain?
9. Why is this likely profitable?
10. What evidence is still missing?

If the backend cannot answer these from stored evidence, the workflow is incomplete.

---

## What the UI should eventually show

The current UI is good as a browse layer. The upgraded UI should become an operator console.

Each idea or candidate page should expose:

- the thesis in one clear paragraph
- the evidence stack behind the thesis
- why the market pays
- comparable products
- price anchors
- distribution path
- wedge opportunity
- build complexity and maintenance burden
- what to validate next
- why the idea is profitable if executed well

This is the standard the product should move toward.

---

## Rules for automation

These rules must remain hard requirements.

### Rule 1: Raw evidence first

Never store only the summary. Store the raw fetch result first.

### Rule 2: Evidence before synthesis

The synthesis layer can only operate on collected evidence, never on freeform model recall.

### Rule 3: Every claim must remain traceable

Every major conclusion in a candidate dossier or project page should map back to one or more normalized evidence records.

### Rule 4: Fast Lane cannot publish canon directly

Fast Lane produces candidate ideas and triage. Deep Lane decides canonical inclusion.

### Rule 5: Human review remains part of the loop

Even with automation, we should still review promoted candidates before they become canonical records.

---

## Suggested roadmap phases

## Phase A — Define the source system

- [ ] Enumerate approved source classes
- [ ] Define what each source class can support
- [ ] Define freshness rules by source type
- [ ] Define legal and practical collection constraints
- [ ] Define raw snapshot storage contract

Exit gate:

- [ ] We can explain exactly what sources the backend will use and why

## Phase B — Define the evidence schema

- [ ] Finalize raw evidence record format
- [ ] Finalize normalized evidence record format
- [ ] Finalize candidate dossier format
- [ ] Define links from candidate dossiers to canonical taxonomy records
- [ ] Define uncertainty and confidence fields

Exit gate:

- [ ] We have a stable storage design that supports both automation and UI use

## Phase C — Build the ingestion backend

- [ ] Implement repeatable fetch jobs
- [ ] Save raw snapshots with provenance
- [ ] Add deduplication and retry handling
- [ ] Add per-source parser hooks

Exit gate:

- [ ] We can collect and persist evidence without the UI

## Phase D — Build the normalization backend

- [ ] Extract metrics, dates, prices, and counts from raw sources
- [ ] Tag support dimensions such as demand and willingness-to-pay
- [ ] Attach confidence and source classification
- [ ] Emit normalized evidence records

Exit gate:

- [ ] A machine process can turn raw source material into structured evidence reliably

## Phase E — Build the Fast Lane engine

- [ ] Encode Samuel-style triage logic
- [ ] Add comparable-product clustering
- [ ] Add acquisition replicability notes
- [ ] Add maintainability and wedge fields
- [ ] Emit candidate dossiers

Exit gate:

- [ ] We can shortlist strong candidates quickly from live-market proof

## Phase F — Build the Deep Lane engine

- [ ] Expand promoted candidates with broader evidence coverage
- [ ] Score them against the canonical rubric
- [ ] Generate project-ready blueprint drafts
- [ ] Attach explicit unknowns and next-validation steps

Exit gate:

- [ ] Promoted candidates can graduate into repo-grade canonical records

## Phase G — Upgrade the UI into an analyst console

- [ ] Add evidence-inspection views
- [ ] Add candidate triage and compare screens
- [ ] Add provenance-aware detail pages
- [ ] Add promote/reject workflow states
- [ ] Add execution-readiness and profitability explanation panels

Exit gate:

- [ ] A user can understand the full reasoning chain behind any candidate or idea

---

## Recommended sequencing decision

We should not start by automating everything.

The correct order is:

1. define sources
2. define schemas
3. build raw collection
4. build normalization
5. build fast-lane triage
6. build deep-lane promotion
7. build the analyst UI around those artifacts

If we skip that order, we will build a UI without a trustworthy backend, or a backend without a stable contract.

---

## Final decision for operating model

Going forward, the repository should support two research modes:

### Mode 1: Fast candidate mode

Use when:

- screening many ideas quickly
- identifying proven-winner-derived opportunities
- deciding whether to spend more research effort

### Mode 2: Canonical validation mode

Use when:

- promoting an idea into the actual taxonomy
- generating durable blueprints
- exposing ideas in the final product as trusted records

This is the main strategy shift.

Not "manual vs automated."

Instead:

- automated where possible
- rigorous where necessary
- fast first, deep second
