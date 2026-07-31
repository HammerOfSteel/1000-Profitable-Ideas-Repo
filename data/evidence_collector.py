#!/usr/bin/env python3
"""
Evidence Collector - Fetches and stores raw evidence from approved sources.

This is the data-gathering backend for the Samuel-style research workflow.
It handles:
- Loading source registry configuration
- Fetching raw content from sources
- Storing raw snapshots with provenance
- Deduplication and retry handling
"""

import json
import os
import hashlib
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, List, Any
import urllib.request
import urllib.error
import time

# Configuration
BASE_DIR = Path(__file__).parent.parent
SOURCE_REGISTRY_PATH = BASE_DIR / "data" / "source-registry" / "samuel-priority-sources.json"
RAW_EVIDENCE_DIR = BASE_DIR / "data" / "evidence" / "raw"


class EvidenceCollector:
    """Collects raw evidence from approved sources."""
    
    def __init__(self, source_registry_path: str = None):
        self.source_registry_path = source_registry_path or SOURCE_REGISTRY_PATH
        self.sources = self._load_sources()
        self.raw_evidence_store: Dict[str, Dict] = {}
        
    def _load_sources(self) -> List[Dict]:
        """Load source registry from configuration file."""
        with open(self.source_registry_path, 'r') as f:
            return json.load(f)
    
    def get_enabled_sources(self) -> List[Dict]:
        """Get list of enabled sources."""
        return [s for s in self.sources if s.get('enabled', True)]
    
    def get_sources_by_class(self, source_class: str) -> List[Dict]:
        """Get sources by class."""
        return [s for s in self.get_enabled_sources() if s.get('sourceClass') == source_class]
    
    def fetch_url(self, url: str, timeout: int = 30) -> Dict[str, Any]:
        """Fetch content from a URL with retry handling."""
        max_retries = 3
        retry_delay = 2
        
        for attempt in range(max_retries):
            try:
                req = urllib.request.Request(
                    url,
                    headers={'User-Agent': 'EvidenceCollector/1.0'}
                )
                with urllib.request.urlopen(req, timeout=timeout) as response:
                    content = response.read().decode('utf-8', errors='replace')
                    return {
                        'success': True,
                        'content': content,
                        'httpStatus': response.status,
                        'contentType': response.headers.get('Content-Type', 'text/html')
                    }
            except urllib.error.URLError as e:
                if attempt < max_retries - 1:
                    time.sleep(retry_delay * (attempt + 1))
                    continue
                return {
                    'success': False,
                    'error': str(e),
                    'httpStatus': None
                }
            except Exception as e:
                return {
                    'success': False,
                    'error': str(e),
                    'httpStatus': None
                }
    
    def compute_hash(self, content: str) -> str:
        """Compute hash of content for deduplication."""
        return hashlib.sha256(content.encode('utf-8')).hexdigest()[:16]
    
    def store_raw_evidence(self, evidence: Dict[str, Any]) -> str:
        """Store raw evidence to the evidence archive."""
        # Ensure directory exists
        date_str = evidence['fetchedAt'][:10]  # YYYY-MM-DD
        source_class = evidence['sourceClass']
        evidence_id = evidence['id']
        
        dir_path = RAW_EVIDENCE_DIR / date_str / source_class
        dir_path.mkdir(parents=True, exist_ok=True)
        
        # Store the JSON record
        json_path = dir_path / f"{evidence_id}.json"
        with open(json_path, 'w') as f:
            json.dump(evidence, f, indent=2)
        
        # Store raw text separately
        if 'rawText' in evidence:
            txt_path = dir_path / f"{evidence_id}.txt"
            with open(txt_path, 'w') as f:
                f.write(evidence['rawText'])
        
        return str(json_path)
    
    def collect_from_url(self, source: Dict, url: str, entity_hint: str = None) -> Dict[str, Any]:
        """Collect evidence from a single URL."""
        timestamp = datetime.utcnow().isoformat() + 'Z'
        evidence_id = f"raw_ev_{int(datetime.utcnow().timestamp())}"
        
        # Fetch content
        result = self.fetch_url(url)
        
        evidence = {
            'id': evidence_id,
            'sourceName': source['name'],
            'sourceClass': source['sourceClass'],
            'url': url,
            'fetchedAt': timestamp,
            'collector': 'url-fetch-v1',
            'contentType': result.get('contentType', 'text/html'),
            'httpStatus': result.get('httpStatus'),
            'metadata': {
                'entityHint': entity_hint,
                'notes': f"Collected from {source['name']}",
                'supports': source.get('decisionDimensions', [])
            },
            'fetchOutcome': 'success' if result['success'] else 'failure'
        }
        
        if result['success']:
            evidence['rawText'] = result['content']
            evidence['contentHash'] = self.compute_hash(result['content'])
        else:
            evidence['error'] = result.get('error', 'Unknown error')
            evidence['rawText'] = ''
        
        # Store the evidence
        self.store_raw_evidence(evidence)
        
        return evidence


def load_source_registry() -> List[Dict]:
    """Load the source registry."""
    with open(SOURCE_REGISTRY_PATH, 'r') as f:
        return json.load(f)


def fetch_and_store(source: Dict, url: str, entity_hint: str = None) -> Dict:
    """Fetch and store evidence from a source URL."""
    collector = EvidenceCollector()
    return collector.collect_from_url(source, url, entity_hint)


if __name__ == '__main__':
    # Example usage
    collector = EvidenceCollector()
    sources = collector.get_enabled_sources()
    
    print(f"Found {len(sources)} enabled sources")
    for source in sources:
        print(f"  - {source['name']} ({source['sourceClass']})")