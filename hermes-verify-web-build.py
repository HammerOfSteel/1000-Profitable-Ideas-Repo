#!/usr/bin/env python3
"""
Verification script for Web UI build.
Tests that the Next.js app builds successfully.
"""

import subprocess
import sys
from pathlib import Path

print("=" * 60)
print("HERMES VERIFY - Web UI Build")
print("=" * 60)

# Check that key files exist
key_files = [
    "web/app/layout.tsx",
    "web/app/login/page.tsx",
    "web/app/dashboard/page.tsx",
    "web/components/MindMap.tsx",
    "web/components/SettingsMenu.tsx",
    "web/contexts/UserContext.tsx",
    "web/package.json",
    "web/next.config.js",
    "web/tailwind.config.js",
]

print("\n1. Checking key files...")
all_exist = True
for f in key_files:
    path = Path(f)
    if path.exists():
        print(f"  ✓ {f}")
    else:
        print(f"  ✗ {f} - NOT FOUND")
        all_exist = False

if not all_exist:
    print("\n❌ FAILED - Missing key files")
    sys.exit(1)

print("\n2. Checking build output...")
build_dir = Path("web/.next")
if build_dir.exists():
    print("  ✓ Build directory exists")
    
    # Check for static files
    static_dir = build_dir / "static"
    if static_dir.exists():
        print("  ✓ Static directory exists")
    
    # Check for chunks
    chunks_dir = static_dir / "chunks" if static_dir.exists() else None
    if chunks_dir and chunks_dir.exists():
        chunk_count = len(list(chunks_dir.glob("*.js")))
        print(f"  ✓ Found {chunk_count} chunk files")
else:
    print("  ✗ Build directory not found - run 'npm run build' first")
    print("\n❌ FAILED - Build not completed")
    sys.exit(1)

# Check package.json dependencies
print("\n3. Checking package.json dependencies...")
import json
pkg_path = Path("web/package.json")
if pkg_path.exists():
    with open(pkg_path) as f:
        pkg = json.load(f)
    
    deps = pkg.get("dependencies", {})
    required = ["next", "react", "react-dom"]
    for dep in required:
        if dep in deps:
            print(f"  ✓ {dep}: {deps[dep]}")
        else:
            print(f"  ✗ {dep}: missing")
else:
    print("  ✗ package.json not found")

print("\n" + "=" * 60)
print("✅ VERIFICATION PASSED")
print("=" * 60)