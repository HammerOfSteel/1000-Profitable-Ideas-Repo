# Validation Rubric

This rubric decides whether an idea belongs in the repository and how strongly it should be ranked in the product UI.

## Scoring model

Every idea is scored out of **100**.

| Dimension | Weight | Core Question |
| :--- | :---: | :--- |
| Demand | 25 | Is there clear recurring pain or active market pull? |
| Willingness to Pay | 25 | Do buyers already spend money to solve this problem? |
| Competition Gap | 20 | Is there a clear wedge against incumbents or status quo solutions? |
| Build Feasibility | 20 | Can an AI-assisted solo builder realistically ship an MVP? |
| Distribution | 10 | Is there a reachable path to early users and first revenue? |

## Minimum threshold

- **Minimum accepted score:** `70 / 100`
- Any idea scoring below 70 should be revised or replaced before it is included in the canonical dataset.

---

## 1. Demand — 25 points

Measures whether the problem is real, frequent, and painful.

### Score guidance

| Range | Interpretation |
| :--- | :--- |
| 0-5 | Weak or speculative demand; little evidence of urgency |
| 6-12 | Some evidence of interest, but pain may be occasional or vague |
| 13-19 | Clear recurring demand with visible pain signals |
| 20-25 | Strong repeated pain, active demand, and obvious need for improvement |

### Positive indicators

- users repeatedly asking for help in forums or communities
- recurring manual workflows
- search demand around the pain/problem
- repeated complaints in competitor reviews
- deadlines, compliance pressure, revenue pressure, or operational bottlenecks

### Evidence examples

- search trend data
- Reddit / community threads
- review-site complaints
- support or workflow pain documented by operators
- job postings or consulting offers around the same problem

---

## 2. Willingness to Pay — 25 points

Measures whether buyers have budget or already spend time/money to solve the problem.

### Score guidance

| Range | Interpretation |
| :--- | :--- |
| 0-5 | No visible spending behavior |
| 6-12 | Indirect or weak evidence of budget |
| 13-19 | Buyers already pay through tools, agencies, or labor |
| 20-25 | Strong existing spend and clear ROI replacement path |

### Positive indicators

- existing paid tools in the niche
- consultant or agency services used today
- high manual labor cost
- obvious cost of delay or error
- pricing anchors already accepted in the market

### Evidence examples

- competitor pricing pages
- agency retainers
- labor-hour replacement calculations
- marketplace listings
- customer spending patterns in adjacent tools

---

## 3. Competition Gap — 20 points

Measures whether there is room for a differentiated product.

### Score guidance

| Range | Interpretation |
| :--- | :--- |
| 0-4 | Market is crowded with strong, well-loved incumbents and no wedge |
| 5-9 | Some weaknesses exist but wedge is unclear |
| 10-15 | Real opportunity through focus, UX, AI leverage, or pricing |
| 16-20 | Clear strategic wedge with visible dissatisfaction or under-service |

### Positive indicators

- incumbent tools are bloated or overpriced
- poor UX or weak onboarding in current products
- underserved niche persona
- manual alternatives still common
- new AI workflow unlocks a cheaper or better approach

### Evidence examples

- competitor reviews
- complaints in communities
- product gaps on pricing/features
- underserved niche segments
- evidence that users stitch together multiple tools today

---

## 4. Build Feasibility — 20 points

Measures whether a solo AI-assisted builder can realistically ship and maintain an MVP.

### Score guidance

| Range | Interpretation |
| :--- | :--- |
| 0-4 | Requires large team, heavy regulation, or major infrastructure risk |
| 5-9 | Possible, but MVP scope is still large or uncertain |
| 10-15 | Realistic if tightly scoped |
| 16-20 | Clear narrow MVP with manageable implementation risk |

### Positive indicators

- can be built with known web/product patterns
- clear thin-slice MVP exists
- affordable APIs or infrastructure
- limited operational overhead
- complexity can be deferred out of the first release

### Evidence examples

- known stack suitability
- manageable integration count
- low initial compliance burden
- constrained user workflows
- clear v0.1 feature boundary

---

## 5. Distribution — 10 points

Measures whether the builder can actually reach users.

### Score guidance

| Range | Interpretation |
| :--- | :--- |
| 0-2 | No obvious way to reach the audience |
| 3-5 | Audience exists, but channel strategy is weak |
| 6-8 | Reachable communities or outbound paths exist |
| 9-10 | Strong direct channels and concrete first-user acquisition path |

### Positive indicators

- niche communities
- outbound-friendly customer type
- SEO-friendly problem space
- marketplace or ecosystem distribution
- partnerships or consultants already serving the audience

### Evidence examples

- subreddit, Slack, Discord, LinkedIn, or forums
- app marketplaces
- partner/referral channels
- direct prospect lists
- creator or newsletter audiences in the niche

---

## Quality requirements beyond score

A passing idea must also satisfy all of the following:

- at least one **dated evidence link**
- a clearly named **target user or buyer**
- a coherent **problem statement**
- a plausible **pricing hypothesis**
- a reasonable **MVP scope**
- no obvious near-duplicate of an existing idea

An idea with a passing raw score can still be rejected if it is too vague, duplicate, or unsupported.

---

## Status guidance

Use score and completeness together to assign lifecycle status:

| Status | Meaning |
| :--- | :--- |
| `Idea` | Early concept, not yet fully scored or supported |
| `Validated` | Meets the minimum score with evidence |
| `Blueprinted` | Has the required documentation and execution framing |
| `Ready to Build` | Blueprint is actionable and MVP scope is concrete |

---

## UI usage guidance

The frontend should use this rubric for:

- displaying validation score
- filtering ideas by score bands
- ranking promising ideas
- explaining why one idea is stronger than another
- surfacing low-effort / high-opportunity candidates

---

## Short scoring checklist

Before accepting an idea, confirm:

- [ ] The demand is evidenced
- [ ] Buyers already spend money or labor here
- [ ] A realistic wedge exists
- [ ] MVP can be built by a solo AI-assisted developer
- [ ] There is a believable path to first users
- [ ] Total score is at least 70
- [ ] The idea is not a near-duplicate