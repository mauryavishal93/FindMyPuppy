# Info Modal (Explorer's Guide) — Summary & Android Implementation Prompt

## 1. Summary of changes made to the web InfoModal

The web **InfoModal** (`components/modals/InfoModal.tsx`) was shortened to be **crisp and minimal**:

- **Removed:** Long hero, step-by-step “How to play,” detailed hint system, Controls & Tips, Progression & Features, Android promo, Daily Check-in and Puppy Jump blocks, Themes grid, Puppy Designs button, Pro Tips, and lengthy Privacy/Legal copy.
- **Kept:** One short “what the game is” block, three quick-action buttons (Full Guide, Leaderboard, Video), one-line Guest vs Login, a compact Difficulty table, three one-line bullets (Hints, Daily, Puppy Jump), and a minimal footer (Privacy, Delete account, copyright).
- **Behavior:** “Full Guide” opens the full Explorer’s Guide (on web: `/explorer-guide` in a new tab). “Leaderboard” runs a callback and closes the modal. “Video” opens the YouTube trailer in a new tab. No Puppy Designs in this modal.

---

## 2. Exact content and structure of the shortened InfoModal

Use this as the single source of truth for copy and structure.

### Header
- **Title:** Explorer's Guide  
- **Subtitle:** Quick game overview  
- **Visual:** Book/open-book icon in a circular badge (brand gradient).  
- **Action:** Close button (dismisses modal).

### Body (scrollable, in order)

**Block 1 — What the game is (one paragraph)**  
- Text: *“Find hidden puppies in each scene. **Pan** to explore, **zoom** to look closer, **tap** when you spot one. You have **3 lives**; wrong taps cost a life. Use **2 free hints** per level (💡 button).”*  
- Style: Slightly highlighted (e.g. light tinted background, subtle border). Short, scannable.

**Block 2 — Quick actions (horizontal row of buttons/chips)**  
- **Full Guide** — Opens the full Explorer’s Guide. On Android: navigate to in-app “Explorer’s Guide” screen (or WebView of the web guide).  
- **Leaderboard** — Opens leaderboard (then close modal). Only show if the app has leaderboard.  
- **Video** — Opens in external browser/YouTube app: `https://www.youtube.com/watch?v=_aBm0CZDCPo`  
- Labels: “Full Guide”, “Leaderboard”, “Video”. Icons optional: compass, trophy, YouTube.

**Block 3 — Guest vs Login (one line)**  
- Text: *“**Guest:** Play instantly. **Login:** Save progress, leaderboard, daily rewards, buy hints.”*  
- Style: Neutral background, small text.

**Block 4 — Difficulty (compact table)**  
- Section label: “Difficulty” (small header bar).  
- Rows (left = mode name, right = short stats):  
  - **Easy** — No timer · 15–25 pups · +5 pts  
  - **Medium** — 2m 30s · 25–35 pups · +10 pts  
  - **Hard** — 3 min · 40–50 pups · +15 pts  
- Visual: Slight row background tint (e.g. green for Easy, blue for Medium, red/rose for Hard).

**Block 5 — Hints & extras (three one-line bullets)**  
- **Hints:** 2 free per level; buy more with points or hint packs (login).  
- **Daily:** Check in for points; 7-day streak = bonus hints.  
- **Puppy Jump:** Daily mini-game for extra hints.  
- Style: Small text, bold labels.

**Block 6 — Footer**  
- **Privacy** — Link to app’s privacy policy (screen or URL).  
- **Delete account** — Link to delete-account flow.  
- **Copyright:** © 2025–2026 MVTechnology  
- Style: Divider above, centered, small text.

---

## 3. What NOT to include in the Info Modal on Android

- Do **not** add a “Puppy Designs” button in this modal.  
- Do **not** add long “How to play” steps, Controls list, or Progression/Features paragraphs here.  
- Do **not** add Android/Play Store promo inside this modal (that can live elsewhere, e.g. Explorer’s Guide or settings).  
- Keep the modal **short**: one screen or a short scroll. No lengthy legal text in the modal body.

---

## 4. AI prompt for implementing the Info Modal on Android

Copy and use the following prompt (and optionally attach this file) when asking an AI or a developer to implement the Android version.

---

**PROMPT START**

Implement an **Info / Explorer’s Guide modal** (dialog or bottom sheet) for the Find My Puppy Android app that matches the following spec. The goal is a **short, crisp overview** of the game — not the full guide.

**Requirements**

1. **Entry point**  
   - The modal is opened from a “Guide” / “Info” / “Explorer’s Guide” action (e.g. from home or menu).  
   - It can be dismissed by a close button and optionally by tapping outside.

2. **Header**  
   - Title: **Explorer's Guide**  
   - Subtitle: **Quick game overview**  
   - A book/open-book style icon in a circular badge (use app’s brand color).  
   - Close button to dismiss.

3. **Body content (in this order, scrollable if needed)**  

   - **Intro paragraph (one block)**  
     - Copy: “Find hidden puppies in each scene. **Pan** to explore, **zoom** to look closer, **tap** when you spot one. You have **3 lives**; wrong taps cost a life. Use **2 free hints** per level (💡 button).”  
     - Use a slightly highlighted background so it stands out.

   - **Quick actions (row of tappable items)**  
     - **Full Guide** — Navigate to the in-app full Explorer’s Guide screen (or open WebView with the web Explorer’s Guide URL). Do not open an external browser for this.  
     - **Leaderboard** — Open the app’s leaderboard screen, then close this modal. Only show if the app has a leaderboard.  
     - **Video** — Open this URL in the default browser or YouTube app: `https://www.youtube.com/watch?v=_aBm0CZDCPo`  
     - Use clear labels and optional icons (compass, trophy, YouTube/play).

   - **Guest vs Login (one line)**  
     - Copy: “**Guest:** Play instantly. **Login:** Save progress, leaderboard, daily rewards, buy hints.”  
     - Small, neutral text.

   - **Difficulty table**  
     - Section title: “Difficulty”.  
     - Three rows:  
       - **Easy** — No timer · 15–25 pups · +5 pts (e.g. green tint)  
       - **Medium** — 2m 30s · 25–35 pups · +10 pts (e.g. blue tint)  
       - **Hard** — 3 min · 40–50 pups · +15 pts (e.g. red/rose tint)  
     - Left: mode name. Right: short stats. Keep it compact.

   - **Hints & extras (three lines)**  
     - “**Hints:** 2 free per level; buy more with points or hint packs (login).”  
     - “**Daily:** Check in for points; 7-day streak = bonus hints.”  
     - “**Puppy Jump:** Daily mini-game for extra hints.”  
     - Bold labels, small body text.

   - **Footer**  
     - Link: **Privacy** → app privacy policy (in-app screen or URL).  
     - Link: **Delete account** → app’s delete-account flow.  
     - Line: “© 2025–2026 MVTechnology”.  
     - Separator above footer, centered, small text.

4. **Do not include**  
   - Puppy Designs button.  
   - Long how-to-play steps, controls list, or feature paragraphs.  
   - Android/Play Store download promo inside this modal.  
   - Long legal or policy text in the modal body.

5. **Technical notes**  
   - Use Material Design 3 (or current app design system) for dialog/sheet, typography, and buttons.  
   - Support dark theme if the app does.  
   - Ensure the modal is scrollable on small screens so all content is reachable.  
   - Use the exact strings above for accessibility and consistency with the web app.

**PROMPT END**

---

## 5. Reference: Web implementation

- **Component:** `components/modals/InfoModal.tsx`  
- **Props:** `onClose`, `onOpenLeaderboard?` (optional; if absent, Leaderboard button is hidden).  
- **Full guide (web):** `/explorer-guide` — on Android this should be an in-app screen or WebView with the same content, not an external browser.

Use this document and the prompt to implement the shortened Info Modal on the Android app so it matches the web behavior and content.
