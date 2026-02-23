# Daily Puppy Feed — Full Implementation Prompt (Android)

Use this prompt to implement the "Feed Your Puppy" daily check-in feature in the Android app,
matching the logic and UI exactly as it exists in the web game.

---

## PROMPT START

Implement a **Daily Puppy Feed** screen for the Find My Puppy Android app.
The feature is a daily check-in mechanic where the user feeds a virtual puppy once per day,
building a streak. The puppy grows visually over the first 7 days, then earns badges for
longer streaks. Use the full spec below.

---

## 1. Backend Logic (already implemented — match this exactly)

### Streak calculation
- User can check in **once per day** (tracked by `lastCheckInDate` as `YYYY-MM-DD`).
- If `daysDiff === 1` (consecutive day): `newStreak = previousStreak + 1`
- If `daysDiff === 2` (missed exactly 1 day): allow a **streak freeze** once per calendar week.
  - If freeze not used this week: `newStreak = previousStreak + 1`, mark freeze used.
  - If freeze already used: `newStreak = 1` (reset).
- If `daysDiff > 2`: `newStreak = 1` (reset).
- First ever check-in: `newStreak = 1`.

### Puppy age & size
```
puppyAge = min(newStreak, 7)          // caps at 7 — cycles visually
puppySize = 1.0 + (puppyAge × 0.14)  // grows from 1.0 → ~2.0 over 7 days
```

### Milestone rewards (hints only, awarded once on the exact milestone day)
| Streak day | Reward |
|------------|--------|
| Day 7      | +10 Hints |
| Day 30     | +50 Hints |
| Day 365    | +1000 Hints |

### API response fields
```json
{
  "success": true,
  "message": "Puppy fed! 🎉 +10 hints earned!",
  "checkInStreak": 7,
  "puppyAge": 7,
  "puppySize": 1.98,
  "hintsEarned": 10,
  "pointsEarned": 0,
  "totalHints": 45,
  "totalPoints": 120,
  "milestone": "7days",          // "7days" | "30days" | "1year" | null
  "usedStreakFreeze": false,
  "newlyUnlockedAchievements": ["streak_7"]
}
```

### Daily base reward (every check-in, not just milestones)
- +5 points per day (awarded on every successful check-in regardless of streak).

---

## 2. Puppy Growth — Day 1 to Day 7

For the first 7 days the puppy emoji changes and grows in size. No badge shown.

| Day | Emoji | Stage Label  | Scale (relative) |
|-----|-------|--------------|-----------------|
| 1   | 🐶    | Newborn Pup  | 0.65× |
| 2   | 🐶    | Baby Pup     | 0.80× |
| 3   | 🐕    | Little Pup   | 0.90× |
| 4   | 🐕    | Medium Dog   | 1.00× |
| 5   | 🐕‍🦺  | Trained Dog  | 1.15× |
| 6   | 🦮    | Big Dog      | 1.30× |
| 7   | 🦮    | Fully Grown  | 1.50× |

- Glow ring color: amber/gold, intensity increases each day.
  - Formula: `alpha = 0.1 + (puppyAge × 0.04)`
  - Glow radius: `8 + (puppyAge × 3)` dp

---

## 3. Badge System — Day 8 to Day 365

After Day 7, the dog emoji is permanently **🦮** at full scale (1.5×).
A **badge emoji floats above** the dog and changes per milestone.
The glow ring color also changes per badge.

| Streak range | Badge    | Stage Label    | Glow color (ARGB approx)     |
|-------------|----------|----------------|------------------------------|
| Day 8–13    | 🌟        | Star Dog       | amber `rgba(251,191,36,0.6)` |
| Day 14–20   | 🏅        | Medalist       | orange `rgba(251,146,60,0.6)`|
| Day 21–29   | 🥈        | Silver Pup     | slate `rgba(148,163,184,0.6)`|
| Day 30      | 🥇        | Gold Champion  | gold `rgba(234,179,8,0.7)`   |
| Day 31–59   | 🏆        | Trophy Dog     | gold `rgba(234,179,8,0.6)`   |
| Day 60–89   | 💎        | Diamond Dog    | blue `rgba(96,165,250,0.6)`  |
| Day 90–179  | 👑        | Royal Dog      | yellow `rgba(250,204,21,0.7)`|
| Day 180–364 | 🌈        | Legend Dog     | purple `rgba(168,85,247,0.6)`|
| Day 365+    | 🌟👑🌟    | Puppy Master   | gold `rgba(255,215,0,0.8)`   |

- Badge emoji bounces with a gold drop-shadow glow.
- Glow ring radius: fixed at 32 dp for all badge stages.

---

## 4. UI Layout (top to bottom)

### Header
- Title: **"🍖 Feed Your Puppy"** (bold, large)
- Close / X button (top right)

### Section A — Days 1–7 only: Progress strip
Show a horizontal row of 7 slots (Day 1 → Day 7):
- Each slot: emoji (size increases left → right: 16px → 28px), amber bar below, day number.
- Completed days: full opacity, amber bar filled.
- Future days: 25% opacity, gray bar.
- Current day: bouncing animation + gold glow filter.
- **Hide this strip once streak > 7.**

### Section B — Day 8+ only: Streak banner
Replace the progress strip with a banner:
```
🔥  {streak}-Day Streak!  🔥
```
- Background: amber-50, border: amber-200, text: amber-700 bold.

### Section C — Puppy display (always shown)
Vertical stack, centered:
1. **Badge emoji** (only Day 8+) — 30sp, bouncing, gold glow drop-shadow.
2. **Glow ring** — 120×120 dp circle with radial gradient + box shadow using `glowColor`.
3. **Dog emoji** inside the ring — size = `48sp × scale`.
4. **Stage label** — bold, medium size (e.g. "Fully Grown", "Gold Champion").
5. **Streak info** — small text:
   - Days 1–7: `"Day {puppyAge} / 7 · Streak: {streak} days 🔥"`
   - Day 8+: `"Streak: {streak} days 🔥"`

### Section D — Info panel (scrollable reference)
A card with three sub-sections:

**Growth (Day 1–7)**
```
🐶 Day 1–2   →  Newborn · Baby Pup
🐕 Day 3–4   →  Little Pup · Medium Dog
🐕‍🦺 Day 5   →  Trained Dog
🦮 Day 6–7   →  Big Dog · Fully Grown
```

**Badges (Day 8+)**
```
🌟  Day 8–13    →  Star Dog
🏅  Day 14–20   →  Medalist
🥈  Day 21–29   →  Silver Pup
🥇  Day 30      →  Gold Champion · +50 Hints
🏆  Day 31–59   →  Trophy Dog
💎  Day 60–89   →  Diamond Dog
👑  Day 90–179  →  Royal Dog
🌈  Day 180–364 →  Legend Dog
🌟👑🌟 Day 365  →  Puppy Master · +1000 Hints
```

**Streak Rewards**
```
🎁 7-day streak   →  +10 Hints
🎁 30-day streak  →  +50 Hints
🎁 365-day streak →  +1000 Hints
```

### Section E — Feed button
- Full-width, rounded, amber gradient: `#f59e0b → #d97706`
- Label: **"🍖 Feed Puppy"**
- Loading state: **"⏳ Feeding..."** + disabled
- Tap → calls API → shows reward overlay

---

## 5. Reward Overlay (shown after successful feed)

Full-screen dark overlay (80% black) with a centered card:

**Normal day (no milestone):**
```
[dog emoji — 60sp, bouncing]
"Puppy fed! 🐕 Keep the streak going!"
```

**Hints earned (milestone day):**
```
[badge emoji — 40sp, bouncing]  ← only if badge stage active
[🎁 — 60sp, bouncing]
"Puppy fed! 🎉 +10 hints earned!"
+10 Hints
```

**Streak freeze used:**
```
[🧊 — 60sp, bouncing]
"Puppy fed! 🧊 Streak saved with freeze!"
```

Auto-dismiss after 2.5 seconds, then close the screen.

---

## 6. State / Data model

```kotlin
data class DailyCheckInState(
    val streak: Int,           // current streak count
    val puppyAge: Int,         // min(streak, 7)
    val puppySize: Float,      // 1.0 + puppyAge * 0.14
    val lastCheckInDate: String, // "YYYY-MM-DD"
    val totalHints: Int,
    val totalPoints: Int
)
```

---

## 7. Important rules

- User can only feed **once per day**. If already fed today, show a "Come back tomorrow!" state instead of the feed button.
- Login required. Guest users cannot access this feature.
- The streak freeze is automatic — no user action needed. Just apply it server-side when `daysDiff === 2` and freeze not yet used this week.
- Milestone hints are awarded **only once** on the exact milestone day (Day 7, 30, 365). Not every day.
- Every day awards **+5 points** regardless of milestone.
- `puppyAge` always caps at 7 for visual purposes, but `streak` keeps counting indefinitely for badges.

---

## PROMPT END

Reference file: `components/PuppyFeeding.tsx` (web implementation)
Backend reference: `server/server.js` → `/api/daily-checkin/complete` endpoint
