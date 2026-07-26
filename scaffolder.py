"""Scaffolder for the 1,000 Profitable Projects repository.

Commands
--------
init                     Create the root structure (Categories/, docs/, taxonomy.json skeleton).
build <taxonomy.json>    Generate the entire 10 -> 100 -> 1000 tree from the taxonomy data file.
validate                 Verify structure against taxonomy.json. Use --strict for the final 10/100/1000 gate.
category / subcategory / project
                         Manually create a single node (handy for one-off edits).

taxonomy.json is the single source of truth. See TODO.md and docs/TAXONOMY_SCHEMA.md.
"""

import sys
import json
import argparse
from pathlib import Path

# --- Constants ---

ROOT = Path(__file__).resolve().parent
TEMPLATE_PATH = ROOT / "PROJECT_TEMPLATE.md"
TAXONOMY_PATH = ROOT / "taxonomy.json"

EXPECTED_CATEGORIES = 10
EXPECTED_SUBS_PER_CATEGORY = 10
EXPECTED_PROJECTS_PER_SUB = 10

# Fallback used only if PROJECT_TEMPLATE.md is missing. The .md file is the source of truth.
FALLBACK_TEMPLATE = """# [Project Title & Pitch]

## 📖 Overview
[Summary of the product.]

## 📁 Documentation & Execution Links
* **Project Specifications:** [`./docs/`](./docs/)
* **Execution Roadmap:** [`./todo/`](./todo/)
"""

TAXONOMY_SKELETON = {
    "schemaVersion": "1.0.0",
    "meta": {
        "project": "1000 Profitable Ideas",
        "description": "Canonical structured dataset for categories, sub-categories, and validated idea blueprints.",
        "lastUpdated": None,
        "minimumValidationScore": 70,
    },
    "categories": [],
}


# --- Utilities ---

def load_template():
    """Load the canonical project blueprint from PROJECT_TEMPLATE.md."""
    if TEMPLATE_PATH.exists():
        return TEMPLATE_PATH.read_text(encoding="utf-8")
    print("WARNING: PROJECT_TEMPLATE.md not found; using minimal fallback template.")
    return FALLBACK_TEMPLATE


def slug(name):
    """Filesystem-safe fragment: spaces -> underscores, keep alnum/_/-."""
    cleaned = "".join(c if (c.isalnum() or c in " _-") else "" for c in name)
    return cleaned.strip().replace(" ", "_")


def create_file(path, content):
    """Create a file only if it does not already exist (idempotent)."""
    path = Path(path)
    if not path.exists():
        path.write_text(content, encoding="utf-8")
        print(f"Created file: {path}")
    else:
        print(f"File already exists: {path}")


def sync_file(path, content):
    """Always write content to a file."""
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    print(f"Synced file: {path}")


def load_taxonomy(taxonomy_path=TAXONOMY_PATH):
    taxonomy_path = Path(taxonomy_path)
    if not taxonomy_path.exists():
        return None
    try:
        return json.loads(taxonomy_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        print(f"ERROR: {taxonomy_path} is not valid JSON: {exc}")
        sys.exit(1)


def format_evidence_lines(evidence):
    if not evidence:
        return ["- No evidence linked yet."]
    lines = []
    for item in evidence:
        title = item.get("title", "Untitled source")
        url = item.get("url", "#")
        accessed = item.get("accessedOn", "unknown")
        source_type = item.get("sourceType", "source")
        notes = item.get("notes")
        line = f"- [{title}]({url}) — {source_type} — accessed {accessed}"
        if notes:
            line += f" — {notes}"
        lines.append(line)
    return lines


# --- Folder-name helpers (keep naming consistent everywhere) ---

def category_folder(cat):
    return f"{int(cat['id']):02d}-{slug(cat['name'])}"


def subcategory_folder(sub):
    return f"{int(sub['id']):02d}-{slug(sub['name'])}"


def project_folder(proj):
    return f"Project-{int(proj['id']):03d}-{slug(proj['name'])}"


# --- Readme renderers ---

def render_category_readme(cat):
    evidence_lines = "\n".join(format_evidence_lines(cat.get("evidence", [])))
    subcategories = cat.get("subcategories", [])

    if subcategories:
        subcategory_rows = "\n".join(
            f"| [{sub['name']}](./{subcategory_folder(sub)}/README.md) | {sub.get('targetMarket', 'TBD')} | {len(sub.get('projects', []))} | {sub.get('thesis', '')} |"
            for sub in subcategories
        )
    else:
        subcategory_rows = "| _No sub-categories yet_ | — | 0 | Populate taxonomy next |"

    return f"""# Category {cat['id']}: {cat['name']}

> {cat.get('thesis', '')}

## Target Market
{cat.get('targetMarket', 'TBD')}

## Evidence Trail
{evidence_lines}

## Sub-Categories

| Sub-Category | Target Market | Projects | Thesis |
| :--- | :--- | ---: | :--- |
{subcategory_rows}
"""


def render_subcategory_readme(cat, sub):
    evidence_lines = "\n".join(format_evidence_lines(sub.get("evidence", [])))
    projects = sub.get("projects", [])

    if projects:
        project_rows = "\n".join(
            f"| [{proj['name']}](./{project_folder(proj)}/README.md) | {proj.get('validationScore', '—')} | {proj.get('status', 'Idea')} | {proj.get('buildComplexity', 'TBD')} | {proj.get('pitch', '')} |"
            for proj in projects
        )
    else:
        project_rows = "| _No projects yet_ | — | — | — | Populate taxonomy next |"

    return f"""# Sub-Category {sub['id']}: {sub['name']}

> {sub.get('thesis', '')}

## Parent Category
[{cat['name']}](../README.md)

## Target Market
{sub.get('targetMarket', 'TBD')}

## Evidence Trail
{evidence_lines}

## Projects

| Project | Score | Status | Complexity | Pitch |
| :--- | ---: | :--- | :--- | :--- |
{project_rows}
"""


def render_project_readme(cat, sub, proj):
    target_users = proj.get("targetUsers", [])
    primary_buyer = target_users[0] if target_users else "To be researched"
    primary_operator = target_users[1] if len(target_users) > 1 else primary_buyer
    target_user_lines = "\n".join(f"- {user}" for user in target_users) or "- To be researched"
    distribution_lines = "\n".join(
        f"- {channel}" for channel in proj.get("distributionChannels", [])
    ) or "- To be researched"

    reference_lines = "\n".join(
        f"{index}. {line[2:]}" if line.startswith("- ") else f"{index}. {line}"
        for index, line in enumerate(format_evidence_lines(proj.get("evidence", [])), start=1)
    )

    price_point = proj.get("pricePoint", {})
    target_price = price_point.get("target")
    pricing_summary = (
        f"{price_point.get('currency', 'USD')} {price_point.get('startingAt', 'TBD')}"
        f"{f' → {target_price}' if target_price is not None else ''}"
        f" / {price_point.get('unit', 'pricing unit')}"
    )

    wedge = (
        f"Focused wedge on {sub['name'].lower()} workflows for "
        f"{sub.get('targetMarket', 'the target market').lower()}."
    )

    return f"""# {proj['name']}

> **One-liner:** {proj.get('pitch', '')}

| Field | Value |
| :--- | :--- |
| **Project ID** | `Project-{int(proj['id']):03d}` |
| **Category → Sub-Category** | `{cat['name']}` → `{sub['name']}` |
| **Slug** | `{proj.get('slug', '')}` |
| **Status** | `{proj.get('status', 'Idea')}` |
| **Validation Score** | `{proj.get('validationScore', 'TBD')}/100` |
| **Market Type** | `{proj.get('marketType', 'TBD')}` |
| **Build Complexity** | `{proj.get('buildComplexity', 'TBD')}` |
| **Time-to-MVP (AI-assisted)** | `{proj.get('timeToMvp', 'TBD')}` |
| **Primary Revenue Model** | `{proj.get('revenueModel', 'TBD')}` |
| **Pricing Hypothesis** | `{pricing_summary}` |

---

## 📖 Overview
{proj.get('summary', 'To be expanded.')}

## 🛑 The Problem
{proj.get('problem', 'To be researched.')}

## 🎯 Target Audience
- **Primary buyer:** {primary_buyer}
- **Primary operator/user:** {primary_operator}
- **Secondary users/stakeholders:** Expand during blueprint refinement
- **Target market:** {sub.get('targetMarket', cat.get('targetMarket', 'TBD'))}
- **Where they already gather:**
{distribution_lines}
- **Willingness-to-pay signal:** {proj.get('willingnessToPay', 'To be researched.')}

## 🧠 Chain of Logic & Evidence of Profitability
> First-principles reasoning. Every claim should stay linked to dated sources as the blueprint matures.

- **Premise → Conclusion:** {proj.get('problem', 'A recurring pain exists.')} This supports a solution shaped like: {proj.get('summary', proj.get('pitch', ''))}
- **Demand Evidence:** See source trail below and expand with more demand-specific research.
- **Willingness to Pay Evidence:** {proj.get('willingnessToPay', 'To be researched.')}
- **Competition Gap Evidence:** {wedge}
- **Distribution Evidence:** Initial reachable channels exist through the listed communities and outreach surfaces.

### References
{reference_lines}

## 🥊 Competitive Landscape
| Competitor / Alternative | Price | Weakness / Gap | Your Wedge |
| :--- | :--- | :--- | :--- |
| Research in progress | See evidence trail | Expand during blueprint refinement | {wedge} |

## 💳 Monetization Strategy
- **Revenue model:** {proj.get('revenueModel', 'TBD')}
- **Price point hypothesis:** {pricing_summary}
- **Expansion path:** Add adjacent tiers, team plans, or service-assisted workflows after the MVP proves traction.
- **Path to first $1k MRR:** Validate early demand through the listed channels, then convert initial users into repeat paying customers.

## 🛠️ Build Profile
- **Recommended stack:** Next.js + TypeScript + Tailwind + managed backend/services appropriate to the workflow
- **Key dependencies / APIs:** Add concrete integrations during architecture refinement
- **Riskiest technical assumption:** Confirm the core workflow can be delivered with acceptable reliability and cost
- **Operational burden:** Clarify onboarding, support, and compliance overhead during implementation planning

## 🎯 MVP Scope (First Shippable Slice)
- **In scope (v0.1):** Deliver the narrowest version that proves the core workflow and value promise
- **Explicitly deferred:** Nice-to-have automation, advanced collaboration, and deeper analytics
- **Success signal:** Users can complete the core workflow and find enough value to continue evaluating or paying

## ⚠️ Key Risks & Unknowns
- **Market risk:** Validate that the target segment prioritizes this pain enough to act
- **Technical risk:** Verify the core workflow can be shipped with manageable complexity
- **Distribution risk:** Confirm the listed channels actually convert attention into conversations
- **Moat / defensibility:** Strengthen through sharper workflow fit, UX, and distribution learning
- **Regulatory / trust risk:** Expand if the workflow touches sensitive or regulated data

## 🚀 How to Start
1. Review the linked evidence and identify the strongest pain signal to validate further.
2. Prototype the thinnest workflow that demonstrates the promised outcome.
3. Reach out through one listed distribution channel to test interest with real target users.
4. Measure whether users understand the pitch, value the workflow, and will pay or commit to next steps.

## 🔍 What to Validate Next
- Confirm sharper pricing anchors in the target niche
- Identify the strongest direct competitors or manual alternatives
- Validate the fastest path from first user conversation to MVP usage

---

## 📁 Documentation & Execution Links
- **Project Specifications:** [`./docs/`](./docs/) — architecture, data model, and detailed specs
- **Execution Roadmap:** [`./todo/`](./todo/) — phase-by-phase build plan

## Source Target Users
{target_user_lines}
"""


# --- Core scaffolding ---

def scaffold_project(proj_path, name, pitch="", cat=None, sub=None, proj=None):
    """Create a project's README (from template or taxonomy data), docs/, and todo/ phase plan."""
    proj_path = Path(proj_path)
    (proj_path / "docs").mkdir(parents=True, exist_ok=True)
    (proj_path / "todo").mkdir(parents=True, exist_ok=True)

    if cat and sub and proj:
        sync_file(proj_path / "README.md", render_project_readme(cat, sub, proj))
    else:
        create_file(proj_path / "README.md", load_template())

    create_file(
        proj_path / "docs" / "architecture_and_specs.md",
        f"# Architecture & Specifications — {name}\n\n{pitch}\n",
    )
    create_file(
        proj_path / "todo" / "Phase_1_Research_and_Validation.md",
        "# Phase 1: Research & Validation\n\nConfirm demand, competitors, and pricing before building.\n",
    )
    create_file(
        proj_path / "todo" / "Phase_2_MVP_Build.md",
        "# Phase 2: MVP Build\n\nThe smallest shippable slice that delivers the core value.\n",
    )
    create_file(
        proj_path / "todo" / "Phase_3_Launch_and_Monetization.md",
        "# Phase 3: Launch & Monetization\n\nDistribution channel, pricing, and first customers.\n",
    )


def init_repo(base_dir="."):
    """Initialize the base repository structure."""
    base_path = Path(base_dir)
    (base_path / "Categories").mkdir(parents=True, exist_ok=True)
    print(f"Created directory: {base_path / 'Categories'}")
    (base_path / "docs").mkdir(parents=True, exist_ok=True)

    create_file(
        base_path / "docs" / "VALIDATION_RUBRIC.md",
        "# Validation Rubric\n\nScore each idea 0-100. Minimum passing score: 70.\n\n"
        "- Demand (25) · Willingness to Pay (25) · Competition Gap (20) · "
        "Build Feasibility (20) · Distribution (10)\n",
    )
    create_file(
        base_path / "docs" / "RESEARCH_STANDARD.md",
        "# Research Standard\n\nEvery claim requires a dated source link.\n",
    )
    create_file(
        base_path / "docs" / "TAXONOMY_SCHEMA.md",
        "# Taxonomy Schema\n\nSee the repository documentation for the canonical schema contract.\n",
    )
    if not TAXONOMY_PATH.exists():
        TAXONOMY_PATH.write_text(
            json.dumps(TAXONOMY_SKELETON, indent=2) + "\n", encoding="utf-8"
        )
        print(f"Created file: {TAXONOMY_PATH}")


def create_category(id_num, name, base_dir="."):
    folder = f"{int(id_num):02d}-{slug(name)}"
    cat_path = Path(base_dir) / "Categories" / folder
    cat_path.mkdir(parents=True, exist_ok=True)
    print(f"Created Category directory: {cat_path}")
    create_file(
        cat_path / "README.md",
        f"# Category {id_num}: {name}\n\nIndex of 10 sub-categories will go here.\n",
    )
    return folder


def create_subcategory(cat_folder_name, id_num, name, base_dir="."):
    folder = f"{int(id_num):02d}-{slug(name)}"
    subcat_path = Path(base_dir) / "Categories" / cat_folder_name / folder
    subcat_path.mkdir(parents=True, exist_ok=True)
    print(f"Created Sub-Category directory: {subcat_path}")
    create_file(
        subcat_path / "README.md",
        f"# Sub-Category {id_num}: {name}\n\nIndex of 10 project ideas will go here.\n",
    )
    return folder


def create_project(cat_folder_name, subcat_folder_name, id_num, name, base_dir="."):
    folder = f"Project-{int(id_num):03d}-{slug(name)}"
    proj_path = Path(base_dir) / "Categories" / cat_folder_name / subcat_folder_name / folder
    print(f"Created Project directory: {proj_path}")
    scaffold_project(proj_path, name)
    return folder


# --- Data-driven build (generates the whole tree from taxonomy.json) ---

def build_from_taxonomy(taxonomy_path=TAXONOMY_PATH, base_dir="."):
    data = load_taxonomy(taxonomy_path)
    if data is None:
        print(f"ERROR: {taxonomy_path} not found. Run 'python scaffolder.py init' first.")
        sys.exit(1)

    base_path = Path(base_dir)
    categories = data.get("categories", [])
    counts = {"categories": 0, "subcategories": 0, "projects": 0}

    for cat in categories:
        cat_folder = category_folder(cat)
        cat_path = base_path / "Categories" / cat_folder
        cat_path.mkdir(parents=True, exist_ok=True)
        sync_file(cat_path / "README.md", render_category_readme(cat))
        counts["categories"] += 1

        for sub in cat.get("subcategories", []):
            sub_folder = subcategory_folder(sub)
            sub_path = cat_path / sub_folder
            sub_path.mkdir(parents=True, exist_ok=True)
            sync_file(sub_path / "README.md", render_subcategory_readme(cat, sub))
            counts["subcategories"] += 1

            for proj in sub.get("projects", []):
                proj_path = sub_path / project_folder(proj)
                scaffold_project(
                    proj_path,
                    proj["name"],
                    proj.get("pitch", ""),
                    cat=cat,
                    sub=sub,
                    proj=proj,
                )
                counts["projects"] += 1

    print("\nBuild complete:")
    print(f"  Categories:    {counts['categories']}")
    print(f"  Sub-Categories:{counts['subcategories']}")
    print(f"  Projects:      {counts['projects']}")


# --- Validation (the Exit-Gate checker) ---

def validate(taxonomy_path=TAXONOMY_PATH, base_dir=".", strict_counts=False):
    data = load_taxonomy(taxonomy_path)
    if data is None:
        print(f"ERROR: {taxonomy_path} not found. Run 'python scaffolder.py init' first.")
        sys.exit(1)

    categories = data.get("categories", [])
    n_cat = len(categories)
    n_sub = sum(len(c.get("subcategories", [])) for c in categories)
    n_proj = sum(
        len(s.get("projects", []))
        for c in categories
        for s in c.get("subcategories", [])
    )

    print("Taxonomy counts:")
    print(f"  Categories:     {n_cat} / {EXPECTED_CATEGORIES}")
    print(f"  Sub-Categories: {n_sub} / {EXPECTED_CATEGORIES * EXPECTED_SUBS_PER_CATEGORY}")
    print(
        f"  Projects:       {n_proj} / "
        f"{EXPECTED_CATEGORIES * EXPECTED_SUBS_PER_CATEGORY * EXPECTED_PROJECTS_PER_SUB}"
    )

    if n_cat == 0:
        print("\n[Foundation stage] taxonomy is empty — nothing to validate yet. OK.")
        return

    problems = []

    if strict_counts:
        for cat in categories:
            subs = cat.get("subcategories", [])
            if len(subs) != EXPECTED_SUBS_PER_CATEGORY:
                problems.append(
                    f"Category {cat.get('id')} '{cat.get('name')}' has {len(subs)} sub-categories "
                    f"(expected {EXPECTED_SUBS_PER_CATEGORY})."
                )
            for sub in subs:
                projs = sub.get("projects", [])
                if len(projs) != EXPECTED_PROJECTS_PER_SUB:
                    problems.append(
                        f"Sub-Category {cat.get('id')}.{sub.get('id')} '{sub.get('name')}' has "
                        f"{len(projs)} projects (expected {EXPECTED_PROJECTS_PER_SUB})."
                    )

    proj_names = [
        p["name"].strip().lower()
        for c in categories
        for s in c.get("subcategories", [])
        for p in s.get("projects", [])
    ]
    dupes = {n for n in proj_names if proj_names.count(n) > 1}
    if dupes:
        problems.append(f"Duplicate project names found: {sorted(dupes)}")

    base_path = Path(base_dir)
    for cat in categories:
        cat_dir = base_path / "Categories" / category_folder(cat)
        if not cat_dir.is_dir():
            problems.append(f"Missing folder on disk: {cat_dir}")
            continue
        for sub in cat.get("subcategories", []):
            sub_dir = cat_dir / subcategory_folder(sub)
            if not sub_dir.is_dir():
                problems.append(f"Missing folder on disk: {sub_dir}")
                continue
            for proj in sub.get("projects", []):
                if not (sub_dir / project_folder(proj)).is_dir():
                    problems.append(f"Missing folder on disk: {sub_dir / project_folder(proj)}")

    if strict_counts:
        if n_cat != EXPECTED_CATEGORIES:
            problems.append(
                f"Expected {EXPECTED_CATEGORIES} categories for strict validation, found {n_cat}."
            )
        expected_subs = EXPECTED_CATEGORIES * EXPECTED_SUBS_PER_CATEGORY
        if n_sub != expected_subs:
            problems.append(
                f"Expected {expected_subs} sub-categories for strict validation, found {n_sub}."
            )
        expected_projects = (
            EXPECTED_CATEGORIES * EXPECTED_SUBS_PER_CATEGORY * EXPECTED_PROJECTS_PER_SUB
        )
        if n_proj != expected_projects:
            problems.append(
                f"Expected {expected_projects} projects for strict validation, found {n_proj}."
            )

    if problems:
        print("\nVALIDATION FAILED:")
        for problem in problems:
            print(f"  - {problem}")
        sys.exit(1)

    if strict_counts:
        print("\nVALIDATION PASSED: strict counts and structure match taxonomy.json.")
    else:
        print("\nVALIDATION PASSED: structure matches taxonomy.json.")
        if (
            n_cat != EXPECTED_CATEGORIES
            or n_sub != EXPECTED_CATEGORIES * EXPECTED_SUBS_PER_CATEGORY
            or n_proj != EXPECTED_CATEGORIES * EXPECTED_SUBS_PER_CATEGORY * EXPECTED_PROJECTS_PER_SUB
        ):
            print(
                "[Partial dataset] Counts are below the final 10/100/1000 target, "
                "which is allowed outside strict mode."
            )


# --- CLI ---

def main():
    parser = argparse.ArgumentParser(
        description="CLI tool to scaffold the 1000 Profitable Projects repository."
    )
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    subparsers.add_parser("init", help="Initialize the root repository structure")

    build_parser = subparsers.add_parser(
        "build", help="Generate the full tree from a taxonomy.json file"
    )
    build_parser.add_argument(
        "taxonomy",
        nargs="?",
        default=str(TAXONOMY_PATH),
        help="Path to taxonomy.json (default: ./taxonomy.json)",
    )

    validate_parser = subparsers.add_parser(
        "validate", help="Verify counts and structure against taxonomy.json"
    )
    validate_parser.add_argument(
        "--strict",
        action="store_true",
        help="Require the final 10/100/1000 target counts in addition to structure validation",
    )

    cat_parser = subparsers.add_parser("category", help="Create a single top-level category")
    cat_parser.add_argument("--id", required=True, help="Category number (e.g., 1)")
    cat_parser.add_argument("--name", required=True, help="Category name")

    subcat_parser = subparsers.add_parser("subcategory", help="Create a single sub-category")
    subcat_parser.add_argument(
        "--parent", required=True, help="Exact folder name of the parent Category"
    )
    subcat_parser.add_argument("--id", required=True, help="Sub-category number (e.g., 1)")
    subcat_parser.add_argument("--name", required=True, help="Sub-category name")

    proj_parser = subparsers.add_parser("project", help="Create a single project folder")
    proj_parser.add_argument("--cat", required=True, help="Exact folder name of the parent Category")
    proj_parser.add_argument(
        "--subcat", required=True, help="Exact folder name of the parent Sub-Category"
    )
    proj_parser.add_argument("--id", required=True, help="Project number (e.g., 1)")
    proj_parser.add_argument("--name", required=True, help="Project name")

    args = parser.parse_args()

    if args.command == "init":
        init_repo()
    elif args.command == "build":
        build_from_taxonomy(Path(args.taxonomy).resolve())
    elif args.command == "validate":
        validate(strict_counts=getattr(args, "strict", False))
    elif args.command == "category":
        create_category(args.id, args.name)
    elif args.command == "subcategory":
        create_subcategory(args.parent, args.id, args.name)
    elif args.command == "project":
        create_project(args.cat, args.subcat, args.id, args.name)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()