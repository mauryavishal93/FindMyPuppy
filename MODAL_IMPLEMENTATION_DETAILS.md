# Find My Puppy - Modal/Popup Implementation Details

## Overview
The application uses a standardized modal system built on a `ModalBase` component. All modals follow consistent design patterns with proper z-index handling, fixed headers, scrollable content, and standardized close buttons.

---

## 1. ModalBase Component (Foundation)

**File:** `components/modals/ModalBase.tsx`

**Purpose:** Base component providing standardized modal structure for all popups

**Key Features:**
- **Z-index Management:** Backdrop uses `z-[100]` with inline `zIndex: 9999`, modal container uses `zIndex: 10000`, close button uses `zIndex: 10001`
- **Backdrop:** `bg-black/60 backdrop-blur-sm` with click-to-close functionality
- **Positioning:** `fixed inset-0` for full-screen overlay
- **Close Button:** Red circular button (`bg-red-500`), `w-11 h-11` on mobile, `w-9 h-9` on desktop, positioned top-right
- **Structure:** Flexbox layout with `flex flex-col` for header/content/footer arrangement
- **Max Dimensions:** `max-h-[90vh]`, configurable max-width (`sm`, `md`, `lg`, `xl`, `2xl`, `4xl`, `full`)
- **Border:** `border-4 border-white` with `rounded-[2rem]` corners

**Sub-components:**
- `ModalHeader`: Fixed header with padding for close button (`pr-16 sm:pr-14`)
- `ModalContent`: Scrollable content area with `overflow-y-auto`
- `ModalFooter`: Fixed footer section

**Props:**
```typescript
interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | 'full';
  showCloseButton?: boolean;
  className?: string;
}
```

---

## 2. AchievementsModal

**File:** `components/modals/AchievementsModal.tsx`

**Purpose:** Display user achievements with unlock status

**Props:**
- `isOpen: boolean`
- `onClose: () => void`
- `activeTheme: ThemeConfig`
- `username: string | null`

**Features:**
- Fetches achievement definitions from `db.getAchievements()`
- Checks user's unlocked achievements via `db.checkAchievements(username)`
- Shows loading state with spinning game controller emoji
- Displays achievement list with:
  - **Unlocked:** Green gradient background (`from-green-50 to-emerald-50`), green border, checkmark icon
  - **Locked:** Gray background (`bg-slate-50`), gray border, lock icon, reduced opacity
- Header: Amber/yellow gradient (`from-amber-100 via-yellow-100 to-amber-50`) with trophy emoji
- Shows progress: "X of Y unlocked"

**Data Structure:**
```typescript
interface AchievementDef {
  id: string;
  name: string;
  desc: string;
  icon: string; // Emoji icon
}
```

**API Calls:**
- `GET /api/achievements` - Fetch all achievement definitions
- `POST /api/achievements/check` - Check user's unlocked achievements

---

## 3. SettingsModal

**File:** `components/modals/SettingsModal.tsx`

**Purpose:** User settings and preferences management

**Props:**
- `onClose: () => void`
- `backgroundMusicEnabled: boolean`
- `soundEffectsEnabled: boolean`
- `hapticsEnabled: boolean`
- `webViewEnabled: boolean`
- `onToggleBackgroundMusic: () => void`
- `onToggleSoundEffects: () => void`
- `onToggleHaptics: () => void`
- `onToggleWebView: () => void`

**Features:**
- **Audio & Feedback Section:**
  - Music toggle with indigo icon
  - Sound FX toggle with pink icon
  - Vibration/Haptics toggle with orange icon
- **Display Section:**
  - Web View toggle (desktop mode) with blue icon
- **About Section:**
  - Privacy Policy link (opens in new tab)
  - App version display (from `APP_VERSION` constant)
- Toggle switches: Green when enabled, gray when disabled
- Footer: "Find My Puppy" branding

**Styling:**
- Header: Slate gradient (`from-slate-100 to-slate-200`)
- Toggle items: `bg-slate-50` with rounded corners
- Each toggle has icon, title, description, and switch button

---

## 4. InfoModal (Explorer's Guide)

**File:** `components/modals/InfoModal.tsx`

**Purpose:** Comprehensive game guide and information

**Props:**
- `onClose: () => void`
- `onOpenExplorerGuide?: () => void`
- `onOpenLeaderboard?: () => void`

**Features:**
- **Nested Modal:** Can open `PuppyDesignsModal` internally
- **Sections:**
  1. Hero section with welcome message
  2. Play Your Way (Guest vs Login benefits)
  3. Explorer's Guide feature promotion
  4. Leaderboard feature promotion
  5. How to Play (6-step tutorial)
  6. Game Modes (Easy/Medium/Hard breakdown)
  7. Hint System explanation
  8. Controls & Tips
  9. Progression & Features
  10. Android App promo
  11. Daily Check-In feature
  12. Puppy Jump feature
  13. Themes & Customization
  14. Hidden Puppy Designs (opens PuppyDesignsModal)
  15. Pro Tips section
  16. Privacy & Legal (Privacy Policy link, Delete Account link)

**Styling:**
- Header: Brand gradient (`from-brand-light via-pink-50 to-yellow-50`)
- Content: Scrollable with `hide-scrollbar` class
- Sections use gradient backgrounds, borders, and shadows
- Interactive buttons with hover effects

**Special Features:**
- YouTube video link for game trailer
- Expandable guide preview
- Multiple call-to-action buttons

---

## 5. PuppyDesignsModal

**File:** `components/modals/PuppyDesignsModal.tsx`

**Purpose:** Display all hidden puppy designs in a grid

**Props:**
- `onClose: () => void`

**Features:**
- Grid layout: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`
- Displays all puppies from `PUPPY_IMAGES` constant
- Each puppy shows:
  - Image (20x20, `object-contain`)
  - Name (from `puppyNames` array)
  - Number (#1, #2, etc.)
- Header: Purple/pink gradient (`from-purple-500 via-pink-500 to-rose-500`) with white text
- Footer badge: "Find Them All!" with gradient background
- Max width: `4xl` (larger than standard modals)

**Data:**
- Uses `PUPPY_IMAGES` array from `constants/puppyImages.ts`
- 34 unique puppy designs with names

---

## 6. ThemeModal

**File:** `components/modals/ThemeModal.tsx`

**Purpose:** Theme selection and unlocking

**Props:**
- `onClose: () => void`
- `onSelect: (theme: ThemeType) => void`
- `currentTheme: ThemeType`
- `unlockedThemes: ThemeType[]`
- `points: number`
- `username?: string`
- `onThemeUnlocked?: (themes: ThemeType[], newPoints?: number) => void`

**Features:**
- **Grid Layout:** 2-column grid displaying all themes
- **Theme States:**
  - **Selected:** Brand-colored border, scale effect, checkmark indicator
  - **Unlocked:** Clickable, hover effects
  - **Locked:** Grayed out, lock icon overlay, unlock options
- **Unlock Methods:**
  - Spend 25 points (if user has enough)
  - Complete 10 games (automatic)
- **Unlock Process:**
  - Calls `db.unlockTheme(username, theme, method)`
  - Shows loading spinner during unlock
  - Auto-selects newly unlocked theme
  - Updates points if spent
- Error handling with red error banner

**API Calls:**
- `POST /api/themes/unlock` - Unlock theme with points or games

**Theme Types:**
- sunny, night, candy, forest, park, bath, toys, streetDog, puppyPlush, dogParkDark, puppyCandy, neonPup, handDrawnPup, cosmicPuppy, safariPup, puppyHologram, cartoonChaos

---

## 7. LeaderboardModal

**File:** `components/modals/LeaderboardModal.tsx`

**Purpose:** Display player rankings and referral leaderboard

**Props:**
- `isOpen: boolean`
- `onClose: () => void`
- `activeTheme: ThemeConfig`
- `currentUsername?: string`

**Features:**
- **Tabs:** Two tabs - "Points" and "Top Referrers"
- **Points Leaderboard:**
  - Shows top 10 players
  - Displays rank, username, points
  - Highlights current user with gradient background
  - Shows current user's rank at bottom if not in top 10
  - Rank icons: 🥇 🥈 🥉 for top 3, #N for others
- **Referral Leaderboard:**
  - Shows top referrers by referral count
  - Displays rank, username, referral count
- **Loading States:** Spinning game controller emoji
- **Error Handling:** Error message with "Try Again" button
- **Empty States:** Friendly messages for no data

**Styling:**
- Header: Yellow/amber gradient (`from-yellow-100 via-amber-100 to-yellow-50`)
- Active tab: Yellow/amber gradient button
- Inactive tab: White with border
- Current user entry: Gradient background based on rank (gold/silver/bronze/blue)
- Regular entries: Slate background with hover effects

**API Calls:**
- `GET /api/leaderboard?username=...` - Fetch points leaderboard
- `GET /api/leaderboard/referrals` - Fetch referral leaderboard

**Data Structure:**
```typescript
interface LeaderboardEntry {
  username: string;
  rank: number;
  points: number;
}

interface ReferralEntry {
  username: string;
  rank: number;
  referredCount: number;
}
```

---

## 8. PaymentModal

**File:** `components/modals/PaymentModal.tsx`

**Purpose:** Purchase hints with points or money

**Props:**
- `onClose: () => void`
- `onPay: () => void`
- `onPayWithPoints: () => void`
- `currentPoints: number`
- `paymentStatus: PaymentStatus` ('idle' | 'processing' | 'verifying')
- `onCancelPayment: () => void`
- `title?: string`
- `description?: string`
- `priceOffer: PriceOffer | null`

**Features:**
- **Two Payment Methods:**
  1. **Pay with Points:** 10 points = 2 hints
     - Shows current points balance
     - Disabled if points < 10
     - Indigo-themed button
  2. **Pay with Money:** Configurable pricing
     - Shows market price vs offer price
     - Discount badge if offer available
     - Yellow gradient button
     - Displays hint count

**States:**
- **Processing/Verifying:** Shows spinner with status message
- **Idle:** Shows payment options

**Price Offer Structure:**
```typescript
interface PriceOffer {
  marketPrice: number;
  offerPrice: number;
  hintCount: number;
  offerReason: string;
}
```

**Styling:**
- Header: Centered with lightbulb icon (animated bounce)
- Points section: Indigo background (`bg-indigo-50`)
- Money section: Yellow gradient (`from-yellow-400 to-yellow-500`)
- Discount badge: Red badge in top-right corner
- "No thanks" link at bottom

**Special Features:**
- Calculates discount percentage automatically
- Shows crossed-out market price when offer exists
- Close button hidden in idle state (only "No thanks" link)

---

## 9. PaymentResultModal

**File:** `components/modals/PaymentResultModal.tsx`

**Purpose:** Display payment transaction results

**Props:**
- `result: PaymentResultType` ('success' | 'failed' | 'cancelled' | 'declined')
- `message?: string`
- `errorCode?: string`
- `onClose: () => void`

**Features:**
- **Result Types:**
  - **Success:** Green theme, checkmark icon, bounce animation
  - **Failed:** Red theme, X icon, pulse animation
  - **Declined:** Orange theme, ban icon
  - **Cancelled:** Gray theme, X icon

**Dynamic Styling:**
- Icon background gradient based on result type
- Border color matches result theme
- Background pattern color matches theme
- Text color matches theme

**Content:**
- Large icon (28x28) with gradient background
- Title with gradient text
- Message box with colored background
- Error code display (if applicable)
- Success message: "Your hints are ready to use!"
- Tips section for failed/declined payments
- Action button with appropriate text and styling

**Button Actions:**
- Success: "Awesome! Let's Play" (green)
- Cancelled: "Go Back" (gray)
- Failed/Declined: "Try Again" (red)

**Styling:**
- Icon: `w-28 h-28` circular with border
- Title: `text-4xl` with gradient text
- Message box: Rounded with colored border
- Close button hidden (uses action button instead)

---

## 10. PurchaseHistoryModal

**File:** `components/modals/PurchaseHistoryModal.tsx`

**Purpose:** Display user's purchase history

**Props:**
- `onClose: () => void`
- `username: string`
- `activeTheme: ThemeConfig`

**Features:**
- Fetches purchase history on mount via `db.getPurchaseHistory(username)`
- **Purchase Types:**
  - **Premium:** Purple/pink gradient icon with crown
  - **Points:** Yellow/orange gradient icon with lightbulb
- **Display Fields:**
  - Purchase type and pack name
  - Amount (points or money with ₹ symbol)
  - Purchase date (formatted: "Jan 28, 2026, 10:30 AM")
  - Purchase ID (monospace font)
- **States:**
  - Loading: Spinner with message
  - Error: Error icon with message
  - Empty: Shopping bag icon with message

**Styling:**
- Uses theme colors for background and text
- Header: Theme-based header background
- Purchase cards: Theme-based card background with borders
- Footer: Close button with theme button styling

**API Calls:**
- `GET /api/purchases/history?username=...` - Fetch purchase history

**Data Structure:**
```typescript
interface PurchaseHistory {
  purchaseId: string;
  purchaseType: 'Premium' | 'Points';
  pack: string;
  amount: number;
  purchaseMode: 'Money' | 'Points';
  purchaseDate: Date | string;
}
```

---

## 11. ReferFriendModal

**File:** `components/modals/ReferFriendModal.tsx`

**Purpose:** Referral system for inviting friends

**Props:**
- `isOpen: boolean`
- `onClose: () => void`
- `activeTheme: ThemeConfig`
- `playerName: string`

**Features:**
- **Referral Code Generation:** `${playerName}${currentYear}`
- **Referral Link:** `https://findmypuppy.onrender.com/?ref=${referralCode}`
- **Google Play Link:** `https://play.google.com/store/apps/details?id=com.findmypuppy.app2`
- **Referral Message:** Creative, formatted message with:
  - Game description
  - Benefits list
  - Welcome bonus (25 FREE hints)
  - Both web and app links
  - Referral code
  - Win-win messaging

**Actions:**
- **Copy Message:** Copies full referral message to clipboard
- **Share with Friends:** Uses native share API or app selector
- **App Selector:** Shows WhatsApp, Telegram, Email options

**Share Integration:**
- Native Capacitor Share API (for mobile apps)
- Web Share API (for browsers)
- Fallback to app selector (WhatsApp, Telegram, Email links)

**Styling:**
- Header: Purple/pink gradient (`from-purple-100 to-pink-100`)
- Content preview: Gradient background (`from-slate-50 to-purple-50`)
- Referral code: Highlighted in purple box
- Links: White background boxes with borders
- Copy button: Slate background, turns green when copied
- Share button: Theme button styling

**Special Features:**
- Copy confirmation tooltip
- App selector with branded buttons
- Formatted message optimized for social sharing

---

## 12. ForgotPasswordModal

**File:** `components/modals/ForgotPasswordModal.tsx`

**Purpose:** Password reset request

**Props:**
- `isOpen: boolean`
- `onClose: () => void`
- `activeTheme: ThemeConfig`

**Features:**
- **Form Fields:**
  - Email input with envelope icon
  - Email validation (regex pattern)
- **States:**
  - **Form:** Email input with submit button
  - **Success:** Confirmation message with checkmark
- **Validation:**
  - Required field check
  - Email format validation
- **API Call:** `db.forgotPassword(email)`
- **Success Message:**
  - "Check Your Email"
  - Instructions to check inbox
  - Link expiration notice (1 hour)

**Styling:**
- Uses theme colors for background
- Header: Key icon in white/transparent box
- Input: White background with brand-colored focus ring
- Error: Red banner with icon
- Success: Green checkmark in circle

**API Calls:**
- `POST /api/auth/forgot-password` - Send password reset email

---

## 13. ResetPasswordModal

**File:** `components/modals/ResetPasswordModal.tsx`

**Purpose:** Reset password with token

**Props:**
- `isOpen: boolean`
- `onClose: () => void`
- `activeTheme: ThemeConfig`
- `token: string`
- `onSuccess: () => void`

**Features:**
- **Form Fields:**
  - New password input (with show/hide toggle)
  - Confirm password input (with show/hide toggle)
  - Lock icons for both fields
- **Validation:**
  - Required fields
  - Minimum 6 characters
  - Password match check
- **Password Visibility Toggle:** Eye/eye-slash icon
- **States:**
  - **Form:** Password inputs with submit button
  - **Success:** Success message, auto-redirects after 2 seconds
- **API Call:** `db.resetPassword(token, newPassword)`

**Styling:**
- Uses theme colors
- Header: Lock icon
- Inputs: White background with show/hide button
- Error: Red banner
- Success: Green checkmark

**API Calls:**
- `POST /api/auth/reset-password` - Reset password with token

---

## Modal Usage in App.tsx

**State Management:**
- Each modal has its own boolean state (`showXxxModal`)
- Modals are conditionally rendered based on state
- Back button handler closes all modals and returns to HOME

**Modal Triggers:**
- InfoModal: From home screen info button
- SettingsModal: From home screen settings button
- ThemeModal: From home screen theme button
- LeaderboardModal: From home screen leaderboard button or InfoModal
- AchievementsModal: From home screen achievements button
- ReferFriendModal: From home screen refer button
- PaymentModal: Triggered when user needs hints
- PaymentResultModal: Shown after payment attempt
- PurchaseHistoryModal: From home screen purchase history button
- ForgotPasswordModal: From login screen
- ResetPasswordModal: From reset password email link
- PuppyDesignsModal: Nested inside InfoModal

**Z-index Hierarchy:**
- ModalBase backdrop: 9999
- ModalBase container: 10000
- Close button: 10001
- Achievement unlock overlay: 190
- Quit confirmation: 180

---

## Design System Standards

**All Modals Follow:**
1. White background (`bg-white`) for consistent contrast
2. Fixed header with gradient backgrounds
3. Scrollable content area
4. Red close button (top-right, always visible)
5. Consistent padding and spacing
6. Responsive design (mobile-first)
7. Proper z-index management
8. Click-outside-to-close functionality
9. Smooth animations (`animate-fade-in`)
10. Accessible (aria-labels, proper focus management)

**Color Contrast:**
- Text: Dark colors (`text-slate-800`, `text-slate-700`, `text-slate-600`)
- Backgrounds: Light colors (`bg-white`, `bg-slate-50`, gradients)
- Accents: Theme-appropriate colors (purple, yellow, green, etc.)
- Borders: Subtle borders for definition

**Responsive Breakpoints:**
- Mobile: Default styles
- `sm:` 640px and up
- `md:` 768px and up
- `lg:` 1024px and up

---

## API Integration

**Database Service:** `services/db.tsx`
- All modals use `db` service for API calls
- Consistent error handling
- Type-safe responses

**Common Patterns:**
- Loading states with spinners
- Error states with retry options
- Empty states with helpful messages
- Success states with confirmations

---

## Accessibility Features

- ARIA labels on close buttons
- Keyboard navigation support
- Focus management
- Screen reader friendly text
- High contrast color schemes
- Touch-friendly button sizes (minimum 44x44px on mobile)

---

## Animation & Transitions

- Fade-in animation for modal appearance
- Scale transitions on button clicks (`active:scale-95`)
- Hover effects on interactive elements
- Smooth scrolling in content areas
- Loading spinners for async operations
- Bounce animations for success states
