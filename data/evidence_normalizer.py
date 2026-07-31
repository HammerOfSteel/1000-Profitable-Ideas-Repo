#!/usr/bin/env python3
"""
Evidence Normalizer - Processes raw evidence into structured, machine-readable records.

This is the data-processing backend for the Samuel-style research workflow.
It handles:
- Extracting metrics, counts, prices, dates from raw sources
- Classifying evidence by support dimension
- Attaching confidence and notes
- Building normalized evidence output
"""

import json
import re
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict

# Configuration
BASE_DIR = Path(__file__).parent.parent
RAW_EVIDENCE_DIR = BASE_DIR / "data" / "evidence" / "raw"
NORMALIZED_EVIDENCE_DIR = BASE_DIR / "data" / "evidence" / "normalized"


@dataclass
class NormalizedEvidence:
    """Represents a normalized evidence record."""
    id: str
    entityType: str
    entityId: str
    sourceClass: str
    supports: List[str]
    title: str
    url: Optional[str]
    accessedOn: str
    claim: str
    metric: Optional[str] = None
    metricValue: Optional[float] = None
    metricUnit: Optional[str] = None
    extractionConfidence: float = 0.0
    assumption: bool = False
    notes: Optional[str] = None
    rawEvidenceId: Optional[str] = None
    
    def to_dict(self) -> Dict:
        """Convert to dictionary."""
        result = asdict(self)
        # Remove None values for cleaner output
        return {k: v for k, v in result.items() if v is not None}


class EvidenceNormalizer:
    """Normalizes raw evidence into structured records."""
    
    def __init__(self):
        self.normalized_count = 0
        self._id_counter = 0
    
    def extract_price_from_text(self, text: str) -> Optional[Dict]:
        """Extract pricing information from text."""
        # Look for price patterns like $19/month, €29 per month, etc.
        price_patterns = [
            r'\$(\d+(?:\.\d+)?)\s*(?:per\s+month|monthly|mo)',
            r'€(\d+(?:\.\d+)?)\s*(?:per\s+month|monthly|mo)',
            r'(\d+(?:\.\d+)?)\s*(?:usd|dollars?)\s*(?:per\s+month|monthly)',
            r'from\s*\$(\d+(?:\.\d+)?)',
        ]
        
        for pattern in price_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return {
                    'value': float(match.group(1)),
                    'currency': 'usd',
                    'billingUnit': 'month'
                }
        return None
    
    def extract_mrr_from_text(self, text: str) -> Optional[Dict]:
        """Extract MRR (Monthly Recurring Revenue) from text."""
        mrr_patterns = [
            r'\$(\d+(?:,\d{3})*(?:\.\d+)?)\s*MRR',
            r'MRR[:\s]*\$?(\d+(?:,\d{3})*(?:\.\d+)?)',
            r'monthly\s+revenue[:\s]*\$?(\d+(?:,\d{3})*(?:\.\d+)?)',
        ]
        
        for pattern in mrr_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                value = float(match.group(1).replace(',', ''))
                return {
                    'value': value,
                    'unit': 'usd_mrr'
                }
        return None
    
    def extract_count_from_text(self, text: str) -> Optional[Dict]:
        """Extract count/numbers from text."""
        count_patterns = [
            r'(\d+(?:,\d{3})*)\s*(?:users?|customers?|clients?)',
            r'(\d+(?:,\d{3})*)\s*(?:posts?|subscribers?|members?)',
            r'over\s*\$?(\d+(?:,\d{3})*(?:\.\d+)?)',
        ]
        
        for pattern in count_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return {
                    'value': float(match.group(1).replace(',', '')),
                    'unit': 'count'
                }
        return None
    
    def classify_claim_type(self, source_class: str, content: str) -> tuple:
        """Classify the type of claim supported by this evidence."""
        claim_types = {
            'traction': ['growth', 'users', 'customers', 'adoption', 'downloads', 'signups'],
            'willingness-to-pay': ['price', 'cost', 'paid', '$', 'subscription', 'revenue'],
            'distribution': ['channel', 'acquisition', 'seo', 'traffic', 'marketing'],
            'wedge-opportunity': ['gap', 'missing', 'frustration', 'complaint', 'need'],
            'market-activity': ['market', 'ecosystem', 'competition', 'competitor'],
            'demand-language': ['pain', 'problem', 'need', 'solution', 'help']
        }
        
        content_lower = content.lower()
        supports = []
        
        for dimension, keywords in claim_types.items():
            if any(kw in content_lower for kw in keywords):
                supports.append(dimension)
        
        return supports
    
    def normalize_evidence(self, raw_evidence: Dict) -> NormalizedEvidence:
        """Normalize a raw evidence record."""
        raw_text = raw_evidence.get('rawText', '')
        source_class = raw_evidence.get('sourceClass', 'unknown')
        url = raw_evidence.get('url', '')
        
        # Classify what this evidence supports
        supports = raw_evidence.get('metadata', {}).get('supports', [])
        if not supports:
            supports = self.classify_claim_type(source_class, raw_text)
        
        # Extract metrics based on source type
        metric_info = None
        claim = ""
        
        if source_class == 'competitor-pricing':
            metric_info = self.extract_price_from_text(raw_text)
            claim = "This product offers a paid plan at a meaningful price point"
        elif source_class == 'public-founder-proof':
            mrr_info = self.extract_mrr_from_text(raw_text)
            if mrr_info:
                metric_info = mrr_info
                claim = "This product shows public proof of monetization"
            else:
                metric_info = self.extract_price_from_text(raw_text)
                if metric_info:
                    claim = "This product offers a paid solution"
        
        # Compute confidence based on extraction success
        confidence = 0.8 if metric_info else 0.5
        
        # Generate ID based on raw evidence ID for uniqueness
        raw_id = raw_evidence.get('id', '')
        if raw_id:
            # Convert raw_ev_XXXX to ev_norm_XXXX
            evidence_id = raw_id.replace('raw_ev_', 'ev_norm_')
        else:
            self._id_counter += 1
            evidence_id = f"ev_norm_{self._id_counter:06d}"
        
        # Create normalized evidence
        normalized = NormalizedEvidence(
            id=evidence_id,
            entityType='candidate',
            entityId=raw_evidence.get('metadata', {}).get('entityHint', 'unknown'),
            sourceClass=source_class,
            supports=supports,
            title=f"Evidence from {raw_evidence.get('sourceName', 'unknown')}",
            url=url if url else None,
            accessedOn=datetime.utcnow().strftime('%Y-%m-%d'),
            claim=claim,
            metric=str(metric_info['value']) if metric_info else None,
            metricValue=metric_info['value'] if metric_info else None,
            metricUnit=metric_info.get('unit', 'usd_per_month') if metric_info else None,
            extractionConfidence=confidence,
            assumption=False,
            notes=f"Normalized from {raw_evidence.get('sourceName', 'unknown')}",
            rawEvidenceId=raw_evidence.get('id')
        )
        
        return normalized
    
    def store_normalized(self, normalized: NormalizedEvidence) -> str:
        """Store normalized evidence to disk."""
        date_str = normalized.accessedOn
        evidence_id = normalized.id
        
        dir_path = NORMALIZED_EVIDENCE_DIR / date_str
        dir_path.mkdir(parents=True, exist_ok=True)
        
        json_path = dir_path / f"{evidence_id}.json"
        with open(json_path, 'w') as f:
            json.dump(normalized.to_dict(), f, indent=2)
        
        self.normalized_count += 1
        return str(json_path)


def normalize_raw_evidence(raw_evidence: Dict) -> Dict:
    """Convenience function to normalize a raw evidence record."""
    normalizer = EvidenceNormalizer()
    normalized = normalizer.normalize_evidence(raw_evidence)
    path = normalizer.store_normalized(normalized)
    return {
        'normalized': normalized.to_dict(),
        'stored_at': path
    }


if __name__ == '__main__':
    # Example usage
    normalizer = EvidenceNormalizer()
    print(f"Evidence Normalizer initialized")
    print(f"Looking for raw evidence in: {RAW_EVIDENCE_DIR}")
    print(f"Output will be stored in: {NORMALIZED_EVIDENCE_DIR}")