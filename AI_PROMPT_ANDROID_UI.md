# AI Prompt: Replicate FindMyPuppy UI for Android

## Copy and paste this entire prompt to your AI assistant:

---

# TASK: Create Android Native UI Matching FindMyPuppy Web App

You are an expert Android developer. I need you to create an Android native application using **Jetpack Compose** that exactly replicates the UI/UX of the FindMyPuppy web application. The UI must match pixel-perfect in terms of colors, component positions, layouts, and styling.

## CRITICAL REQUIREMENTS

1. **Use Jetpack Compose** for all UI
2. **Match exact colors** from the web app (hex codes provided)
3. **Replicate component positions** exactly as shown
4. **Use same spacing, padding, and margins**
5. **Match all animations and transitions**
6. **Follow the exact layout structure**

---

## COLOR SYSTEM

### Primary Brand Colors
```kotlin
object BrandColors {
    val BrandLight = Color(0xFFFFD1DC)  // #FFD1DC - Light pink
    val Brand = Color(0xFFFF69B4)       // #FF69B4 - Hot pink
    val BrandDark = Color(0xFFC71585)   // #C71585 - Deep pink
}
```

### Difficulty Colors
```kotlin
val EasyColor = Color(0xFF10B981)      // Emerald-500
val MediumColor = Color(0xFF3B82F6)    // Blue-500
val HardColor = Color(0xFFE11D48)      // Rose-600
```

### Status Colors
```kotlin
val SuccessColor = Color(0xFF10B981)    // Green
val WarningColor = Color(0xFFF59E0B)   // Amber-500
val ErrorColor = Color(0xFFEF4444)     // Red-500
val InfoColor = Color(0xFF3B82F6)      // Blue-500
```

### Background Colors
```kotlin
val DarkBackground = Color(0xFF0F172A)  // Slate-900
val LightBackground = Color(0xFFF8FAFC) // Slate-50
val White = Color(0xFFFFFFFF)
val Slate800 = Color(0xFF1E293B)
val Slate700 = Color(0xFF334155)
val Slate600 = Color(0xFF475569)
```

### Text Colors
```kotlin
val TextPrimary = Color(0xFF1E293B)    // Slate-800
val TextSecondary = Color(0xFF475569)  // Slate-600
val TextTertiary = Color(0xFF64748B)  // Slate-500
val TextWhite = Color(0xFFFFFFFF)
```

---

## SCREEN 1: LOGIN VIEW

### Layout Structure
- **Container:** Full screen with theme-based gradient background
- **Content:** Centered card with rounded corners

### Card Specifications
- **Width:** 90% of screen width, max 400dp
- **Height:** Wrap content
- **Background:** White with 60% opacity (`Color.White.copy(alpha = 0.6f)`)
- **Corner Radius:** 32dp (rounded-[2rem])
- **Padding:** 32dp (p-8)
- **Elevation:** 8dp shadow

### Header Section
- **Text:** "FindMyPuppy" or game logo
- **Font Size:** 28sp (text-2xl)
- **Font Weight:** Bold (FontWeight.Black)
- **Color:** Brand color (#FF69B4)
- **Alignment:** Center
- **Margin Bottom:** 24dp

### Input Fields
**Username/Email Field:**
- **Height:** 56dp
- **Background:** White with border
- **Border:** 1dp, Slate-200 (#E2E8F0)
- **Corner Radius:** 12dp
- **Padding:** 16dp horizontal, 16dp vertical
- **Icon:** Left side, 20dp from start, 20sp size
- **Text Size:** 16sp
- **Margin Bottom:** 16dp

**Password Field:**
- Same as username field
- **Icon:** Eye icon on right (toggle show/hide)
- **Margin Bottom:** 16dp

### Toggle Button (Login/Signup)
- **Position:** Below password field
- **Text Size:** 14sp
- **Color:** Brand color
- **Style:** Underlined text button
- **Margin Bottom:** 24dp

### Referral Code Field (Signup Mode)
- **Label:** "Referral Code (Optional)"
- **Same styling as other input fields**
- **Margin Bottom:** 16dp

### Primary Action Button
- **Text:** "Login" or "Sign Up"
- **Width:** 100% of card width
- **Height:** 56dp
- **Background:** Gradient from Brand to BrandDark
- **Corner Radius:** 28dp (rounded-full)
- **Text Color:** White
- **Font Size:** 18sp
- **Font Weight:** Bold
- **Elevation:** 4dp
- **Margin Bottom:** 16dp

### Google OAuth Button
- **Container:** Full width
- **Height:** 56dp
- **Background:** White
- **Border:** 1dp, Slate-300
- **Corner Radius:** 28dp
- **Icon:** Google logo, 24dp size
- **Text:** "Sign in with Google" or "Sign up with Google"
- **Text Color:** Slate-800
- **Font Size:** 16sp
- **Spacing:** 12dp between icon and text

### Error Message
- **Position:** Below buttons
- **Text Color:** ErrorColor (Red-500)
- **Font Size:** 14sp
- **Padding:** 12dp
- **Background:** Red-50 with 80% opacity
- **Corner Radius:** 8dp
- **Visibility:** Only when error exists

---

## SCREEN 2: HOME VIEW (Difficulty Selection)

### Layout Structure
- **Container:** Full screen with theme gradient background
- **Content:** Scrollable column

### Header Section
- **Height:** 60dp + status bar height
- **Background:** White with 70% opacity, backdrop blur
- **Padding:** 16dp horizontal
- **Elevation:** 4dp shadow

**User Dropdown (Top Right):**
- **Size:** 40dp x 40dp
- **Background:** White with 80% opacity
- **Corner Radius:** 20dp (circle)
- **Icon:** User icon, 20sp
- **Color:** Slate-600
- **Position:** End aligned

**Theme Button:**
- **Size:** 40dp x 40dp
- **Position:** Next to user dropdown
- **Icon:** Palette icon
- **Same styling as user dropdown**

**Info Button:**
- **Size:** 40dp x 40dp
- **Position:** Next to theme button
- **Icon:** Info/book icon
- **Same styling**

### Main Content Area
- **Padding:** 24dp horizontal, 32dp vertical
- **Alignment:** Center

**Game Logo/Title:**
- **Font Size:** 36sp
- **Font Weight:** Black
- **Color:** Brand color
- **Alignment:** Center
- **Margin Bottom:** 32dp

**Difficulty Cards Container:**
- **Layout:** Column
- **Spacing:** 16dp between cards
- **Width:** 100%

### Difficulty Card Component

**Card Container:**
- **Width:** 100%
- **Height:** Wrap content (min 120dp)
- **Background:** White with 60% opacity
- **Corner Radius:** 24dp (rounded-2xl)
- **Padding:** 24dp
- **Elevation:** 8dp shadow
- **Border:** 2dp, theme-based color

**Card Header:**
- **Layout:** Row
- **Spacing:** 12dp

**Icon Circle:**
- **Size:** 48dp x 48dp
- **Background:** Difficulty color (Easy/Medium/Hard)
- **Corner Radius:** 24dp (circle)
- **Icon:** 
  - Easy: Seedling icon
  - Medium: Fire icon
  - Hard: Skull icon
- **Icon Size:** 24sp
- **Icon Color:** White

**Title Section:**
- **Title:** "Easy Mode" / "Medium Mode" / "Hard Mode"
- **Font Size:** 20sp
- **Font Weight:** Black
- **Color:** Difficulty color
- **Subtitle:** "Perfect for beginners!" / "For the adventurous!" / "Master level challenge!"
- **Font Size:** 12sp
- **Color:** Difficulty color with 80% opacity

**Card Content:**
- **Layout:** Grid (2 columns)
- **Spacing:** 12dp horizontal, 8dp vertical
- **Margin Top:** 16dp

**Stat Item:**
- **Layout:** Row
- **Spacing:** 8dp
- **Icon:** 16sp size, Slate-400
- **Text:** 12sp, Slate-700
- **Bold values:** FontWeight.Bold

**Stats to Display:**
1. Timer: "No Timer" / "150 Seconds" / "180 Seconds"
2. Puppies: "15-25 Puppies" / "25-35 Puppies" / "40-50 Puppies"
3. Points: "+5 Points" / "+10 Points" / "+15 Points"
4. Visibility: "More Visible" / "Better Hidden" / "Nearly Invisible"

**Action Button:**
- **Text:** "Play" or "Locked"
- **Width:** 100%
- **Height:** 48dp
- **Background:** Difficulty color gradient
- **Corner Radius:** 24dp
- **Text Color:** White
- **Font Size:** 16sp
- **Font Weight:** Bold
- **Margin Top:** 16dp
- **Disabled State:** Gray background, 50% opacity

---

## SCREEN 3: LEVEL SELECTOR VIEW

### Layout Structure
- **Container:** Full screen
- **Background:** Theme gradient

### Header
- **Height:** 60dp + status bar
- **Background:** Slate-900 with 90% opacity
- **Padding:** 16dp horizontal
- **Elevation:** 4dp

**Back Button:**
- **Size:** 40dp x 40dp
- **Icon:** X/close icon, 20sp
- **Color:** Slate-400
- **Position:** Start aligned

**Title:**
- **Text:** "Select Level"
- **Font Size:** 20sp
- **Font Weight:** Bold
- **Color:** White
- **Alignment:** Center

**Mute Button:**
- **Size:** 40dp x 40dp
- **Position:** End aligned
- **Icon:** Volume icon
- **Color:** Slate-400

### Level Grid
- **Layout:** LazyVerticalGrid
- **Columns:** 5
- **Spacing:** 8dp
- **Padding:** 16dp
- **Content Padding:** 16dp

### Level Button Component

**Button Container:**
- **Size:** Square (calculate: (screenWidth - padding - spacing) / 5)
- **Min Size:** 60dp
- **Corner Radius:** 12dp
- **Elevation:** 2dp

**Button States:**

**Available Level:**
- **Background:** Theme button color
- **Border:** 2dp, Brand color
- **Text Color:** White
- **Font Size:** 16sp
- **Font Weight:** Bold

**Cleared Level:**
- **Background:** SuccessColor (Green-500)
- **Icon:** Checkmark, 24sp, White
- **Text:** Level number, 14sp, White

**Locked Level:**
- **Background:** Slate-700
- **Icon:** Lock icon, 20sp, Slate-400
- **Text:** Level number, 14sp, Slate-400
- **Enabled:** false

**Current Level:**
- **Border:** 4dp, Brand color
- **Elevation:** 8dp
- **Pulse animation:** Optional

---

## SCREEN 4: GAME VIEW

### Layout Structure
- **Container:** Full screen, dark background (Slate-900)

### Header Bar
- **Height:** 60dp + status bar
- **Background:** Slate-900 with 90% opacity, backdrop blur
- **Padding:** 16dp horizontal
- **Elevation:** 4dp shadow

**Back Button:**
- **Size:** 40dp x 40dp
- **Icon:** X icon, 20sp
- **Color:** Slate-400
- **Position:** Start aligned

**Timer (if applicable):**
- **Container:** 
  - **Background:** Slate-800 (normal) / Orange-500 (≤30s) / Red-500 (≤10s)
  - **Corner Radius:** 20dp (rounded-full)
  - **Padding:** 8dp horizontal, 6dp vertical
  - **Border:** 1dp, White with 20% opacity
- **Text:** MM:SS format
  - **Font:** Monospace
  - **Font Size:** 16sp
  - **Font Weight:** Bold
  - **Color:** White
- **Icon:** Clock icon, 12sp, left of text
- **Spacing:** 8dp between icon and text
- **Pulse Animation:** When ≤10s (Red state)

**Difficulty Info:**
- **Layout:** Column, end aligned
- **Text 1:** "EASY MODE" / "MEDIUM MODE" / "HARD MODE"
  - **Font Size:** 10sp
  - **Font Weight:** Bold
  - **Color:** BrandLight
  - **Letter Spacing:** 2sp
- **Text 2:** "Level X"
  - **Font Size:** 12sp
  - **Color:** Slate-400
  - **Opacity:** 80%

**Mute Button:**
- **Size:** 40dp x 40dp
- **Background:** White with 5% opacity
- **Corner Radius:** 20dp
- **Icon:** Volume icon, 16sp
- **Color:** Slate-400
- **Position:** End aligned

### Game Canvas Area
- **Container:** Full remaining height
- **Background:** Slate-900
- **Overflow:** Scrollable (both directions)
- **Zoom:** Pinch-to-zoom support
- **Pan:** Drag to move

**Image Container:**
- **Base Size:** 1600dp x 1600dp (scalable)
- **Background Image:** Loaded from URL
- **Scale:** 1.0 to 4.0 (zoom range)
- **Min Scale:** Calculated to fit screen

**Puppy Elements:**
- **Position:** Absolute (x%, y%)
- **Size:** Variable (30dp to 120dp base)
- **Rotation:** Variable degrees
- **Opacity:** Based on difficulty
- **Blend Mode:** Luminosity (for camouflage)
- **Clickable:** True
- **Found State:** 
  - Scale: 2.5x
  - Bounce animation
  - Brightness: 1.2
  - Drop shadow

### HUD Elements (Overlay)

**Attempts Counter (Top Left):**
- **Position:** 8dp from top, 8dp from start (16dp on tablets)
- **Container:**
  - **Background:** Red-900 with 80% opacity, backdrop blur
  - **Corner Radius:** 20dp (rounded-full)
  - **Padding:** 12dp horizontal, 8dp vertical (16dp/12dp on tablets)
  - **Border:** 1dp, Red-700
  - **Elevation:** 8dp shadow
- **Content:**
  - **Layout:** Row
  - **Spacing:** 8dp
  - **Icons:** 3 dog icons (🐕 or FontAwesome)
    - **Size:** 10sp (12sp on tablets)
    - **Color:** 
      - Available: White
      - Warning (1 left): Yellow-300
      - Critical (0 left): Red-300 with pulse
    - **Lost:** Red-300 with 30% opacity, 75% scale
  - **Text:** "Left X"
    - **Font Size:** 10sp (12sp on tablets)
    - **Font Weight:** Bold
    - **Color:** White (or Yellow/Red based on state)

**Puppies Found Counter (Top Right):**
- **Position:** 8dp from top, 8dp from end (16dp on tablets)
- **Container:**
  - **Background:** Slate-900 with 80% opacity, backdrop blur
  - **Corner Radius:** 20dp (rounded-full)
  - **Padding:** 12dp horizontal, 8dp vertical (16dp/12dp on tablets)
  - **Border:** 1dp, Slate-700
  - **Elevation:** 8dp shadow
- **Content:**
  - **Layout:** Row
  - **Spacing:** 8dp
  - **Icon:** Paw icon, 10sp (12sp on tablets), BrandLight
  - **Text:** "X / Y"
    - **Font:** Monospace
    - **Font Size:** 12sp (14sp on tablets)
    - **Font Weight:** Bold
    - **Color:** BrandLight

**Hint Button (Bottom Right):**
- **Position:** 80dp from bottom, 24dp from end (96dp/24dp on tablets)
- **Size:** 48dp x 48dp (56dp on tablets)
- **Background:** 
  - Inactive: Slate-800 with 90% opacity
  - Active: Yellow-400
- **Border:** 2dp
  - Inactive: Slate-600
  - Active: Yellow-200
- **Corner Radius:** 24dp (circle)
- **Elevation:** 16dp shadow (24dp when active)
- **Icon:** Lightbulb, 20sp (24sp on tablets)
  - **Color:** 
    - Inactive: Yellow-400
    - Active: White with pulse animation
- **Scale:** 110% when active
- **Badge:** Red circle, top-right corner
  - **Size:** 20dp x 20dp
  - **Background:** Red-500
  - **Border:** 1dp, White
  - **Text:** Hint count or "+"
  - **Font Size:** 10sp
  - **Font Weight:** Bold
  - **Color:** White
  - **Position:** -4dp from top, -4dp from end

### Loading Screen Overlay
- **Container:** Full screen overlay
- **Background:** Gradient (Yellow-100 → Pink-100 → Blue-100)
- **Z-Index:** 50 (above game)

**Loading Card:**
- **Width:** 320dp (90% max width)
- **Height:** Wrap content
- **Background:** White with 80% opacity, backdrop blur
- **Corner Radius:** 40dp (rounded-[2.5rem])
- **Padding:** 32dp
- **Border:** 6dp, White
- **Elevation:** 16dp shadow
- **Alignment:** Center

**Loading Icon:**
- **Size:** 96dp x 96dp
- **Background:** Gradient (BrandLight → Brand)
- **Corner Radius:** 48dp (circle)
- **Border:** 4dp, White
- **Icon:** Magic wand (generating) / Dog (loading)
- **Icon Size:** 36sp
- **Icon Color:** White
- **Animation:** Bounce

**Progress Bar:**
- **Width:** 100%
- **Height:** 24dp
- **Background:** Slate-100
- **Border:** 2dp, Slate-200
- **Corner Radius:** 12dp
- **Fill:** Gradient (Yellow-400 → Orange-500)
- **Corner Radius:** 12dp
- **Animation:** Width 5% → 100%
- **Duration:** Smooth transition

**Progress Text:**
- **Font Size:** 10sp
- **Font Weight:** Black
- **Color:** Slate-400
- **Text:** "AI Magic" or "Loading Assets"
- **Percentage:** Brand color, end aligned

### Quit Confirmation Modal
- **Container:** Full screen overlay
- **Background:** Black with 60% opacity, backdrop blur
- **Z-Index:** 200

**Modal Card:**
- **Width:** 90% max, 400dp max
- **Height:** Wrap content
- **Background:** White
- **Corner Radius:** 32dp
- **Padding:** 32dp
- **Border:** 4dp, White (or theme-based)
- **Elevation:** 16dp shadow
- **Alignment:** Center

**Icon:**
- **Size:** 64dp x 64dp
- **Background:** Red-100
- **Corner Radius:** 32dp (circle)
- **Icon:** Sign-out icon, 24sp, Red-500
- **Margin Bottom:** 16dp

**Content:**
- **Title:** "Quit Game?"
  - **Font Size:** 24sp
  - **Font Weight:** Black
  - **Color:** Slate-800
- **Message:** "Are you sure..."
  - **Font Size:** 14sp
  - **Color:** Slate-500
  - **Margin Top:** 8dp

**Buttons:**
- **Layout:** Column
- **Spacing:** 12dp
- **Quit Button:**
  - **Width:** 100%
  - **Height:** 48dp
  - **Background:** Gradient (Red-500 → Rose-600)
  - **Text:** "Quit Game"
  - **Text Color:** White
  - **Font Size:** 16sp
  - **Font Weight:** Bold
- **Cancel Button:**
  - **Text:** "Cancel"
  - **Text Color:** Slate-500
  - **Font Size:** 14sp
  - **Font Weight:** Bold
  - **Padding:** 12dp vertical

---

## SCREEN 5: WIN VIEW (Level Complete)

### Layout Structure
- **Container:** Full screen overlay
- **Background:** Black with 60% opacity, backdrop blur
- **Z-Index:** 50

### Modal Card
- **Width:** 90% max, 400dp max
- **Height:** Wrap content
- **Background:** White
- **Corner Radius:** 32dp
- **Padding:** 32dp
- **Border:** 4dp, White
- **Elevation:** 16dp shadow
- **Alignment:** Center

### Trophy Icon
- **Position:** Absolute, above card
- **Size:** 128dp x 128dp
- **Background:** Yellow-100
- **Corner Radius:** 64dp (circle)
- **Border:** 4dp, White
- **Elevation:** 8dp shadow
- **Icon:** Trophy, 48sp, Yellow-500
- **Animation:** Bounce (0.5s infinite)
- **Offset:** -64dp from top

### Content
- **Margin Top:** 48dp (to clear icon)

**Title:**
- **Text:** "Level Clear!"
- **Font Size:** 30sp
- **Font Weight:** Black
- **Color:** Slate-800
- **Margin Bottom:** 8dp

**Message:**
- **Text:** "Fantastic job finding all the pups!"
- **Font Size:** 14sp
- **Color:** Slate-500
- **Margin Bottom:** 24dp

**Stats Row:**
- **Layout:** Row
- **Spacing:** 16dp
- **Alignment:** Center

**Score Card:**
- **Width:** 96dp
- **Height:** Wrap content
- **Background:** Yellow-50
- **Padding:** 12dp
- **Corner Radius:** 12dp
- **Border:** 1dp, Yellow-100
- **Alignment:** Center

**Score Label:**
- **Text:** "Score"
- **Font Size:** 10sp
- **Font Weight:** Bold
- **Color:** Yellow-600
- **Text Transform:** Uppercase

**Score Value:**
- **Text:** Score number
- **Font Size:** 24sp
- **Font Weight:** Black
- **Color:** Yellow-500

**Level Card:**
- Same as Score Card
- **Background:** Blue-50
- **Border:** Blue-100
- **Label:** "Level"
- **Value:** Level number
- **Colors:** Blue-600, Blue-500

**Action Buttons:**
- **Layout:** Column
- **Spacing:** 12dp
- **Margin Top:** 24dp

**Next Level Button:**
- **Width:** 100%
- **Height:** 48dp
- **Background:** Gradient (Green-500 → Emerald-600)
- **Text:** "Next Level"
- **Text Color:** White
- **Font Size:** 18sp
- **Font Weight:** Bold
- **Icon:** Arrow-right, 16sp, right of text
- **Spacing:** 8dp

**Back to Map Button:**
- **Text:** "Back to Map"
- **Text Color:** Slate-400
- **Font Size:** 14sp
- **Font Weight:** Bold
- **Padding:** 8dp vertical

### Confetti Animation
- **Container:** Full screen, behind modal
- **Particles:** 20 squares
- **Colors:** Red, Yellow, Blue, Green, Pink
- **Size:** 12sp
- **Animation:** Fall from top, rotate 360deg
- **Duration:** 2-5 seconds (random)
- **Delay:** 0-2 seconds (random)
- **Position:** Random X (0-100%)

---

## SCREEN 6: GAME_OVER VIEW (Time's Up)

### Layout Structure
- **Container:** Full screen overlay
- **Background:** Black with 80% opacity, backdrop blur
- **Z-Index:** 50

### Modal Card
- **Width:** 90% max, 400dp max
- **Height:** Wrap content
- **Background:** White
- **Corner Radius:** 32dp
- **Padding:** 32dp
- **Border:** 4dp, Red-100
- **Elevation:** 16dp shadow

### Error Icon
- **Position:** Absolute, above card
- **Size:** 96dp x 96dp
- **Background:** Red-100
- **Corner Radius:** 48dp (circle)
- **Border:** 4dp, White
- **Elevation:** 8dp shadow
- **Icon:** X/Close, 40sp, Red-500
- **Offset:** -48dp from top

### Content
- **Margin Top:** 40dp

**Title:**
- **Text:** "Time's Up!"
- **Font Size:** 30sp
- **Font Weight:** Black
- **Color:** Slate-800
- **Margin Bottom:** 8dp

**Message:**
- **Text:** "Those puppies were too good at hiding."
- **Font Size:** 14sp
- **Color:** Slate-500
- **Margin Bottom:** 24dp

**Buttons:** Same as WIN view
- **Try Again:** Blue to Indigo gradient
- **Give Up:** Slate-400 text

---

## SCREEN 7: GAME_LOST VIEW (Wrong Attempts)

### Layout Structure
- **Container:** Full screen overlay
- **Background:** Black with 90% opacity, backdrop blur
- **Z-Index:** 50

### Background Pattern
- **Particles:** 30 X icons
- **Color:** Red-500
- **Opacity:** 5%
- **Size:** 10-30sp (random)
- **Position:** Random (0-100%)
- **Rotation:** Random (0-360deg)
- **Animation:** Pulse
- **Duration:** 1-3 seconds (random)
- **Delay:** 0-2 seconds (random)

### Modal Card
- **Width:** 90% max, 400dp max
- **Height:** Wrap content
- **Background:** White
- **Corner Radius:** 32dp
- **Padding:** 32dp
- **Border:** 4dp, Red-200
- **Elevation:** 16dp shadow
- **Overflow:** Hidden

### Crying Icon
- **Size:** 112dp x 112dp
- **Background:** Gradient (Red-400 → Rose-600)
- **Corner Radius:** 56dp (circle)
- **Border:** 4dp, White
- **Elevation:** 16dp shadow
- **Icon:** Sad-tear, 48sp, White
- **Animation:** Bounce (0.5s infinite)
- **Margin Bottom:** 24dp

### Content
**Title:**
- **Text:** "Oops! You Lost!"
- **Font Size:** 36sp
- **Font Weight:** Black
- **Color:** Gradient (Red-600 → Rose-600) - use ShaderBrush
- **Margin Bottom:** 12dp

**Message 1:**
- **Text:** "🐾 Too Many Wrong Guesses! 🐾"
- **Font Size:** 18sp
- **Font Weight:** Bold
- **Color:** Slate-600
- **Margin Bottom:** 8dp

**Message 2:**
- **Text:** "Those sneaky puppies..."
- **Font Size:** 14sp
- **Color:** Slate-500
- **Margin Bottom:** 12dp

**Quote:**
- **Text:** "The best detectives..."
- **Font Size:** 12sp
- **Font Style:** Italic
- **Color:** Slate-400
- **Margin Top:** 12dp

**Buttons:** Same as WIN view

---

## MODAL COMPONENTS

### Info Modal

**Container:**
- **Width:** 90% max, 448dp max
- **Height:** 90% max height
- **Background:** White
- **Corner Radius:** 32dp
- **Border:** 4dp, White
- **Elevation:** 16dp shadow

**Header:**
- **Height:** 80dp
- **Background:** Gradient (BrandLight → Pink-50 → Yellow-50)
- **Padding:** 24dp
- **Border Bottom:** 1dp, Slate-100

**Header Content:**
- **Layout:** Row
- **Spacing:** 12dp

**Icon Circle:**
- **Size:** 48dp x 48dp
- **Background:** Gradient (Brand → BrandDark)
- **Corner Radius:** 24dp
- **Icon:** Book-open, 20sp, White
- **Animation:** Pulse

**Title Section:**
- **Title:** "🐾 Explorer's Guide 🐾"
- **Font Size:** 24sp
- **Font Weight:** Black
- **Subtitle:** "Your Complete Adventure Manual"
- **Font Size:** 12sp
- **Color:** Slate-600

**Close Button:**
- **Size:** 32dp x 32dp
- **Background:** White with 80% opacity
- **Corner Radius:** 16dp
- **Icon:** X, 16sp, Slate-400

**Content Area:**
- **Scrollable:** Yes
- **Padding:** 24dp
- **Spacing:** 24dp between sections

**Sections:**
1. Hero section (gradient background)
2. How to Play (6 steps with numbered circles)
3. YouTube button (Red-600, rounded-full)
4. Difficulty modes (3 cards)
5. Hint system (3 cards)
6. Controls & Tips
7. Progression & Features
8. Pro Tip (Amber gradient)

### Theme Modal

**Container:** Same as Info Modal

**Header:**
- **Title:** "Choose Theme"
- **Font Size:** 24sp
- **Font Weight:** Black

**Theme Grid:**
- **Layout:** LazyVerticalGrid
- **Columns:** 3
- **Spacing:** 12dp
- **Padding:** 16dp

**Theme Card:**
- **Size:** Square (calculate from grid)
- **Background:** Theme preview colors
- **Corner Radius:** 16dp
- **Border:** 2dp
  - Default: Transparent
  - Selected: Brand color, 4dp
- **Padding:** 16dp
- **Elevation:** 4dp (8dp when selected)

**Theme Content:**
- **Icon:** Theme icon, 32sp
- **Name:** Theme name, 14sp, Bold
- **Alignment:** Center

### Payment Modal

**Container:** Same as Info Modal

**Content:**
- **Title:** Dynamic (e.g., "Need a Hint?")
- **Font Size:** 24sp
- **Font Weight:** Black
- **Margin Bottom:** 8dp

**Description:**
- **Font Size:** 14sp
- **Color:** Slate-600
- **Margin Bottom:** 24dp

**Price Display:**
- **Layout:** Column
- **Alignment:** Center
- **Margin Bottom:** 24dp

**Market Price:**
- **Text:** "₹99" (strikethrough)
- **Font Size:** 20sp
- **Color:** Slate-400
- **Text Decoration:** Strikethrough

**Offer Price:**
- **Text:** "₹9"
- **Font Size:** 36sp
- **Font Weight:** Black
- **Color:** Brand color

**Savings:**
- **Text:** "Save ₹90"
- **Font Size:** 14sp
- **Color:** SuccessColor

**Payment Buttons:**
- **Layout:** Column
- **Spacing:** 12dp

**Pay with Money:**
- **Width:** 100%
- **Height:** 56dp
- **Background:** Gradient (Brand → BrandDark)
- **Text:** "Buy Hints - ₹9"
- **Text Color:** White
- **Font Size:** 18sp
- **Font Weight:** Bold

**Pay with Points:**
- **Width:** 100%
- **Height:** 56dp
- **Background:** Gradient (Indigo-500 → Indigo-600)
- **Text:** "Buy with 10 Points"
- **Text Color:** White
- **Font Size:** 18sp
- **Font Weight:** Bold

**Status Messages:**
- **Processing:** "Processing payment..."
- **Success:** "Payment successful!"
- **Failed:** "Payment failed. Please try again."
- **Color:** Based on status

### Purchase History Modal

**Container:** Same as Info Modal

**Header:**
- **Title:** "Purchase History"
- **Filter Chips:** Money, Points, Referral
- **Layout:** Row, scrollable

**History List:**
- **Layout:** Column
- **Spacing:** 8dp

**History Item:**
- **Background:** White with 80% opacity
- **Padding:** 16dp
- **Corner Radius:** 12dp
- **Border:** 1dp, Slate-200
- **Elevation:** 2dp

**Item Content:**
- **Layout:** Row
- **Spacing:** 12dp

**Icon:**
- **Size:** 40dp x 40dp
- **Background:** Based on purchase mode
- **Corner Radius:** 8dp
- **Icon:** Shopping cart / Coins / Gift

**Details:**
- **Layout:** Column
- **Title:** Purchase type + pack
- **Date:** Formatted date
- **Amount:** "₹X" or "X Points"
- **Font Sizes:** 14sp, 12sp, 14sp

### Refer Friend Modal

**Container:** Same as Info Modal

**Content:**
- **Title:** "Refer a Friend"
- **Font Size:** 24sp
- **Font Weight:** Black

**Referral Code:**
- **Container:**
  - **Background:** BrandLight
  - **Padding:** 24dp
  - **Corner Radius:** 16dp
  - **Border:** 2dp, Brand
- **Text:** Referral code (username + 4 chars)
- **Font Size:** 24sp
- **Font Weight:** Black
- **Font Family:** Monospace
- **Color:** BrandDark
- **Alignment:** Center

**Share Button:**
- **Width:** 100%
- **Height:** 56dp
- **Background:** Gradient (Brand → BrandDark)
- **Text:** "Share Referral Code"
- **Text Color:** White
- **Font Size:** 18sp
- **Font Weight:** Bold
- **Icon:** Share icon, 20sp
- **Margin Top:** 16dp

**Instructions:**
- **Text:** Instructions about referral
- **Font Size:** 12sp
- **Color:** Slate-600
- **Margin Top:** 16dp

---

## SPACING SYSTEM

Use these exact spacing values:

```kotlin
object Spacing {
    val xs = 4.dp    // gap-1
    val sm = 8.dp    // gap-2
    val md = 12.dp   // gap-3
    val lg = 16.dp   // gap-4, p-4
    val xl = 24.dp   // gap-6, p-6
    val xxl = 32.dp  // p-8
    val xxxl = 48.dp // p-12
}
```

---

## TYPOGRAPHY SYSTEM

```kotlin
object Typography {
    val xs = TextStyle(fontSize = 10.sp, fontWeight = FontWeight.Normal)      // text-[10px]
    val sm = TextStyle(fontSize = 12.sp, fontWeight = FontWeight.Normal)     // text-xs
    val base = TextStyle(fontSize = 14.sp, fontWeight = FontWeight.Normal)    // text-sm
    val lg = TextStyle(fontSize = 16.sp, fontWeight = FontWeight.Normal)     // text-base
    val xl = TextStyle(fontSize = 18.sp, fontWeight = FontWeight.Bold)       // text-lg
    val xxl = TextStyle(fontSize = 20.sp, fontWeight = FontWeight.Black)      // text-xl
    val xxxl = TextStyle(fontSize = 24.sp, fontWeight = FontWeight.Black)    // text-2xl
    val huge = TextStyle(fontSize = 30.sp, fontWeight = FontWeight.Black)    // text-3xl
    val giant = TextStyle(fontSize = 36.sp, fontWeight = FontWeight.Black)    // text-4xl
}
```

---

## CORNER RADIUS SYSTEM

```kotlin
object CornerRadius {
    val sm = 8.dp   // rounded-lg
    val md = 12.dp  // rounded-xl
    val lg = 16.dp  // rounded-2xl
    val xl = 24.dp  // rounded-[1.5rem]
    val xxl = 32.dp // rounded-[2rem]
    val full = 50 // rounded-full (use percent)
}
```

---

## ELEVATION SYSTEM

```kotlin
object Elevation {
    val sm = 2.dp   // shadow-sm
    val md = 4.dp   // shadow-md
    val lg = 8.dp   // shadow-lg
    val xl = 16.dp  // shadow-xl
    val xxl = 24.dp // shadow-2xl
}
```

---

## ANIMATIONS

### Bounce Animation
```kotlin
val bounceAnimation = rememberInfiniteTransition()
val bounceOffset by bounceAnimation.animateFloat(
    initialValue = 0f,
    targetValue = -10f,
    animationSpec = infiniteRepeatable(
        animation = tween(500, easing = FastOutSlowInEasing),
        repeatMode = RepeatMode.Reverse
    )
)
```

### Pulse Animation
```kotlin
val pulseAnimation = rememberInfiniteTransition()
val pulseScale by pulseAnimation.animateFloat(
    initialValue = 1f,
    targetValue = 1.1f,
    animationSpec = infiniteRepeatable(
        animation = tween(1000, easing = FastOutSlowInEasing),
        repeatMode = RepeatMode.Reverse
    )
)
```

### Fade In Animation
```kotlin
val fadeIn = remember {
    fadeIn(
        animationSpec = tween(300, easing = FastOutSlowInEasing)
    )
}
```

---

## IMPLEMENTATION CHECKLIST

- [ ] All 7 screens implemented
- [ ] All colors match exactly (hex codes)
- [ ] All spacing matches (4dp, 8dp, 12dp, 16dp, 24dp, 32dp)
- [ ] All corner radius matches (8dp, 12dp, 16dp, 24dp, 32dp)
- [ ] All font sizes match (10sp, 12sp, 14sp, 16sp, 18sp, 20sp, 24sp, 30sp, 36sp)
- [ ] All elevations match (2dp, 4dp, 8dp, 16dp, 24dp)
- [ ] All animations implemented (bounce, pulse, fade)
- [ ] All icons match (FontAwesome or Material Icons equivalent)
- [ ] All gradients match (Brand → BrandDark, etc.)
- [ ] All modal overlays match (backdrop blur, opacity)
- [ ] All button styles match (rounded-full, gradients)
- [ ] All HUD elements positioned correctly
- [ ] All loading states match
- [ ] All error states match
- [ ] Responsive design (mobile-first, tablet support)

---

## ADDITIONAL NOTES

1. **Use Material Design 3** components where possible, but override colors to match exact brand colors
2. **Backdrop Blur:** Use `BlurredSurface` or similar Compose library
3. **Gradients:** Use `Brush.linearGradient()` with exact color stops
4. **Icons:** Use FontAwesome icons via library or Material Icons equivalent
5. **Animations:** Use Compose Animation APIs
6. **State Management:** Use StateFlow/LiveData with ViewModel
7. **Navigation:** Use Jetpack Navigation Compose
8. **Image Loading:** Use Coil for async image loading
9. **Networking:** Use Retrofit for API calls
10. **Local Storage:** Use DataStore or SharedPreferences

---

## FINAL INSTRUCTIONS

Create the Android app with **EXACT** UI matching. Every pixel, every color, every spacing, every animation must match the web version. Use this prompt as your complete reference guide.

**Start with:**
1. Set up color system
2. Create theme system (18 themes)
3. Implement each screen one by one
4. Test on multiple screen sizes
5. Verify all colors match (use color picker on web version)
6. Verify all spacing matches (use browser dev tools)
7. Verify all animations match (record and compare)

**Good luck!** 🚀

