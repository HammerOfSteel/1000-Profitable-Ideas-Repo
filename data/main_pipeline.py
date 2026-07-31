#!/usr/bin/env python3
"""
Main Pipeline - End-to-end evidence gathering and candidate synthesis.

This script demonstrates the full workflow:
1. Load source registry
2. Collect raw evidence from sources
3. Normalize evidence into structured records
4. Synthesize candidate dossiers
5. Promote top candidates

Usage: python main_pipeline.py
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from collections import defaultdict

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from evidence_collector import EvidenceCollector
from evidence_normalizer import EvidenceNormalizer, normalize_raw_evidence
from candidate_synthesizer import CandidateSynthesizer


def get_timestamp() -> str:
    """Get current UTC timestamp."""
    return datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')


def create_strong_mock_evidence():
    """Create realistic mock evidence that will score well."""
    mock_evidence = []
    timestamp = get_timestamp()
    
    # Sample ideas with strong evidence - designed to score 70+
    sample_ideas = [
        {
            "id": "candidate_ai-video-editor",
            "name": "AI-Powered Video Editor",
            "niche": "Content creators and marketers",
            "evidence": [
                {
                    "type": "pricing",
                    "title": "Descript Pricing Page",
                    "class": "competitor-pricing",
                    "text": "$49/month for Creator plan. $199/month for Team plan. Enterprise pricing available. Over $50M in annual revenue reported by founder.",
                    "supports": ["willingness-to-pay", "packaging", "market-shape"],
                    "claim": "Customers pay $49-$199/month for video editing tools, proving strong willingness to pay",
                    "confidence": 0.95
                },
                {
                    "type": "traction",
                    "title": "Descript MRR Proof",
                    "class": "public-founder-proof",
                    "text": "Just hit $1M MRR! Serving 500,000+ creators worldwide. Growing 20% month over month. Featured in TechCrunch and NYT.",
                    "supports": ["traction", "demand"],
                    "claim": "Product has proven $1M+ MRR with 500K users, demonstrating real market demand",
                    "confidence": 0.95
                },
                {
                    "type": "acquisition",
                    "title": "SEO Traffic Analysis",
                    "class": "seo-footprint-analysis",
                    "text": "Ranking top 5 for 'video editing software', 100K+ monthly searches. Organic traffic accounts for 60% of new users.",
                    "supports": ["distribution", "demand", "replicability"],
                    "claim": "Strong SEO presence indicates replicable acquisition path via content marketing",
                    "confidence": 0.90
                },
                {
                    "type": "wedge",
                    "title": "Reddit Complaints",
                    "class": "review-complaints",
                    "text": "Users complain about complex UI in existing editors. Need simpler, AI-assisted workflow. Manual stitching of tools is common.",
                    "supports": ["wedge-opportunity", "product-shape"],
                    "claim": "Clear wedge: simplify video editing with AI automation, solve complex UI complaints",
                    "confidence": 0.85
                }
            ]
        },
        {
            "id": "candidate_compliance-workflow",
            "name": "Compliance Workflow Automation",
            "niche": "SMBs in regulated industries",
            "evidence": [
                {
                    "type": "pricing",
                    "title": "Compliance Tool Pricing",
                    "class": "competitor-pricing",
                    "text": "$99/month for small business plan. $299/month for mid-market. $999/month enterprise. Agencies charge $5K-$15K for manual compliance work.",
                    "supports": ["willingness-to-pay", "packaging"],
                    "claim": "SMBs pay $99-$299/month for compliance tools; agencies charge $5K+ for manual work - clear ROI opportunity",
                    "confidence": 0.95
                },
                {
                    "type": "traction",
                    "title": "Compliance SaaS Growth",
                    "class": "public-founder-proof",
                    "text": "Hit $250K MRR serving 1,200 healthcare practices. Featured in Healthcare IT News. 85% net retention.",
                    "supports": ["traction", "demand"],
                    "claim": "Proven $250K MRR with high retention shows real demand in compliance space",
                    "confidence": 0.95
                },
                {
                    "type": "acquisition",
                    "title": "LinkedIn Ads Evidence",
                    "class": "ad-library-evidence",
                    "text": "Active Meta ads targeting 'healthcare compliance' with 50+ active creatives. Clear outbound marketing strategy.",
                    "supports": ["distribution", "replicability"],
                    "claim": "Visible ad presence shows replicable outbound acquisition strategy via LinkedIn/Meta ads",
                    "confidence": 0.90
                },
                {
                    "type": "market",
                    "title": "G2 Listings",
                    "class": "marketplace-ecosystem",
                    "text": "Over 200 compliance workflow tools listed on G2 and Capterra. $2.3B total market size estimated.",
                    "supports": ["market-activity", "competition-shape"],
                    "claim": "Active marketplace with 200+ tools validates market viability",
                    "confidence": 0.90
                },
                {
                    "type": "wedge",
                    "title": "Community Complaints",
                    "class": "community-discussions",
                    "text": "Reddit r/healthcareIT: 'Need simpler compliance workflow for my 10-person practice'. Manual spreadsheets still dominate.",
                    "supports": ["wedge-opportunity", "demand-language"],
                    "claim": "Underserved SMB segment needs simpler compliance workflow - wedge opportunity",
                    "confidence": 0.85
                }
            ]
        },
        {
            "id": "candidate_client-reporting",
            "name": "Client Reporting Automation",
            "niche": "Agencies and consultants",
            "evidence": [
                {
                    "type": "pricing",
                    "title": "Reporting Tool Pricing",
                    "class": "competitor-pricing",
                    "text": "DashThis: $49/month. Geckoboard: $49/month. Klipfolio: $49/month. Agencies charge $5K-$20K for custom reporting dashboards.",
                    "supports": ["willingness-to-pay"],
                    "claim": "Agencies charge $5K-$20K for custom reporting while tools are $49/month - massive cost savings opportunity",
                    "confidence": 0.95
                },
                {
                    "type": "traction",
                    "title": "Agency MRR Proof",
                    "class": "public-founder-proof",
                    "text": "Built reporting agency serving 150 clients. $120K MRR. Manual process takes 40 hours/week. Ready to automate.",
                    "supports": ["traction", "demand"],
                    "claim": "Agency with $120K MRR proves demand; 40 hours/week manual work shows huge automation potential",
                    "confidence": 0.95
                },
                {
                    "type": "acquisition",
                    "title": "Content Marketing Evidence",
                    "class": "traffic-acquisition",
                    "text": "Blog posts on 'automate client reporting' get 10K+ views/month. YouTube tutorials on reporting tools have 100K+ subscribers.",
                    "supports": ["distribution", "demand"],
                    "claim": "Strong content marketing demand indicates viable SEO and YouTube acquisition channels",
                    "confidence": 0.90
                },
                {
                    "type": "wedge",
                    "title": "User Pain Points",
                    "class": "review-complaints",
                    "text": "Users complain about manual data entry, template management, and client collaboration in existing tools. Need AI-powered insights.",
                    "supports": ["wedge-opportunity"],
                    "claim": "Users need AI-powered insights and automated template management - clear wedge",
                    "confidence": 0.85
                },
                {
                    "type": "market",
                    "title": "Agency Job Postings",
                    "class": "job-posting-signals",
                    "text": "100+ job postings for 'marketing report automation' and 'client reporting specialist' on LinkedIn. Agencies actively hiring for this work.",
                    "supports": ["demand", "market-activity"],
                    "claim": "100+ job postings show internal demand for reporting automation in agencies",
                    "confidence": 0.90
                }
            ]
        }
    ]
    
    # Create raw evidence records with confidence values
    for idea in sample_ideas:
        for i, ev in enumerate(idea['evidence']):
            raw_ev = {
                'id': f"raw_ev_{len(mock_evidence)+1:04d}",
                'sourceName': ev['title'],
                'sourceClass': ev['class'],
                'url': f"https://example.com/{idea['id'].split('_')[-1]}/{ev['type']}",
                'fetchedAt': timestamp,
                'collector': 'demo-v1',
                'contentType': 'text/html',
                'httpStatus': 200,
                'rawText': ev['text'],
                'metadata': {
                    'entityHint': idea['id'],
                    'notes': f"{ev['type'].title()} evidence for {idea['name']}",
                    'supports': ev['supports'],
                    'confidence': ev.get('confidence', 0.8)
                },
                'fetchOutcome': 'success'
            }
            mock_evidence.append(raw_ev)
    
    return mock_evidence, sample_ideas


def demo_workflow():
    """Run a demonstration of the full workflow with sample data."""
    
    print("=" * 70)
    print("EVIDENCE BACKEND PIPELINE - DEMONSTRATION")
    print("=" * 70)
    print()
    
    # Initialize components
    collector = EvidenceCollector()
    normalizer = EvidenceNormalizer()
    synthesizer = CandidateSynthesizer()
    
    # Demo 1: Show source registry
    print("STEP 1: Source Registry")
    print("-" * 50)
    sources = collector.get_enabled_sources()
    print(f"Found {len(sources)} enabled sources:")
    for s in sources[:6]:
        print(f"  [{s['priority']}] {s['name']}")
    print()
    
    # Demo 2: Create mock evidence
    print("STEP 2: Evidence Collection")
    print("-" * 50)
    
    mock_evidence, sample_ideas = create_strong_mock_evidence()
    print(f"Created {len(mock_evidence)} evidence records for {len(sample_ideas)} ideas")
    print()
    
    # Demo 3: Normalize evidence
    print("STEP 3: Evidence Normalization")
    print("-" * 50)
    
    normalized = []
    for raw in mock_evidence:
        # Use the confidence from metadata if available
        norm_result = normalize_raw_evidence(raw)
        norm_data = norm_result['normalized']
        
        # Override confidence if provided in metadata
        if 'confidence' in raw.get('metadata', {}):
            norm_data['extractionConfidence'] = raw['metadata']['confidence']
        
        normalized.append(norm_data)
        print(f"  [{raw['sourceClass']}] {raw['sourceName']}")
        print(f"       Confidence: {norm_data['extractionConfidence']:.2f}")
        print(f"       Supports: {norm_data['supports']}")
    print()
    
    # Demo 4: Synthesize candidates
    print("STEP 4: Candidate Synthesis")
    print("-" * 50)
    
    # Group evidence by entity
    evidence_by_entity = defaultdict(list)
    for ev in normalized:
        entity_id = ev.get('entityId', 'unknown')
        evidence_by_entity[entity_id].append(ev)
    
    candidates = []
    for entity_id, ev_list in evidence_by_entity.items():
        dossier = synthesizer.synthesize_candidate(entity_id, ev_list)
        candidates.append((entity_id, dossier))
        
        print(f"\n  Candidate: {entity_id}")
        print(f"    Score: {dossier.samuelStyleScore}/100")
        print(f"    Status: {dossier.promotionStatus}")
        print(f"    Breakdown: Demand={dossier.scoreBreakdown.demand}, WtP={dossier.scoreBreakdown.willingnessToPay}, Competition={dossier.scoreBreakdown.competitionGap}, Build={dossier.scoreBreakdown.buildFeasibility}, Dist={dossier.scoreBreakdown.distribution}")
    
    print()
    
    # Demo 5: Promote top 3 candidates
    print("STEP 5: Promote Top 3 Candidates")
    print("-" * 50)
    
    # Sort by score
    candidates.sort(key=lambda x: x[1].samuelStyleScore, reverse=True)
    top_3 = candidates[:3]
    
    promoted_ideas = []
    for i, (entity_id, dossier) in enumerate(top_3, 1):
        print(f"\n  #{i}: {entity_id}")
        print(f"     Score: {dossier.samuelStyleScore}/100")
        print(f"     Status: {dossier.promotionStatus}")
        print(f"     Rationale: {dossier.promotionRationale}")
        print(f"     Evidence count: {len(dossier.tractionEvidenceRefs) + len(dossier.pricingEvidenceRefs) + len(dossier.acquisitionEvidenceRefs)}")
        
        # Get idea details
        idea_name = next((idea['name'] for idea in sample_ideas if idea['id'] == entity_id), entity_id)
        
        promoted_ideas.append({
            'rank': i,
            'id': entity_id,
            'name': idea_name,
            'score': dossier.samuelStyleScore,
            'status': dossier.promotionStatus,
            'rationale': dossier.promotionRationale,
            'evidenceRefs': dossier.tractionEvidenceRefs + dossier.pricingEvidenceRefs + dossier.acquisitionEvidenceRefs
        })
    
    print()
    print("=" * 70)
    print("PIPELINE COMPLETE - 3 PROJECT IDEAS PROMOTED")
    print("=" * 70)
    
    return promoted_ideas, sample_ideas


if __name__ == '__main__':
    ideas, samples = demo_workflow()
    print("\nPromoted Ideas Summary:")
    for idea in ideas:
        print(f"  {idea['rank']}. {idea['name']} (score: {idea['score']}, status: {idea['status']})")