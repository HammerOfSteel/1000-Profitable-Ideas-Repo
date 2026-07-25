# 🗺️ The 1,000 Profitable Projects — Meta-Roadmap

This is the master build plan for **generating the repository itself** (not for building any single
project inside it). It is designed so you can execute **strictly phase-by-phase**: each phase consumes
the verified output of the previous one and cannot start until the prior **Exit Gate** passes.

## How to read this roadmap
- **🎯 Objective** — the single outcome of the phase.
- **🔗 Builds on** — what verified input this phase requires from the previous phase.
- **🔬 Tasks (research-first)** — do the research *before* writing folders/files.
- **📦 Deliverables** — concrete artifacts produced.
- **✅ Exit Gate (Definition of Done)** — must ALL be true before moving on. Enforced by
  `python scaffolder.py validate` where possible.

**Golden rule:** Nothing enters the repo on intuition. Every category, sub-category, and idea must
pass the **Validation Rubric** (defined in Phase 0) with a linked, dated evidence trail.

**Single source of truth:** `taxonomy.json` holds the entire 10 → 100 → 1,000 hierarchy as data.
Every phase adds one layer to it, and the scaffolder generates the file tree *from* it — so counts
and structure are always reproducible and verifiable.

---

## Phase 0 — Foundation & Methodology
> Lock the rules of the game before generating anything. This is the phase most "idea list" projects
> skip, and it's why they drift into unvalidated guesses. We define *how* an idea qualifies here.

**🎯 Objective:** A working scaffolding toolchain plus a written, objective standard for what counts
as "profitable and validated," so every later phase is consistent and auditable.

**🔬 Tasks**
- [ ] Initialize the root directory and Git version control.
- [ ] Add the fully fleshed-out root `README.md` (master index + methodology).
- [ ] Finalize `PROJECT_TEMPLATE.md` as the canonical blueprint layout for all 1,000 ideas.
- [ ] Confirm `scaffolder.py` runs: `init`, `build <taxonomy.json>`, and `validate` commands.
- [ ] **Define the Validation Rubric** in `docs/VALIDATION_RUBRIC.md`. Score each idea 0–100 across
      weighted criteria, e.g.:
  - [ ] **Demand** (search volume / active communities / recurring pain) — 25 pts
  - [ ] **Willingness to Pay** (people already pay agencies/tools/manual labor) — 25 pts
  - [ ] **Competition Gap** (weak, overpriced, or missing incumbents) — 20 pts
  - [ ] **Build Feasibility** (shippable MVP by a solo AI-assisted dev) — 20 pts
  - [ ] **Distribution** (a reachable, existing channel to the audience) — 10 pts
  - [ ] Set the **minimum passing score** (recommended: **≥ 70/100**) an idea must hit to be included.
- [ ] **Define the Research Standard** in `docs/RESEARCH_STANDARD.md`: every claim needs a dated
      source link; list allowed evidence types (search-trend data, competitor pricing/reviews,
      marketplace/API growth, comparable indie-hacker revenue).
- [ ] **Define `taxonomy.json` schema** (see below) and naming conventions (folder = `NN-Name`,
      projects = `Project-NNN-Name`, ASCII, underscores for spaces).
- [ ] Create the primary parent `Categories/` directory.

**📦 Deliverables:** `README.md`, `PROJECT_TEMPLATE.md`, working `scaffolder.py`,
`docs/VALIDATION_RUBRIC.md`, `docs/RESEARCH_STANDARD.md`, empty `taxonomy.json` skeleton, `Categories/`.

**`taxonomy.json` schema (the spine of the whole repo):**
```jsonc
{
  "categories": [
    {
      "id": 1, "name": "Category Name", "thesis": "one-line macro rationale",
      "subcategories": [
        {
          "id": 1, "name": "Sub Name", "thesis": "why this niche is profitable",
          "projects": [
            { "id": 1, "name": "Project Name", "pitch": "one-liner", "score": 0, "evidence": [] }
          ]
        }
      ]
    }
  ]
}
```

**✅ Exit Gate**
- [ ] `python scaffolder.py init` and `python scaffolder.py validate` both run without error.
- [ ] Validation Rubric + Research Standard are written, with a defined minimum passing score.
- [ ] `taxonomy.json` exists and validates against the agreed schema (empty layers are OK).
- [ ] Everything committed to Git.

---

## Phase 1 — Macro Strategy (The 10 Categories)
> Choose the 10 broad markets. Get these wrong and everything downstream inherits the mistake, so
> each category needs an explicit macro thesis, not a vibe.

**🎯 Objective:** Ten locked, non-overlapping master categories, each justified by a macro trend.

**🔗 Builds on:** Phase 0's rubric, research standard, and `taxonomy.json` schema.

**🔬 Tasks**
- [ ] Research macro-economic trends, persistent software needs, and current AI capabilities.
- [ ] Draft a **candidate list of 15–20 categories**, each with a one-line thesis + supporting link.
- [ ] Score/rank candidates for market size, durability, and solo-dev addressability.
- [ ] **Lock the top 10.** Verify they are broad, distinct, and collectively cover the opportunity space
      without heavy overlap.
- [ ] Write each category's `thesis` into the `categories[]` layer of `taxonomy.json`.
- [ ] Run `python scaffolder.py build taxonomy.json` to generate `Categories/NN-Name/` folders.
- [ ] Draft each category `README.md` (thesis + placeholder index for its 10 sub-categories).
- [ ] Update the root `README.md` Top-10 index with the real category names.

**📦 Deliverables:** 10 category folders + `README.md` files; `taxonomy.json` category layer populated;
root index updated.

**✅ Exit Gate**
- [ ] Exactly **10** categories exist in both `taxonomy.json` and `Categories/` (validated by scaffolder).
- [ ] Each category has a written macro thesis with at least one dated source link.
- [ ] No two categories substantially overlap; root README index reflects them.

---

## Phase 2 — Meso Segmentation (The 100 Sub-Categories)
> Turn each broad market into 10 concrete, profitable niches. This is where "a category" becomes
> "a place a solo dev could actually win."

**🎯 Objective:** Exactly 100 distinct, profitable sub-categories (10 per category).

**🔗 Builds on:** The 10 locked categories and their theses from Phase 1.

**🔬 Tasks**
- [ ] For each category, research 10 profitable sub-niches (specific workflows, industries, or buyer
      segments) — each with a one-line profitability thesis + evidence link.
- [ ] Enforce distinctness: no duplicate or near-duplicate sub-categories **within or across** categories.
- [ ] Verify the segmentation yields **exactly 100** sub-categories total.
- [ ] Write the `subcategories[]` layer into `taxonomy.json` under each category.
- [ ] Run `python scaffolder.py build taxonomy.json` to generate the sub-category folders.
- [ ] Draft each sub-category `README.md` (thesis + placeholder index for its 10 projects).
- [ ] Update each category `README.md` to link its 10 sub-categories.

**📦 Deliverables:** 100 sub-category folders + `README.md` files; `taxonomy.json` sub-category layer
populated; category indexes linked.

**✅ Exit Gate**
- [ ] Scaffolder validates **exactly 100** sub-categories (10 under every category).
- [ ] Every sub-category has a profitability thesis + at least one dated source.
- [ ] No duplicates; every category README links all 10 of its sub-categories.

---

## Phase 3 — Micro Ideation (The 1,000 Projects)
> Generate the actual ideas — and score every one. An idea that can't clear the rubric does not get a
> folder. This is the phase that guarantees "evidence-based profitable," not "1,000 random ideas."

**🎯 Objective:** Exactly 1,000 unique project ideas (10 per sub-category), each scoring ≥ the
Phase 0 minimum on the Validation Rubric.

**🔗 Builds on:** The 100 sub-categories from Phase 2 and the rubric from Phase 0.

**🔬 Tasks**
- [ ] For each sub-category, generate 10 specific project ideas (name + one-liner pitch).
- [ ] **Score every idea** against the Validation Rubric; record the `score` and the `evidence[]`
      (dated links) in `taxonomy.json`. Discard/replace any idea below the minimum score.
- [ ] Run a **global de-duplication pass** — no idea should be a near-clone of another across the 1,000.
- [ ] Verify the grand total is **exactly 1,000** and that all pass the minimum score.
- [ ] Run `python scaffolder.py build taxonomy.json` to generate every
      `Project-NNN-Name/` folder (with empty `docs/` and `todo/`).
- [ ] Update each sub-category `README.md` to link its 10 projects with pitch + score.

**📦 Deliverables:** 1,000 project folders (each with `README.md` stub, `docs/`, `todo/`);
`taxonomy.json` project layer fully populated with scores + evidence; sub-category indexes linked.

**✅ Exit Gate**
- [ ] Scaffolder validates **exactly 1,000** projects (10 under every sub-category).
- [ ] Every project has `score ≥ minimum` and at least one dated evidence link in `taxonomy.json`.
- [ ] Global de-dup pass complete; every sub-category README lists its 10 projects.

---

## Phase 4 — Blueprint Generation (Documentation & Workflows)
> Now that the 1,000 validated ideas exist as data, turn each into a complete, buildable blueprint.
> This is the largest phase; work category-by-category so progress is checkpointable.

**🎯 Objective:** Every one of the 1,000 projects has a fully fleshed-out `README.md`, `docs/`, and a
research-first `todo/` execution plan.

**🔗 Builds on:** The 1,000 scored ideas + folders from Phase 3, using `PROJECT_TEMPLATE.md`.

**🔬 Tasks (per project)**
- [ ] Flesh out the project `README.md` from `PROJECT_TEMPLATE.md`, carrying over the score, pitch,
      and evidence already captured in `taxonomy.json` (no re-research from scratch).
- [ ] Flesh out `docs/` — architecture, data model, and specifications (`docs/architecture_and_specs.md`).
- [ ] Cross-link: the project README references its `docs/` and `todo/` artifacts.
- [ ] Flesh out `todo/` as a phase-by-phase build plan, driven by a **research-first** approach per phase:
  - [ ] `Phase_1_Research_and_Validation.md` — confirm demand, competitors, pricing before building.
  - [ ] `Phase_2_MVP_Build.md` — the smallest shippable slice (from the blueprint's MVP scope).
  - [ ] `Phase_3_Launch_and_Monetization.md` — distribution channel + pricing + first customers.
- [ ] Include explicit tasks and sub-tasks for how to implement the project.

**📦 Deliverables:** 1,000 completed blueprints (README + docs + todo), consistent with the template.

**✅ Exit Gate**
- [ ] 100% of project READMEs are filled from the template (no unreplaced `[bracket]` prompts).
- [ ] Every project has non-stub `docs/` and a multi-phase `todo/` plan.
- [ ] Every project README links its own `docs/` and `todo/`.

---

## Phase 5 — Review & Finalization
> Prove the repository actually contains what it claims, then ship it.

**🎯 Objective:** A verified, link-clean, publishable repository of exactly 1,000 blueprints.

**🔗 Builds on:** The completed blueprints from Phase 4.

**🔬 Tasks**
- [ ] Run `python scaffolder.py validate` — confirm 10 categories, 100 sub-categories, 1,000 projects.
- [ ] Audit that exactly **1,000 unique** project `README.md` blueprints exist (no duplicate names/pitches).
- [ ] Verify all internal links (root ↔ category ↔ sub-category ↔ project, and README ↔ docs/todo).
- [ ] Quality-sample: spot-check a random N projects per category for evidence links + template completeness.
- [ ] Confirm every included idea still meets the minimum validation score.
- [ ] Finalize the root `README.md` index and commit; tag a release for public or personal deployment.

**📦 Deliverables:** Final audit report (pass/fail per gate), clean link graph, tagged release.

**✅ Exit Gate**
- [ ] Counts verified: 10 / 100 / 1,000, zero duplicates.
- [ ] Zero broken internal links.
- [ ] All quality-sample checks pass; repository tagged and ready to ship.