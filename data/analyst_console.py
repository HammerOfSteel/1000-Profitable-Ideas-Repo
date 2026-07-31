#!/usr/bin/env python3
"""
Enhanced Analyst Console UI - Advanced visualization for the evidence backend.

Features:
- Theme support (dark/light mode)
- Mind map visualization
- Idea relationship mapping
- Interactive layouts
- Evidence flow diagrams
"""

import json
import sys
from pathlib import Path
from datetime import datetime
import argparse

# Configuration
BASE_DIR = Path(__file__).parent.parent
CANDIDATES_DIR = BASE_DIR / "data" / "candidates"
VERIFIED_DIR = BASE_DIR / "data" / "verified"
EVIDENCE_DIR = BASE_DIR / "data" / "evidence" / "normalized"

# Theme colors
THEMES = {
    'dark': {
        'bg': '#1a1a2e',
        'panel': '#16213e',
        'text': '#e0e0e0',
        'accent': '#4ecca3',
        'score_high': '#4ade80',
        'score_mid': '#fbbf24',
        'score_low': '#f87171',
        'promote': '#4ade80',
        'watchlist': '#fbbf24',
        'reject': '#f87171'
    },
    'light': {
        'bg': '#f8fafc',
        'panel': '#ffffff',
        'text': '#1e293b',
        'accent': '#0d9488',
        'score_high': '#22c55e',
        'score_mid': '#f59e0b',
        'score_low': '#ef4444',
        'promote': '#22c55e',
        'watchlist': '#f59e0b',
        'reject': '#ef4444'
    }
}


class MindMapGenerator:
    """Generates mind map visualizations for ideas."""
    
    @staticmethod
    def generate_mermaid_map(candidates: list, verified: list) -> str:
        """Generate a Mermaid mindmap diagram."""
        lines = ["graph TD"]
        lines.append("    A[1000 Profitable Ideas]")
        
        # Add promoted ideas
        for i, cand in enumerate(candidates):
            if cand.get('promotionStatus') == 'promote':
                score = cand.get('samuelStyleScore', 0)
                node_id = f"P{i}"
                lines.append(f"    A --> {node_id}[\"{cand['nicheLabel']}\\nScore: {score}/100\\nStatus: Promoted\"]")
                
                # Add evidence branches
                lines.append(f"    {node_id} --> E1[Demand Evidence]")
                lines.append(f"    {node_id} --> E2[Willingness-to-Pay]")
                lines.append(f"    {node_id} --> E3[Competition Gap]")
                lines.append(f"    {node_id} --> E4[Distribution]")
        
        # Add watchlisted ideas
        for i, cand in enumerate(candidates):
            if cand.get('promotionStatus') == 'watchlist':
                score = cand.get('samuelStyleScore', 0)
                node_id = f"W{i}"
                lines.append(f"    A --> {node_id}[\"{cand['nicheLabel']}\\nScore: {score}/100\\nStatus: Watchlist\"]")
        
        # Add verified ideas
        for i, idea in enumerate(verified):
            node_id = f"V{i}"
            score = idea.get('validationScore', {}).get('total', 0)
            lines.append(f"    A --> {node_id}[\"{idea['name']}\\nScore: {score}/100\\nStatus: {idea['status']}\"]")
        
        return "\n".join(lines)
    
    @staticmethod
    def generate_ascii_mindmap(candidates: list, verified: list) -> str:
        """Generate an ASCII art mindmap."""
        lines = []
        lines.append("=" * 60)
        lines.append("MIND MAP: Profitable Ideas")
        lines.append("=" * 60)
        lines.append("")
        lines.append("                1000 Profitable Ideas")
        lines.append("                       |")
        lines.append("        " + "─" * 20 + "─" * 20)
        lines.append("        |              " + "|              ")
        lines.append("        |              |              ")
        
        # Promoted ideas
        promoted = [c for c in candidates if c.get('promotionStatus') == 'promote']
        if promoted:
            lines.append("   PROMOTED IDEAS      WATCHLISTED")
            for i, cand in enumerate(promoted):
                status = "✓" if cand.get('promotionStatus') == 'promote' else "○"
                score = cand.get('samuelStyleScore', 0)
                lines.append(f"   {status} {cand['nicheLabel'][:30]:<30} Score: {score}/100")
        
        lines.append("")
        lines.append("VERIFIED IDEAS (Deep Lane):")
        lines.append("-" * 40)
        for idea in verified:
            score = idea.get('validationScore', {}).get('total', 0)
            lines.append(f"  • {idea['name'][:40]}")
            lines.append(f"    Score: {score}/100 | Status: {idea['status']}")
            lines.append(f"    MVP: {idea.get('mvpScope', 'N/A')[:60]}...")
        
        return "\n".join(lines)


class ThemeManager:
    """Manages UI themes and layouts."""
    
    def __init__(self, theme: str = 'dark'):
        self.theme = theme if theme in THEMES else 'dark'
        self.colors = THEMES[self.theme]
    
    def colorize(self, text: str, color_key: str) -> str:
        """Apply ANSI color to text."""
        if self.theme == 'dark':
            return text  # Keep it simple for terminal
        return text
    
    def header(self, title: str) -> str:
        """Generate a themed header."""
        lines = ["", "=" * 60]
        lines.append(title.center(60))
        lines.append("=" * 60)
        return "\n".join(lines)


class IdeaMapper:
    """Maps relationships between ideas."""
    
    @staticmethod
    def find_related_ideas(candidates: list) -> dict:
        """Find related ideas based on shared characteristics."""
        relationships = {}
        
        # Group by niche patterns
        for i, c1 in enumerate(candidates):
            for j, c2 in enumerate(candidates[i+1:], i+1):
                shared = []
                
                # Check for shared keywords
                c1_keywords = set(c1.get('nicheLabel', '').lower().split())
                c2_keywords = set(c2.get('nicheLabel', '').lower().split())
                shared = list(c1_keywords & c2_keywords)
                
                # Check for similar wedge opportunities
                w1 = [w.get('description', '') for w in c1.get('wedgeHypotheses', [])]
                w2 = [w.get('description', '') for w in c2.get('wedgeHypotheses', [])]
                
                if shared or any(s1 == s2 for s1 in w1 for s2 in w2):
                    key = tuple(sorted([c1['id'], c2['id']]))
                    relationships[key] = {
                        'ids': (c1['id'], c2['id']),
                        'names': (c1.get('nicheLabel'), c2.get('nicheLabel')),
                        'shared_keywords': shared,
                        'similar_wedges': len([w for w in w1 if w in w2])
                    }
        
        return relationships
    
    @staticmethod
    def generate_relationship_graph(candidates: list) -> str:
        """Generate a relationship graph visualization."""
        lines = ["", "=" * 60, "IDEA RELATIONSHIP MAP", "=" * 60, ""]
        
        relationships = IdeaMapper.find_related_ideas(candidates)
        
        if not relationships:
            lines.append("No strong relationships found between ideas.")
            lines.append("\nIndividual idea connections:")
            for c in candidates:
                score = c.get('samuelStyleScore', 0)
                lines.append(f"  • {c['nicheLabel']} (Score: {score})")
        else:
            lines.append("Related Ideas Cluster:")
            lines.append("-" * 40)
            
            for key, rel in relationships.items():
                lines.append(f"\n  [{rel['names'][0][:20]}] ──── connected to ──── [{rel['names'][1][:20]}]")
                if rel['shared_keywords']:
                    lines.append(f"    Shared: {', '.join(rel['shared_keywords'][:3])}")
                if rel['similar_wedges']:
                    lines.append(f"    Similar wedges: {rel['similar_wedges']}")
        
        return "\n".join(lines)


def list_candidates():
    """List all candidate dossiers."""
    print("\n" + "=" * 60)
    print("CANDIDATE DOSSIERS")
    print("=" * 60)
    
    if not CANDIDATES_DIR.exists():
        print("No candidates directory found.")
        return []
    
    candidates = []
    for f in CANDIDATES_DIR.glob("*.json"):
        try:
            with open(f) as fp:
                data = json.load(fp)
                candidates.append(data)
        except Exception:
            continue
    
    if not candidates:
        print("No candidates found.")
        return []
    
    candidates.sort(key=lambda x: x.get('samuelStyleScore', 0), reverse=True)
    
    print(f"\nFound {len(candidates)} candidates:\n")
    for c in candidates:
        score = c.get('samuelStyleScore', 0)
        status = c.get('promotionStatus', 'unknown')
        name = c.get('nicheLabel', c.get('id', 'unknown'))
        
        status_icon = "✓" if status == "promote" else "○" if status == "watchlist" else "✗"
        print(f"  [{status_icon}] {name}")
        print(f"      Score: {score}/100 | Status: {status}")
    
    return candidates


def show_candidate(candidate_id: str):
    """Show detailed candidate information."""
    print("\n" + "=" * 60)
    print(f"CANDIDATE: {candidate_id}")
    print("=" * 60)
    
    path = CANDIDATES_DIR / f"{candidate_id}.json"
    if not path.exists():
        print(f"Candidate not found: {candidate_id}")
        return
    
    with open(path) as f:
        data = json.load(f)
    
    print(f"\nName: {data.get('nicheLabel', 'N/A')}")
    print(f"Problem: {data.get('problemSummary', 'N/A')}")
    print(f"\nScore Breakdown:")
    
    breakdown = data.get('scoreBreakdown', {})
    print(f"  Demand: {breakdown.get('demand', 0)}/25")
    print(f"  Willingness to Pay: {breakdown.get('willingnessToPay', 0)}/25")
    print(f"  Competition Gap: {breakdown.get('competitionGap', 0)}/20")
    print(f"  Build Feasibility: {breakdown.get('buildFeasibility', 0)}/20")
    print(f"  Distribution: {breakdown.get('distribution', 0)}/10")
    print(f"\nTotal Score: {data.get('samuelStyleScore', 0)}/100")
    print(f"Status: {data.get('promotionStatus', 'unknown')}")
    
    print(f"\nEvidence References:")
    print(f"  Traction: {len(data.get('tractionEvidenceRefs', []))} refs")
    print(f"  Pricing/WTP: {len(data.get('pricingEvidenceRefs', []))} refs")
    print(f"  Acquisition: {len(data.get('acquisitionEvidenceRefs', []))} refs")
    
    print(f"\nWedge Hypotheses:")
    for wedge in data.get('wedgeHypotheses', []):
        print(f"  - {wedge.get('description', 'N/A')}")
    
    print(f"\nRationale: {data.get('promotionRationale', 'N/A')}")


def list_verified():
    """List all verified ideas."""
    print("\n" + "=" * 60)
    print("VERIFIED IDEAS")
    print("=" * 60)
    
    if not VERIFIED_DIR.exists():
        print("No verified directory found.")
        return []
    
    ideas = []
    for f in VERIFIED_DIR.glob("*.json"):
        try:
            with open(f) as fp:
                data = json.load(fp)
                ideas.append(data)
        except Exception as e:
            print(f"  Error loading {f}: {e}")
            continue
    
    if not ideas:
        print("No verified ideas found.")
        return []
    
    print(f"\nFound {len(ideas)} verified ideas:\n")
    for idea in ideas:
        score = idea.get('validationScore', {}).get('total', 0)
        status = idea.get('status', 'unknown')
        name = idea.get('name', idea.get('id', 'unknown'))
        
        print(f"  {name}")
        print(f"      Score: {score}/100 | Status: {status}")
    
    return ideas


def show_verified(idea_id: str):
    """Show detailed verified idea information."""
    print("\n" + "=" * 60)
    print(f"VERIFIED IDEA: {idea_id}")
    print("=" * 60)
    
    path = VERIFIED_DIR / f"{idea_id}.json"
    if not path.exists():
        print(f"Verified idea not found: {idea_id}")
        return
    
    with open(path) as f:
        data = json.load(f)
    
    print(f"\nName: {data.get('name', 'N/A')}")
    print(f"Niche: {data.get('niche', 'N/A')}")
    print(f"Status: {data.get('status', 'N/A')}")
    
    print(f"\nValidation Score: {data.get('validationScore', {}).get('total', 0)}/100")
    vs = data.get('validationScore', {})
    print(f"  Demand: {vs.get('demand', 0)}/25")
    print(f"  Willingness to Pay: {vs.get('willingnessToPay', 0)}/25")
    print(f"  Competition Gap: {vs.get('competitionGap', 0)}/20")
    print(f"  Build Feasibility: {vs.get('buildFeasibility', 0)}/20")
    print(f"  Distribution: {vs.get('distribution', 0)}/10")
    
    print(f"\nMVP Scope:")
    print(f"  {data.get('mvpScope', 'N/A')[:200]}...")
    
    print(f"\nMonetization:")
    print(f"  {data.get('monetization', 'N/A')[:200]}...")
    
    print(f"\nAcquisition Strategy:")
    print(f"  {data.get('acquisitionStrategy', 'N/A')[:200]}...")
    
    print(f"\nWedge Opportunity:")
    print(f"  {data.get('wedgeOpportunity', 'N/A')[:200]}...")
    
    print(f"\nUnknowns:")
    for u in data.get('unknowns', []):
        print(f"  - {u}")
    
    print(f"\nNext Validation Steps:")
    for s in data.get('nextValidationSteps', []):
        print(f"  - {s}")


def compare_candidates():
    """Compare promoted candidates side by side."""
    candidates = list_candidates()
    
    if len(candidates) < 2:
        print("\nNeed at least 2 candidates to compare.")
        return
    
    print("\n" + "=" * 60)
    print("CANDIDATE COMPARISON")
    print("=" * 60)
    
    print(f"\n{'Name':<30} {'Score':<8} {'Demand':<8} {'WTP':<8} {'CompGap':<8} {'Build':<8} {'Dist':<8}")
    print("-" * 90)
    
    for c in candidates[:5]:  # Top 5
        name = c.get('nicheLabel', c.get('id', 'unknown'))[:28]
        score = c.get('samuelStyleScore', 0)
        bs = c.get('scoreBreakdown', {})
        
        print(f"{name:<30} {score:<8} {bs.get('demand', 0):<8} {bs.get('willingnessToPay', 0):<8} "
              f"{bs.get('competitionGap', 0):<8} {bs.get('buildFeasibility', 0):<8} {bs.get('distribution', 0):<8}")


def mindmap_view():
    """Display mind map visualization."""
    candidates = list_candidates()
    verified = list_verified()
    
    print("\n" + "=" * 60)
    print("MIND MAP VISUALIZATION")
    print("=" * 60)
    
    print("\nASCII Mind Map:")
    print(MindMapGenerator.generate_ascii_mindmap(candidates, verified))
    
    print("\n" + "=" * 60)
    print("MERMAID DIAGRAM (for web UI):")
    print("=" * 60)
    print("\n```mermaid")
    print(MindMapGenerator.generate_mermaid_map(candidates, verified))
    print("```\n")


def relationship_map():
    """Display idea relationship map."""
    candidates = list_candidates()
    
    print("\n" + "=" * 60)
    print("IDEA RELATIONSHIP MAP")
    print("=" * 60)
    
    print(IdeaMapper.generate_relationship_graph(candidates))


def evidence_flow():
    """Display evidence flow diagram."""
    print("\n" + "=" * 60)
    print("EVIDENCE FLOW DIAGRAM")
    print("=" * 60)
    
    flow = """
    Source Registry
         │
         ▼
    Raw Evidence Collection
         │
         ▼
    Evidence Normalization
         │
         ▼
    Candidate Synthesis
         │
         ▼
    Fast Lane Scoring
         │
    ┌────┴────┐
    │         │
    ▼         ▼
Promote    Watchlist/Reject
    │
    ▼
Deep Lane Expansion
    │
    ▼
Verified Ideas
    │
    ▼
Project Blueprints
"""
    print(flow)


def theme_settings():
    """Display theme settings."""
    print("\n" + "=" * 60)
    print("THEME SETTINGS")
    print("=" * 60)
    
    print("\nAvailable themes:")
    print("  dark   - Dark background for low-light environments")
    print("  light  - Light background for bright environments")
    
    print("\nAvailable layouts:")
    print("  compact   - Dense information display")
    print("  spacious  - Airy layout with more whitespace")
    print("  focused   - Minimal view, one idea at a time")
    
    print("\nVisualization options:")
    print("  mindmap       - Hierarchical idea structure")
    print("  relationship  - Idea-to-idea connections")
    print("  evidence-flow - Data pipeline visualization")
    print("  score-grid    - Score matrix view")
    print("  timeline      - Chronological idea development")


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description='Enhanced Analyst Console for Evidence Backend',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python analyst_console.py candidates           # List all candidates
  python analyst_console.py show <id>            # Show candidate details
  python analyst_console.py verified             # List verified ideas
  python analyst_console.py mindmap              # Display mind map
  python analyst_console.py relationships        # Show idea relationships
  python analyst_console.py evidence-flow        # Show data flow
  python analyst_console.py themes               # Show theme settings
"""
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Commands')
    
    # List candidates
    subparsers.add_parser('candidates', help='List all candidates')
    
    # Show candidate
    show_parser = subparsers.add_parser('show', help='Show candidate details')
    show_parser.add_argument('id', help='Candidate ID')
    
    # List verified
    subparsers.add_parser('verified', help='List all verified ideas')
    
    # Show verified
    show_verified_parser = subparsers.add_parser('show-verified', help='Show verified idea details')
    show_verified_parser.add_argument('id', help='Verified idea ID')
    
    # Compare
    subparsers.add_parser('compare', help='Compare candidates')
    
    # Mind map
    subparsers.add_parser('mindmap', help='Display mind map visualization')
    
    # Relationships
    subparsers.add_parser('relationships', help='Show idea relationship map')
    
    # Evidence flow
    subparsers.add_parser('evidence-flow', help='Show evidence flow diagram')
    
    # Themes
    subparsers.add_parser('themes', help='Show theme and layout settings')
    
    args = parser.parse_args()
    
    if args.command == 'candidates':
        list_candidates()
    elif args.command == 'show':
        show_candidate(args.id)
    elif args.command == 'verified':
        list_verified()
    elif args.command == 'show-verified':
        show_verified(args.id)
    elif args.command == 'compare':
        compare_candidates()
    elif args.command == 'mindmap':
        mindmap_view()
    elif args.command == 'relationships':
        relationship_map()
    elif args.command == 'evidence-flow':
        evidence_flow()
    elif args.command == 'themes':
        theme_settings()
    else:
        parser.print_help()


if __name__ == '__main__':
    main()