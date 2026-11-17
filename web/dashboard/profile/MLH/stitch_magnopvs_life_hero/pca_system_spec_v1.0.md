# MagnopVS · PCA System Specification (v1.0)

## 1. Initial Test Schema
The onboarding test maps directly to the 13 Houses, 5 Attributes, and Alignment scores.

| Block | Questions | Mapping |
| :--- | :--- | :--- |
| **Physical** | 8 | Health House, Strength, Agility |
| **Cognitive** | 8 | Intellect House, Intelligence |
| **Relational** | 10 | Emotions, Partner, Family, Community, Charisma |
| **Spiritual** | 8 | Spirituality, Purpose, Legacy, Brilliance |
| **Material** | 6 | Finance, Vocation, Lifestyle |
| **Alignment** | 6 | Light / Balance / Shadow |

**Output:** `vector_13_houses[0-100]` + `vector_5_attributes[1-100]` + `alignment_score[-100..100]`

## 2. Diagnostic Algorithm (Deterministic)
1. **Ranking:** Sort 13 Houses -> identify Top 2 (Strengths) and Bottom 2 (Priorities).
2. **Variance Check:** High variance triggers "Structural Imbalance" logic.
3. **Archetype Lookup:** Cross Alignment + Dominant Attribute to assign initial Mentor/Archetype.
4. **Narrative Layer:** LLM generates 3 paragraphs based *strictly* on the vector data.

## 3. Habit Taxonomy & Limits
- **Limits:** Max 3 active habits during onboarding (Profane/Worker level).
- **Graduation:** Habits graduate to "Daily Missions" after ≥21 days with ≥80% frequency.
- **Resources:** CDX VTLS tracks 4 resources: Time, Energy, Budget, Attention.

## 4. Narrative Engine State
- **Persistent State:** JSON tracking `active_villain`, `unlocked_allies`, `current_arc`, `past_decisions`.
- **Logic:** Narrative challenges must map to the player's weakest House.

## 5. Minigame Mapping
- **Memory Puzzles:** Intelligence (Spaced Repetition).
- **Procrastination Combat:** Strength/Discipline (Streak-based).
- **Alchemy Lab:** Intelligence/Brilliance (Quiz + Crafting).
- **Races:** Strength/Agility (GPS/Step sync).
