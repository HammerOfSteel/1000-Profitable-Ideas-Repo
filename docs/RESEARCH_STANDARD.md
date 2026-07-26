# Research Standard

This document defines the minimum evidence quality required for categories, sub-categories, and ideas in the `1000 Profitable Ideas` repository.

## Core rule

No meaningful market claim should exist in the dataset or blueprint files without a **dated supporting source**.

Every important statement about demand, pricing, competition, feasibility, or distribution should be traceable to evidence.

---

## What requires evidence

Evidence is expected for claims in all of these areas:

- category thesis
- sub-category thesis
- target market definition
- demand signals
- willingness-to-pay claims
- competition gap claims
- pricing hypotheses
- distribution channel assumptions
- market timing or trend arguments

---

## Minimum evidence requirements

### Category level

Each category should include:

- at least **1 dated source** supporting the macro thesis
- a defensible target market summary
- a clear explanation for why the category is profitable or durable

### Sub-category level

Each sub-category should include:

- at least **1 dated source** supporting the niche thesis
- evidence that the niche is distinct and commercially meaningful
- a target market or buyer segment description

### Idea/project level

Each idea should include:

- at least **1 dated source**
- a problem statement tied to observable pain
- evidence of willingness to pay or equivalent labor cost
- a non-hand-wavy pricing hypothesis
- some signal of reachable distribution

For stronger ideas, prefer **2-3 sources** spanning different dimensions.

---

## Allowed evidence types

The following source classes are acceptable when they are relevant and recent enough:

- search trend or search demand data
- competitor pricing pages
- public review sites and review complaints
- public communities such as Reddit, forums, Slack/Discord discussions, LinkedIn discussions
- marketplace listings and ecosystem data
- vendor, platform, or API growth signals
- founder case studies or public revenue breakdowns
- agency and consultant pricing
- job postings indicating recurring internal demand
- industry reports or surveys
- government or regulatory sources when compliance is part of the thesis

---

## Preferred evidence mix

A strong idea usually combines multiple evidence types, for example:

- **Demand:** search trend + community complaints
- **Willingness to pay:** competitor pricing + agency/service spend
- **Competition gap:** review complaints + underserved niche
- **Distribution:** existing communities + outbound-friendly audience

Avoid relying on only one vague source type across the entire idea.

---

## Source formatting

Use a dated reference style consistently.

### In prose

- Mention what the source supports
- Do not drop links without context

### In lists or structured fields

Use this format:

`Title — URL — accessed YYYY-MM-DD`

### In structured taxonomy data

Use:

```json
{
  "title": "Example source",
  "url": "https://example.com",
  "accessedOn": "2026-07-26",
  "sourceType": "competitor-pricing",
  "notes": "Supports willingness to pay"
}
```

---

## Source quality guidance

Prefer sources that are:

- recent
- specific to the niche
- directly tied to the claim
- publicly reviewable
- concrete rather than interpretive

Use caution with sources that are:

- undated
- generic thought leadership
- weakly related to the problem
- promotional without data
- derivative summaries of other unsourced claims

---

## Freshness expectations

As a default:

- pricing and competitor signals should be reasonably current
- community and search signals should not be obviously stale
- fast-moving AI/tooling claims should be checked more recently than slow-moving category claims

If a source may have aged badly, refresh it before using it to justify a high-confidence conclusion.

---

## What does not count as evidence

The following are not enough on their own:

- intuition
- “this seems useful”
- broad AI optimism
- one vague anecdote without context
- copying another idea list
- generic startup advice
- unsupported claims about TAM or willingness to pay

---

## Evidence notes in blueprints

Blueprints should make clear:

- what each source supports
- whether the source supports demand, pricing, competition, or distribution
- what still remains uncertain

Evidence should reduce uncertainty, not hide it.

---

## Handling uncertainty

If evidence is incomplete, mark the idea honestly.

Appropriate actions include:

- keep status as `Idea`
- lower the validation score
- list missing proof under `What to Validate Next`
- avoid promoting the idea as `Ready to Build`

---

## Evidence checklist

Before treating an idea as validated, confirm:

- [ ] At least one dated source exists
- [ ] The source actually supports the claim being made
- [ ] Demand is evidenced
- [ ] Willingness to pay is evidenced or plausibly anchored
- [ ] The competition gap is not purely asserted
- [ ] The distribution path is not imaginary
- [ ] Any remaining uncertainty is explicitly called out