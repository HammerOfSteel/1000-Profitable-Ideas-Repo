#!/usr/bin/env python3
"""
Candidate Synthesizer - Groups evidence into candidate idea dossiers.

This is the Fast Lane engine for the Samuel-style research workflow.
It handles:
- Grouping evidence around comparable products
- Computing simple triage signals
- Inferring wedge opportunities from complaints
- Flagging replicable acquisition signals
- Labeling maintainability level
- Emitting candidate dossiers with promote/reject/watchlist recommendation
"""

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict, field
from collections import defaultdict

# Configuration
BASE_DIR = Path(__file__).parent.parent
RAW_EVIDENCE_DIR = BASE_DIR / "data" / "evidence" / "raw"
NORMALIZED_EVIDENCE_DIR = BASE_DIR / "data" / "evidence" / "normalized"
CANDIDATES_DIR = BASE_DIR / "data" / "candidates"


@dataclass
class ScoreBreakdown:
    """Detailed breakdown of candidate score."""
    demand: int = 0
    willingnessToPay: int = 0
    competitionGap: int = 0
    buildFeasibility: int = 0
    distribution: int = 0


@dataclass
class WedgeHypothesis:
    """A wedge or improvement opportunity."""
    description: str
    evidenceRefs: List[str] = field(default_factory=list)


@dataclass
class CandidateDossier:
    """Represents a candidate idea dossier."""
    id: str
    nicheLabel: str
    problemSummary: str
    comparableProducts: List[str] = field(default_factory=list)
    tractionEvidenceRefs: List[str] = field(default_factory=list)
    pricingEvidenceRefs: List[str] = field(default_factory=list)
    acquisitionEvidenceRefs: List[str] = field(default_factory=list)
    complexityNotes: str = ""
    wedgeHypotheses: List[WedgeHypothesis] = field(default_factory=list)
    acquisitionNotes: str = ""
    maintainabilityNotes: str = ""
    samuelStyleScore: int = 0
    scoreBreakdown: ScoreBreakdown = field(default_factory=ScoreBreakdown)
    promotionStatus: str = "watchlist"
    promotionRationale: str = ""
    createdOn: str = ""
    lastUpdated: str = ""
    
    def to_dict(self) -> Dict:
        """Convert to dictionary."""
        result = asdict(self)
        # Convert nested objects
        if 'scoreBreakdown' in result and isinstance(result['scoreBreakdown'], ScoreBreakdown):
            result['scoreBreakdown'] = asdict(result['scoreBreakdown'])
        if 'wedgeHypotheses' in result:
            result['wedgeHypotheses'] = [asdict(w) if hasattr(w, '__dataclass_fields__') else w for w in result['wedgeHypotheses']]
        return result


class CandidateSynthesizer:
    """Synthesizes candidate idea dossiers from normalized evidence."""
    
    def __init__(self):
        self.evidence_index: Dict[str, List[Dict]] = defaultdict(list)
        self.candidates: Dict[str, CandidateDossier] = {}
    
    def load_normalized_evidence(self) -> List[Dict]:
        """Load all normalized evidence records."""
        evidence_list = []
        if not NORMALIZED_EVIDENCE_DIR.exists():
            return evidence_list
        
        for date_dir in NORMALIZED_EVIDENCE_DIR.iterdir():
            if date_dir.is_dir():
                for json_file in date_dir.glob("*.json"):
                    try:
                        with open(json_file, 'r') as f:
                            evidence = json.load(f)
                            evidence_list.append(evidence)
                    except Exception:
                        continue
        
        return evidence_list
    
    def index_evidence_by_entity(self, evidence_list: List[Dict]):
        """Index evidence by entity (candidate) ID."""
        for evidence in evidence_list:
            entity_id = evidence.get('entityId', 'unknown')
            self.evidence_index[entity_id].append(evidence)
    
    def compute_samuel_score(self, evidence_refs: List[str], evidence_list: List[Dict]) -> tuple:
        """
        Compute Samuel-style score based on evidence.
        
        Returns (score, breakdown)
        """
        # Load evidence details
        evidence_details = []
        for ref in evidence_refs:
            for e in evidence_list:
                if e.get('id') == ref:
                    evidence_details.append(e)
                    break
        
        # Score based on evidence presence and quality
        demand = 0
        willingness_to_pay = 0
        competition_gap = 0
        build_feasibility = 0
        distribution = 0
        
        for evidence in evidence_details:
            supports = evidence.get('supports', [])
            confidence = evidence.get('extractionConfidence', 0.5)
            
            # Map evidence types to score dimensions
            for s in supports:
                if s in ['traction', 'demand', 'demand-language', 'market-activity']:
                    demand += int(8 * confidence)
                elif s in ['willingness-to-pay', 'packaging']:
                    willingness_to_pay += int(8 * confidence)
                elif s in ['wedge-opportunity', 'competition-gap']:
                    competition_gap += int(10 * confidence)
                elif s in ['distribution', 'replicability', 'go-to-market']:
                    distribution += int(7 * confidence)
        
        # Cap scores according to rubric
        demand = min(25, demand)
        willingness_to_pay = min(25, willingness_to_pay)
        competition_gap = min(20, competition_gap)
        build_feasibility = 15  # Default assumption for AI-assisted build
        distribution = min(10, distribution)
        
        total = demand + willingness_to_pay + competition_gap + build_feasibility + distribution
        
        breakdown = ScoreBreakdown(
            demand=demand,
            willingnessToPay=willingness_to_pay,
            competitionGap=competition_gap,
            buildFeasibility=build_feasibility,
            distribution=distribution
        )
        
        return total, breakdown
    
    def infer_wedge_opportunities(self, evidence_list: List[Dict]) -> List[WedgeHypothesis]:
        """Infer wedge opportunities from complaint and review evidence."""
        wedges = []
        
        # Look for complaints indicating gaps
        for evidence in evidence_list:
            notes = evidence.get('notes', '').lower()
            claim = evidence.get('claim', '').lower()
            
            # Check for pain points
            if any(word in notes or word in claim for word in ['frustration', 'pain', 'gap', 'missing', 'complaint']):
                wedges.append(WedgeHypothesis(
                    description=f"Gap identified: {evidence.get('title', 'Unknown evidence')}",
                    evidenceRefs=[evidence.get('id')]
                ))
        
        return wedges
    
    def determine_promotion_status(self, score: int) -> tuple:
        """Determine promotion status based on score."""
        if score >= 80:
            return "promote", "Strong candidate with high confidence score"
        elif score >= 70:
            return "promote", "Good candidate meeting minimum threshold"
        elif score >= 50:
            return "watchlist", "Worth monitoring, needs more evidence"
        else:
            return "reject", "Below minimum threshold, not recommended"
    
    def synthesize_candidate(self, entity_id: str, evidence_list: List[Dict]) -> CandidateDossier:
        """Synthesize a candidate dossier from evidence."""
        timestamp = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
        
        # Separate evidence by type
        traction_refs = [e['id'] for e in evidence_list if 'traction' in e.get('supports', [])]
        pricing_refs = [e['id'] for e in evidence_list if 'willingness-to-pay' in e.get('supports', [])]
        acquisition_refs = [e['id'] for e in evidence_list if 'distribution' in e.get('supports', [])]
        all_refs = [e['id'] for e in evidence_list]
        
        # Compute score
        score, breakdown = self.compute_samuel_score(all_refs, evidence_list)
        
        # Infer wedge opportunities
        wedges = self.infer_wedge_opportunities(evidence_list)
        
        # Determine promotion status
        status, rationale = self.determine_promotion_status(score)
        
        # Build comparable products list
        comparable = []
        for e in evidence_list:
            claim = e.get('claim', '')
            if 'product' in claim.lower() or 'competitor' in claim.lower():
                comparable.append(e.get('title', ''))
        
        # Create dossier
        dossier = CandidateDossier(
            id=entity_id,
            nicheLabel=entity_id.replace('_', ' ').title(),
            problemSummary=f"Problem identified from evidence for {entity_id}",
            comparableProducts=list(set(comparable)),
            tractionEvidenceRefs=traction_refs,
            pricingEvidenceRefs=pricing_refs,
            acquisitionEvidenceRefs=acquisition_refs,
            complexityNotes="Can leverage existing AI tools and APIs for MVP",
            wedgeHypotheses=wedges,
            acquisitionNotes="SEO, content marketing, and community outreach viable",
            maintainabilityNotes="Low operational burden, API-based architecture",
            samuelStyleScore=score,
            scoreBreakdown=breakdown,
            promotionStatus=status,
            promotionRationale=rationale,
            createdOn=timestamp,
            lastUpdated=timestamp
        )
        
        return dossier
    
    def synthesize_all_candidates(self) -> Dict[str, CandidateDossier]:
        """Synthesize all candidate dossiers from evidence."""
        evidence_list = self.load_normalized_evidence()
        self.index_evidence_by_entity(evidence_list)
        
        for entity_id, evidence in self.evidence_index.items():
            dossier = self.synthesize_candidate(entity_id, evidence)
            self.candidates[entity_id] = dossier
        
        return self.candidates
    
    def store_candidate(self, dossier: CandidateDossier) -> str:
        """Store candidate dossier to disk."""
        json_path = CANDIDATES_DIR / f"{dossier.id}.json"
        with open(json_path, 'w') as f:
            json.dump(dossier.to_dict(), f, indent=2)
        return str(json_path)


def create_candidate_dossier(entity_id: str, evidence_list: List[Dict]) -> Dict:
    """Convenience function to create a candidate dossier."""
    synthesizer = CandidateSynthesizer()
    dossier = synthesizer.synthesize_candidate(entity_id, evidence_list)
    path = synthesizer.store_candidate(dossier)
    return {
        'dossier': dossier.to_dict(),
        'stored_at': path
    }


if __name__ == '__main__':
    synthesizer = CandidateSynthesizer()
    candidates = synthesizer.synthesize_all_candidates()
    print(f"Synthesized {len(candidates)} candidates")
    
    for candidate_id, dossier in candidates.items():
        print(f"  - {candidate_id}: score={dossier.samuelStyleScore}, status={dossier.promotionStatus}")
        synthesizer.store_candidate(dossier)