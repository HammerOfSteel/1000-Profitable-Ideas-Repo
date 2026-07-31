# Analyst Console

A command-line interface for exploring evidence-backed project ideas.

## Features

- **Theme Support**: Dark/light mode for different environments
- **Mind Map Visualization**: Hierarchical view of ideas and evidence
- **Idea Relationships**: See connections between different ideas
- **Evidence Flow**: Understand the data pipeline
- **Candidate Comparison**: Compare multiple ideas side-by-side

## Usage

```bash
# List all candidates
python3 data/analyst_console.py candidates

# Show candidate details
python3 data/analyst_console.py show <candidate-id>

# List verified ideas
python3 data/analyst_console.py verified

# Show verified idea details
python3 data/analyst_console.py show-verified <idea-id>

# Display mind map
python3 data/analyst_console.py mindmap

# Show idea relationships
python3 data/analyst_console.py relationships

# Display evidence flow
python3 data/analyst_console.py evidence-flow

# Show theme settings
python3 data/analyst_console.py themes
```

## Mind Map Visualization

The mind map shows:
- Root: "1000 Profitable Ideas"
- Promoted Ideas (Score, Status)
- Verified Ideas (Score, Status, MVP scope)
- Evidence branches (Demand, WTP, Competition Gap, Distribution)

## Data Flow

```
Source Registry → Raw Evidence → Normalized Evidence → 
Candidates → Fast Lane Scores → Promote/Reject → Deep Lane → 
Verified Ideas → Project Blueprints
```

## Theme Settings

Available themes:
- `dark` - Dark background for low-light environments
- `light` - Light background for bright environments

Available layouts:
- `compact` - Dense information display
- `spacious` - Airy layout with more whitespace
- `focused` - Minimal view, one idea at a time

Visualization options:
- `mindmap` - Hierarchical idea structure
- `relationship` - Idea-to-idea connections
- `evidence-flow` - Data pipeline visualization
- `score-grid` - Score matrix view
- `timeline` - Chronological idea development