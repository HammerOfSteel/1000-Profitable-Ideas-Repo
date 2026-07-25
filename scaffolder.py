"""Scaffolder for the 1,000 Profitable Projects repository.

Commands
--------
init                     Create the root structure (Categories/, docs/, taxonomy.json skeleton).
build <taxonomy.json>    Generate the entire 10 -> 100 -> 1000 tree from the taxonomy data file.
validate                 Verify counts (10/100/1000) and that the filesystem matches taxonomy.json.
category / subcategory / project
                         Manually create a single node (handy for one-off edits).

taxonomy.json is the single source of truth. See TODO.md (Phase 0) for its schema.
"""

import os
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

TAXONOMY_SKELETON = {"categories": []}


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


def load_taxonomy(taxonomy_path=TAXONOMY_PATH):
    taxonomy_path = Path(taxonomy_path)
    if not taxonomy_path.exists():
        return None
    try:
        return json.loads(taxonomy_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        print(f"ERROR: {taxonomy_path} is not valid JSON: {exc}")
        sys.exit(1)


# --- Folder-name helpers (keep naming consistent everywhere) ---

def category_folder(cat):
    return f"{int(cat['id']):02d}-{slug(cat['name'])}"


def subcategory_folder(sub):
    return f"{int(sub['id']):02d}-{slug(sub['name'])}"


def project_folder(proj):
    return f"Project-{int(proj['id']):03d}-{slug(proj['name'])}"


# --- Core scaffolding ---

def scaffold_project(proj_path, name, pitch=""):
    """Create a project's README (from template), docs/, and todo/ phase plan."""
    proj_path = Path(proj_path)
    (proj_path / "docs").mkdir(parents=True, exist_ok=True)
    (proj_path / "todo").mkdir(parents=True, exist_ok=True)

    create_file(proj_path / "README.md", load_template())
    create_file(proj_path / "docs" / "architecture_and_specs.md",
                f"# Architecture & Specifications — {name}\n\n{pitch}\n")
    # todo phase files mirror TODO.md Phase 4's research-first per-project plan.
    create_file(proj_path / "todo" / "Phase_1_Research_and_Validation.md",
                "# Phase 1: Research & Validation\n\nConfirm demand, competitors, and pricing before building.\n")
    create_file(proj_path / "todo" / "Phase_2_MVP_Build.md",
                "# Phase 2: MVP Build\n\nThe smallest shippable slice that delivers the core value.\n")
    create_file(proj_path / "todo" / "Phase_3_Launch_and_Monetization.md",
                "# Phase 3: Launch & Monetization\n\nDistribution channel, pricing, and first customers.\n")


def init_repo(base_dir="."):
    """Initialize the base repository structure."""
    base_path = Path(base_dir)
    (base_path / "Categories").mkdir(parents=True, exist_ok=True)
    print(f"Created directory: {base_path / 'Categories'}")
    (base_path / "docs").mkdir(parents=True, exist_ok=True)

    create_file(base_path / "docs" / "VALIDATION_RUBRIC.md",
                "# Validation Rubric\n\nScore each idea 0-100. Minimum passing score: 70.\n\n"
                "- Demand (25) · Willingness to Pay (25) · Competition Gap (20) · "
                "Build Feasibility (20) · Distribution (10)\n")
    create_file(base_path / "docs" / "RESEARCH_STANDARD.md",
                "# Research Standard\n\nEvery claim requires a dated source link.\n")
    if not TAXONOMY_PATH.exists():
        TAXONOMY_PATH.write_text(json.dumps(TAXONOMY_SKELETON, indent=2) + "\n", encoding="utf-8")
        print(f"Created file: {TAXONOMY_PATH}")


def create_category(id_num, name, base_dir="."):
    folder = f"{int(id_num):02d}-{slug(name)}"
    cat_path = Path(base_dir) / "Categories" / folder
    cat_path.mkdir(parents=True, exist_ok=True)
    print(f"Created Category directory: {cat_path}")
    create_file(cat_path / "README.md",
                f"# Category {id_num}: {name}\n\nIndex of 10 sub-categories will go here.\n")
    return folder


def create_subcategory(cat_folder_name, id_num, name, base_dir="."):
    folder = f"{int(id_num):02d}-{slug(name)}"
    subcat_path = Path(base_dir) / "Categories" / cat_folder_name / folder
    subcat_path.mkdir(parents=True, exist_ok=True)
    print(f"Created Sub-Category directory: {subcat_path}")
    create_file(subcat_path / "README.md",
                f"# Sub-Category {id_num}: {name}\n\nIndex of 10 project ideas will go here.\n")
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
        create_file(cat_path / "README.md",
                    f"# Category {cat['id']}: {cat['name']}\n\n> {cat.get('thesis', '')}\n\n"
                    "## Sub-Categories\n")
        counts["categories"] += 1

        for sub in cat.get("subcategories", []):
            sub_folder = subcategory_folder(sub)
            sub_path = cat_path / sub_folder
            sub_path.mkdir(parents=True, exist_ok=True)
            create_file(sub_path / "README.md",
                        f"# Sub-Category {sub['id']}: {sub['name']}\n\n> {sub.get('thesis', '')}\n\n"
                        "## Projects\n")
            counts["subcategories"] += 1

            for proj in sub.get("projects", []):
                proj_path = sub_path / project_folder(proj)
                scaffold_project(proj_path, proj["name"], proj.get("pitch", ""))
                counts["projects"] += 1

    print("\nBuild complete:")
    print(f"  Categories:    {counts['categories']}")
    print(f"  Sub-Categories:{counts['subcategories']}")
    print(f"  Projects:      {counts['projects']}")


# --- Validation (the Exit-Gate checker) ---

def validate(taxonomy_path=TAXONOMY_PATH, base_dir="."):
    data = load_taxonomy(taxonomy_path)
    if data is None:
        print(f"ERROR: {taxonomy_path} not found. Run 'python scaffolder.py init' first.")
        sys.exit(1)

    categories = data.get("categories", [])
    n_cat = len(categories)
    n_sub = sum(len(c.get("subcategories", [])) for c in categories)
    n_proj = sum(len(s.get("projects", []))
                 for c in categories for s in c.get("subcategories", []))

    print("Taxonomy counts:")
    print(f"  Categories:     {n_cat} / {EXPECTED_CATEGORIES}")
    print(f"  Sub-Categories: {n_sub} / {EXPECTED_CATEGORIES * EXPECTED_SUBS_PER_CATEGORY}")
    print(f"  Projects:       {n_proj} / "
          f"{EXPECTED_CATEGORIES * EXPECTED_SUBS_PER_CATEGORY * EXPECTED_PROJECTS_PER_SUB}")

    if n_cat == 0:
        print("\n[Foundation stage] taxonomy is empty — nothing to validate yet. OK.")
        return

    problems = []

    # Per-node fan-out checks.
    for cat in categories:
        subs = cat.get("subcategories", [])
        if len(subs) != EXPECTED_SUBS_PER_CATEGORY:
            problems.append(
                f"Category {cat.get('id')} '{cat.get('name')}' has {len(subs)} sub-categories "
                f"(expected {EXPECTED_SUBS_PER_CATEGORY}).")
        for sub in subs:
            projs = sub.get("projects", [])
            if len(projs) != EXPECTED_PROJECTS_PER_SUB:
                problems.append(
                    f"Sub-Category {cat.get('id')}.{sub.get('id')} '{sub.get('name')}' has "
                    f"{len(projs)} projects (expected {EXPECTED_PROJECTS_PER_SUB}).")

    # Duplicate project-name check (global).
    proj_names = [p["name"].strip().lower()
                  for c in categories for s in c.get("subcategories", [])
                  for p in s.get("projects", [])]
    dupes = {n for n in proj_names if proj_names.count(n) > 1}
    if dupes:
        problems.append(f"Duplicate project names found: {sorted(dupes)}")

    # Filesystem consistency check: every taxonomy node must exist on disk.
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

    if problems:
        print("\nVALIDATION FAILED:")
        for p in problems:
            print(f"  - {p}")
        sys.exit(1)

    print("\nVALIDATION PASSED: structure matches taxonomy.json.")


# --- CLI ---

def main():
    parser = argparse.ArgumentParser(
        description="CLI tool to scaffold the 1000 Profitable Projects repository.")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    subparsers.add_parser("init", help="Initialize the root repository structure")

    build_parser = subparsers.add_parser(
        "build", help="Generate the full tree from a taxonomy.json file")
    build_parser.add_argument("taxonomy", nargs="?", default=str(TAXONOMY_PATH),
                              help="Path to taxonomy.json (default: ./taxonomy.json)")

    subparsers.add_parser("validate", help="Verify counts and structure against taxonomy.json")

    cat_parser = subparsers.add_parser("category", help="Create a single top-level category")
    cat_parser.add_argument("--id", required=True, help="Category number (e.g., 1)")
    cat_parser.add_argument("--name", required=True, help="Category name")

    subcat_parser = subparsers.add_parser("subcategory", help="Create a single sub-category")
    subcat_parser.add_argument("--parent", required=True, help="Exact folder name of the parent Category")
    subcat_parser.add_argument("--id", required=True, help="Sub-category number (e.g., 1)")
    subcat_parser.add_argument("--name", required=True, help="Sub-category name")

    proj_parser = subparsers.add_parser("project", help="Create a single project folder")
    proj_parser.add_argument("--cat", required=True, help="Exact folder name of the parent Category")
    proj_parser.add_argument("--subcat", required=True, help="Exact folder name of the parent Sub-Category")
    proj_parser.add_argument("--id", required=True, help="Project number (e.g., 1)")
    proj_parser.add_argument("--name", required=True, help="Project name")

    args = parser.parse_args()

    if args.command == "init":
        init_repo()
    elif args.command == "build":
        build_from_taxonomy(Path(args.taxonomy).resolve())
    elif args.command == "validate":
        validate()
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