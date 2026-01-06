# FindMyPuppy - Complete Android App Replication Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Application Architecture](#application-architecture)
3. [Color Scheme & Branding](#color-scheme--branding)
4. [All Screens/Views](#all-screensviews)
5. [All Components](#all-components)
6. [Game Mechanics](#game-mechanics)
7. [Server API Documentation](#server-api-documentation)
8. [Database Schema](#database-schema)
9. [Payment Gateway Integration](#payment-gateway-integration)
10. [Authentication System](#authentication-system)
11. [State Management](#state-management)
12. [UI/UX Specifications](#uiux-specifications)
13. [Animations & Transitions](#animations--transitions)
14. [Audio System](#audio-system)
15. [Complete Feature List](#complete-feature-list)

---

## Project Overview

**App Name:** FindMyPuppy  
**Type:** Hidden Object Game  
**Platform:** Android Native (to be built)  
**Backend:** Node.js + Express + MongoDB  
**Payment:** Razorpay  
**Authentication:** Local + Google OAuth

### Core Concept
Players find hidden puppies in AI-generated scenes across 100 levels with 3 difficulty modes. Features include hints, points system, referral program, and multiple themes.

---

## Application Architecture

### Tech Stack (Current Web App)
- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas
- **Payment:** Razorpay
- **AI:** Google Gemini API (for scene generation)
- **Styling:** Tailwind CSS

### Android Architecture Recommendation
- **Language:** Kotlin
- **UI Framework:** Jetpack Compose
- **Architecture:** MVVM (Model-View-ViewModel)
- **State Management:** StateFlow / LiveData
- **Networking:** Retrofit + OkHttp
- **Database:** Room (local) + MongoDB (remote)
- **Dependency Injection:** Hilt / Koin
- **Image Loading:** Coil
- **Payment:** Razorpay Android SDK

---

## Color Scheme & Branding

### Primary Brand Colors
```kotlin
object BrandColors {
    val BrandLight = Color(0xFFFFD1DC)  // #FFD1DC
    val Brand = Color(0xFFFF69B4)       // #FF69B4
    val BrandDark = Color(0xFFC71585)  // #C71585
}
```

### Theme System
The app supports **18 different themes**. Each theme has:
- Background gradient
- Card background
- Text colors (primary, secondary)
- Accent color
- Button style
- Header background
- Icon background

#### Theme List:
1. **Sunny Day** - Sky blue to green gradient
2. **Starry Night** - Dark slate to indigo
3. **Candy Land** - Pink to purple gradient
4. **Magic Forest** - Emerald to teal
5. **Puppy Park** - Green to lime to sky
6. **Bubble Bath** - Cyan to blue
7. **Toy Paradise** - Yellow to red to blue
8. **Street Dog** - Yellow with black borders (comic style)
9. **Puppy Plush** - Warm beige tones (#FFF6E9, #FFE4C4)
10. **Dog Park Dark** - Dark slate with emerald accents
11. **Puppy Candy** - Pink, yellow, sky gradient
12. **Neon Pup Arcade** - Black with cyan/fuchsia neon
13. **Hand-Drawn Puppy** - Paper texture with amber
14. **Cosmic Puppy** - Indigo to purple to black
15. **Safari Pup** - Lime to amber to orange
16. **Puppy Hologram** - Black with white/cyan glass effect
17. **Cartoon Chaos Pup** - Red, yellow, blue gradient

### Default Theme: Sunny Day
- Background: `bg-gradient-to-b from-sky-100 via-white to-green-50`
- Card: `bg-white/60 border-white/60`
- Text: `text-slate-800`
- Subtext: `text-slate-600`
- Accent: `text-brand` (#FF69B4)
- Button: `bg-gradient-to-r from-brand to-brand-dark`

---

## All Screens/Views

### 1. LOGIN View
**File:** `views/LoginView.tsx`

**Purpose:** User authentication screen

**Features:**
- Username/Email input field
- Password input field (with show/hide toggle)
- Toggle between Login and Signup modes
- Referral code input (auto-detected from URL params)
- "Sign in with Google" button (Login mode)
- "Sign up with Google" button (Signup mode)
- Google OAuth integration
- Form validation
- Error message display
- Loading states

**Layout:**
- Centered card with rounded corners (rounded-[2rem])
- Brand-colored header
- Input fields with icons
- Primary action button (Login/Signup)
- Secondary action button (Google OAuth)
- Link to toggle between modes

**Colors:**
- Background: Theme-based gradient
- Card: White with transparency
- Button: Brand gradient (pink)
- Text: Slate-800

**Key Functions:**
- `handleLogin()` - Local authentication
- `handleSignup()` - User registration
- `handleGoogleSignIn()` - Google OAuth flow
- Auto-fill referral code from URL

---

### 2. HOME View
**File:** `views/HomeView.tsx`

**Purpose:** Main menu / Difficulty selection

**Features:**
- Game logo/title
- Three difficulty cards (Easy, Medium, Hard)
- User profile dropdown (top-right)
- Theme selector button
- Info/Help button
- Purchase History button
- Refer Friend button
- Logout option
- User stats display (points, hints)

**Difficulty Cards:**
Each card shows:
- Difficulty name (Easy/Medium/Hard)
- Icon (seedling/fire/skull)
- Description
- Unlock status
- Points per level
- Timer info (if applicable)
- Puppy count range

**Layout:**
- Full-screen gradient background (theme-based)
- Centered content area
- Grid layout for difficulty cards
- Header with user menu
- Footer with action buttons

**Colors:**
- Easy: Emerald green (#10B981)
- Medium: Blue (#3B82F6)
- Hard: Rose red (#E11D48)

---

### 3. LEVEL_SELECT View
**File:** `components/LevelSelector.tsx`

**Purpose:** Level selection grid

**Features:**
- Grid of level buttons (1-100)
- Visual indicators:
  - ✅ Cleared levels (green checkmark)
  - 🔒 Locked levels (gray, disabled)
  - Current level (highlighted)
- Level numbers
- Back button
- Difficulty indicator
- Mute toggle

**Layout:**
- Scrollable grid (5 columns)
- Each level is a square button
- Cleared levels show checkmark icon
- Locked levels are grayed out
- Current level has border highlight

**Colors:**
- Cleared: Green background with white checkmark
- Locked: Gray background, disabled
- Available: Theme-based button color
- Current: Brand color border

---

### 4. GAME View
**File:** `views/GameView.tsx`

**Purpose:** Main gameplay screen

**Features:**
- Game canvas (scrollable, zoomable image)
- Header bar with:
  - Back button (X)
  - Timer (if applicable)
  - Difficulty & Level info
  - Mute button
- HUD elements:
  - Top-left: Wrong attempts counter (🐕 icons, 3 max)
  - Top-right: Puppies found counter (X / Total)
- Hint button (bottom-right, yellow lightbulb)
- Loading screen (AI generation + asset loading)
- Quit confirmation modal

**Game Canvas Features:**
- Large scrollable image (1600x1600 base, scalable)
- Pinch-to-zoom (mobile) / Ctrl+Scroll (desktop)
- Drag to pan
- Click/tap to find puppies
- Wrong click detection (3 attempts max)
- Hint highlighting (1-2 puppies with golden glow)
- Auto-scroll to highlighted puppies

**Layout:**
- Full-screen game area
- Fixed header (60px + safe area)
- Scrollable game canvas
- Floating HUD elements
- Fixed hint button

**Colors:**
- Background: Slate-900 (dark)
- Header: Slate-900/90 with backdrop blur
- Timer: Changes color based on time left
  - Normal: Slate-800
  - Warning (≤30s): Orange-500
  - Critical (≤10s): Red-500 with pulse
- Attempts: Red-900/80 background
- Puppies counter: Slate-900/80 background

---

### 5. WIN View
**File:** `App.tsx` (modal overlay)

**Purpose:** Level completion screen

**Features:**
- Trophy icon (animated bounce)
- "Level Clear!" message
- Score display
- Level number
- "Next Level" button
- "Back to Map" button
- Confetti animation (20 falling squares)

**Layout:**
- Full-screen overlay (black/60 with blur)
- Centered modal card
- Icon above card (absolute positioned)
- Content centered
- Buttons at bottom

**Colors:**
- Background overlay: Black/60 with backdrop blur
- Card: White with border-4 border-white
- Icon background: Yellow-100
- Icon: Yellow-500
- Button: Green to emerald gradient
- Confetti: Random colors (red, yellow, blue, green, pink)

---

### 6. GAME_OVER View
**File:** `App.tsx` (modal overlay)

**Purpose:** Time's up screen

**Features:**
- Red X icon
- "Time's Up!" message
- "Those puppies were too good at hiding" message
- "Try Again" button
- "Give Up" button

**Layout:**
- Full-screen overlay (black/80 with blur)
- Centered modal card
- Icon above card
- Content centered

**Colors:**
- Background: Black/80 with backdrop blur
- Card: White with border-4 border-red-100
- Icon background: Red-100
- Icon: Red-500
- Button: Blue to indigo gradient

---

### 7. GAME_LOST View
**File:** `App.tsx` (modal overlay)

**Purpose:** Wrong attempts exceeded screen

**Features:**
- Crying face icon (sad-tear, animated bounce)
- "Oops! You Lost!" message (gradient text)
- "🐾 Too Many Wrong Guesses! 🐾" message
- Explanation text
- Encouraging quote
- "Try Again" button
- "Back to Map" button
- Animated background pattern (30 X icons)

**Layout:**
- Full-screen overlay (black/90 with blur)
- Centered modal card
- Icon above card (w-28 h-28)
- Content below icon

**Colors:**
- Background: Black/90 with backdrop blur
- Card: White with border-4 border-red-200
- Icon background: Red-400 to rose-600 gradient
- Icon: White
- Title: Red-600 to rose-600 gradient (text-transparent)
- Button: Blue to indigo gradient

---

## All Components

### Modals

#### 1. InfoModal
**File:** `components/modals/InfoModal.tsx`

**Purpose:** Game guide and instructions

**Sections:**
1. Hero section (Welcome message)
2. How to Play (6 steps with icons)
3. YouTube video link button
4. Difficulty Modes (Easy/Medium/Hard cards)
5. Hint System (Free, Points, Purchase)
6. Controls & Tips
7. Progression & Features
8. Pro Tip section

**Layout:**
- Scrollable modal (max-height: 90vh)
- Fixed header with close button
- Content sections with spacing
- Color-coded sections

---

#### 2. ThemeModal
**File:** `components/modals/ThemeModal.tsx`

**Purpose:** Theme selection

**Features:**
- Grid of theme cards (18 themes)
- Each card shows:
  - Theme name
  - Icon
  - Preview colors
- Current theme highlighted
- Close button

**Layout:**
- Scrollable grid
- Theme cards with hover effects
- Selected theme has border highlight

---

#### 3. PaymentModal
**File:** `components/modals/PaymentModal.tsx`

**Purpose:** Hint purchase screen

**Features:**
- Title and description
- Price offer display:
  - Market price (strikethrough)
  - Offer price (highlighted)
  - Savings amount
- Payment options:
  - Pay with Money (Razorpay)
  - Pay with Points (10 points = 2 hints)
- Payment status indicators
- Cancel button
- Loading states

**Layout:**
- Centered modal
- Price display (large, prominent)
- Two payment buttons
- Status messages

**Colors:**
- Primary button: Brand gradient
- Points button: Indigo gradient
- Price: Large, bold, brand color

---

#### 4. PurchaseHistoryModal
**File:** `components/modals/PurchaseHistoryModal.tsx`

**Purpose:** Transaction history

**Features:**
- List of purchases
- Filters: Money, Points, Referral
- Each entry shows:
  - Date
  - Type (Hints/Premium)
  - Pack name
  - Amount
  - Payment mode icon
- Empty state message
- Close button

**Layout:**
- Scrollable list
- Card-based entries
- Icons for payment modes

---

#### 5. ReferFriendModal
**File:** `components/modals/ReferFriendModal.tsx`

**Purpose:** Referral code sharing

**Features:**
- Referral code display (username + 4 random chars)
- Share button (native share API)
- Instructions text
- Copy to clipboard
- Close button

**Layout:**
- Centered modal
- Large code display
- Share button (prominent)
- Instructions below

---

### UI Components

#### 1. Button
**File:** `components/ui/Button.tsx`

**Purpose:** Reusable button component

**Variants:**
- Primary (gradient)
- Secondary (outline)
- Danger (red)
- Success (green)

**Props:**
- `onClick`
- `className`
- `children`
- `disabled`

---

#### 2. DifficultyCard
**File:** `components/ui/DifficultyCard.tsx`

**Purpose:** Difficulty selection card

**Features:**
- Icon
- Title
- Description
- Stats (timer, puppies, points)
- Lock/unlock state
- Click handler

---

#### 3. UserDropdown
**File:** `components/ui/UserDropdown.tsx`

**Purpose:** User menu

**Features:**
- User avatar/initial
- Dropdown menu:
  - Theme selector
  - Purchase History
  - Refer Friend
  - Logout
- Click outside to close

---

#### 4. GameCanvas
**File:** `components/GameCanvas.tsx`

**Purpose:** Gameplay area

**Features:**
- Background image display
- Puppy rendering (with camouflage)
- Zoom controls
- Pan controls
- Click detection
- Hint highlighting
- Loading states
- Error handling

**Key Functions:**
- `getPuppyStyles()` - Camouflage logic based on difficulty
- Click handlers for puppies and background
- Zoom calculation
- Scroll management

---

#### 5. LevelSelector
**File:** `components/LevelSelector.tsx`

**Purpose:** Level grid

**Features:**
- Grid layout (5 columns)
- Level buttons
- Status indicators
- Scroll support
- Back button

---

#### 6. GameLogo
**File:** `components/GameLogo.tsx`

**Purpose:** App logo/title

**Features:**
- Animated logo
- Title text
- Subtitle

---

### Hooks (Custom React Hooks)

#### 1. useGameState
**File:** `hooks/useGameState.ts`

**Purpose:** Game state management

**State:**
- `puppies: Puppy[]`
- `bgImage: string | null`
- `loading: boolean`

**Functions:**
- `initLevel(level, difficulty)` - Initialize level
- `updatePuppy(id, updates)` - Update puppy state

---

#### 2. useTimer
**File:** `hooks/useTimer.ts`

**Purpose:** Game timer

**State:**
- `timeLeft: number | null`
- `isRunning: boolean`

**Functions:**
- `formatTime(seconds)` - Format MM:SS
- `resetTimer()` - Reset to timeLimit
- `setTimeLeft(value)` - Set time

---

#### 3. useHints
**File:** `hooks/useHints.ts`

**Purpose:** Hint system

**State:**
- `showHints: boolean`
- `freeHintsRemaining: number`
- `hasPremiumHints: boolean`

**Functions:**
- `handleUseHint()` - Activate hint
- `resetHints()` - Reset for new level

**Logic:**
- 2 free hints per level
- Uses premium hints if free exhausted
- Triggers payment modal if all exhausted

---

#### 4. usePayment
**File:** `hooks/usePayment.ts`

**Purpose:** Payment handling

**State:**
- `paymentStatus: 'idle' | 'processing' | 'verifying' | 'success' | 'failed'`
- `isHandled: boolean`

**Functions:**
- `openPaymentModal(config)` - Open payment screen
- `closePaymentModal()` - Close payment screen
- `handlePayment()` - Initiate Razorpay payment
- `handlePayWithPoints()` - Points-based purchase

**Payment Flow:**
1. Create Razorpay order (backend)
2. Open Razorpay checkout
3. Handle payment result
4. Verify payment (backend)
5. Update user hints
6. Create purchase history

---

#### 5. useAudio
**File:** `hooks/useAudio.ts`

**Purpose:** Audio management

**Features:**
- Ambient background music
- Sound effects:
  - `found` - Puppy found
  - `clear` - Level cleared
  - `fail` - Game over / wrong attempt
  - `pay` - Payment success
  - `hint` - Hint activated

**State:**
- `isMuted: boolean`
- `ambientAudioRef: Ref<HTMLAudioElement>`

**Functions:**
- `playSfx(type, muted)` - Play sound effect
- Auto-play ambient music (if not muted)

---

## Game Mechanics

### Difficulty Levels

#### Easy Mode
- **Timer:** None (unlimited time)
- **Puppies:** 15-25
- **Points:** +5 per level
- **Camouflage:** Light (20% grayscale, 60% opacity)
- **Visibility:** Easier to spot

#### Medium Mode
- **Timer:** 150 seconds (2 minutes 30 seconds)
- **Puppies:** 25-35
- **Points:** +10 per level
- **Camouflage:** Medium (60% grayscale, 45% opacity)
- **Visibility:** Moderately hidden

#### Hard Mode
- **Timer:** 180 seconds (3 minutes)
- **Puppies:** 40-50
- **Points:** +15 per level
- **Camouflage:** Heavy (100% grayscale, 35% opacity)
- **Visibility:** Nearly invisible

### Puppy Camouflage System

**Base Properties:**
- `opacity: number` (0-1)
- `hueRotate: number` (degrees)
- `scale: number` (size multiplier)
- `rotation: number` (degrees)

**Difficulty Adjustments:**
- **Easy:** `grayscale(20%) contrast(1.1)`, opacity +0.2
- **Medium:** `grayscale(60%) hue-rotate(Xdeg)`, opacity +0.1
- **Hard:** `grayscale(100%) hue-rotate(Xdeg) brightness(0.9)`, base opacity

**Blend Mode:** `mix-blend-mode: luminosity` (except Easy when loadError)

### Wrong Attempts System

- **Max Attempts:** 3
- **Counter:** Top-left HUD (🐕 icons)
- **Visual Feedback:**
  - 3 attempts: White icons
  - 2 attempts: Yellow icon (1 remaining)
  - 1 attempt: Red icon, pulsing
  - 0 attempts: Game Lost screen

**Detection:**
- Click on background (not on puppy) = wrong attempt
- Click on found puppy = ignored
- Click on unfound puppy = correct (finds puppy)

### Hint System

**Free Hints:**
- 2 per level
- Resets on new level
- Shows highlighted puppies (1-2 max)
- Auto-scrolls to highlighted area

**Premium Hints:**
- Purchased with money or points
- Stored in user account
- Used when free hints exhausted
- 10 points = 2 hints

**Hint Behavior:**
- Highlights 1-2 unfound puppies
- Golden glow effect
- Pulsing animation
- Auto-scroll to visible puppies
- If none visible, scrolls to random puppy

### Level Progression

- **Total Levels:** 100
- **Progression:** Linear (1-100)
- **Unlocking:** Sequential (must clear level N to unlock N+1)
- **Points Accumulation:** Cumulative across all levels
- **Difficulty Tracking:** Separate counters for Easy/Medium/Hard

### Scoring System

**Points per Level:**
- Easy: 5 points
- Medium: 10 points
- Hard: 15 points

**First Clear Bonus:**
- Points only awarded on first clear
- Subsequent clears don't award points

**Points Usage:**
- 10 points = 2 premium hints
- Displayed in user profile
- Synced with database

---

## Server API Documentation

### Base URL
- **Production:** `https://findmypuppydb.onrender.com`
- **Development:** `http://localhost:5774`

### Authentication Endpoints

#### POST /api/login
**Purpose:** User login

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "username": "string",
    "email": "string",
    "hints": 0,
    "points": 0,
    "premium": false,
    "levelPassedEasy": 0,
    "levelPassedMedium": 0,
    "levelPassedHard": 0,
    "referredBy": "string"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

#### POST /api/signup
**Purpose:** User registration

**Request:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "referralCode": "string (optional)"
}
```

**Response:** Same as login

**Referral Logic:**
- If referralCode provided, extracts username (last 4 chars are random)
- Looks up referrer (case-insensitive)
- Awards 25 hints to new user
- Awards 25 hints to referrer
- Creates purchase history entry for referrer

---

#### POST /api/auth/google/signin
**Purpose:** Google OAuth authentication

**Request:**
```json
{
  "idToken": "string (Google ID token)",
  "referralCode": "string (optional)"
}
```

**Response:** Same as login

**Logic:**
- Verifies Google ID token
- Creates user if new (generates username from name/email)
- Links Google account if existing email
- Handles referral code same as signup

---

### User Data Endpoints

#### POST /api/user/update-hints
**Purpose:** Update user hints

**Request:**
```json
{
  "username": "string",
  "hints": 0
}
```

**Response:**
```json
{
  "success": true,
  "message": "Hints updated successfully",
  "hints": 0
}
```

---

#### POST /api/user/update-points
**Purpose:** Update user points

**Request:**
```json
{
  "username": "string",
  "points": 0
}
```

**Response:**
```json
{
  "success": true,
  "message": "Points updated successfully",
  "points": 0
}
```

---

#### POST /api/user/update-premium
**Purpose:** Update premium status

**Request:**
```json
{
  "username": "string",
  "premium": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Premium status updated",
  "premium": true
}
```

---

#### POST /api/user/update-level-passed
**Purpose:** Update level progress

**Request:**
```json
{
  "username": "string",
  "difficulty": "Easy" | "Medium" | "Hard",
  "levelPassed": 0
}
```

**Response:**
```json
{
  "success": true,
  "message": "Level passed count updated",
  "levelPassedEasy": 0,
  "levelPassedMedium": 0,
  "levelPassedHard": 0
}
```

---

#### GET /api/user/:username
**Purpose:** Get user data

**Response:**
```json
{
  "success": true,
  "user": {
    "username": "string",
    "email": "string",
    "hints": 0,
    "points": 0,
    "premium": false,
    "levelPassedEasy": 0,
    "levelPassedMedium": 0,
    "levelPassedHard": 0,
    "referredBy": "string"
  }
}
```

---

### Payment Endpoints

#### POST /api/razorpay/create-order
**Purpose:** Create Razorpay payment order

**Request:**
```json
{
  "amount": 0,
  "currency": "INR"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "string",
  "amount": 0,
  "currency": "INR",
  "keyId": "string"
}
```

---

#### POST /api/razorpay/verify-payment
**Purpose:** Verify Razorpay payment

**Request:**
```json
{
  "orderId": "string",
  "paymentId": "string",
  "signature": "string",
  "amount": 0
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully"
}
```

---

### Purchase History Endpoints

#### POST /api/purchase-history
**Purpose:** Create purchase history entry

**Request:**
```json
{
  "username": "string",
  "amount": 0,
  "purchaseType": "Hints" | "Premium",
  "pack": "string",
  "purchaseMode": "Money" | "Points" | "Referral"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Purchase history created",
  "purchase": {
    "purchaseId": "string",
    "purchaseDate": "ISO date",
    "amount": 0,
    "purchaseType": "string",
    "pack": "string",
    "purchaseMode": "string"
  }
}
```

---

#### GET /api/purchase-history/:username
**Purpose:** Get user purchase history

**Query Params:** None

**Response:**
```json
{
  "success": true,
  "purchases": [
    {
      "purchaseId": "string",
      "purchaseDate": "ISO date",
      "amount": 0,
      "purchaseType": "Hints",
      "pack": "string",
      "purchaseMode": "Money"
    }
  ]
}
```

**Filter:** Only returns purchases where `purchaseMode` is 'Money' or 'Referral' (excludes 'Points')

---

### Price Offer Endpoints

#### GET /api/price-offer
**Purpose:** Get current price offer

**Response:**
```json
{
  "success": true,
  "offer": {
    "hintPack": "100 Hints Pack",
    "marketPrice": 99,
    "offerPrice": 9,
    "hintCount": 100,
    "offerReason": "Special Offer"
  }
}
```

---

#### POST /api/price-offer
**Purpose:** Create/update price offer

**Request:**
```json
{
  "hintPack": "string",
  "marketPrice": 0,
  "offerPrice": 0,
  "hintCount": 0,
  "offerReason": "string"
}
```

---

### Health Check

#### GET /api/health
**Purpose:** Server health check

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

## Database Schema

### MongoDB Collections

#### 1. user Collection

**Schema:**
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (optional, for OAuth users),
  googleId: String (unique, sparse, for Google OAuth),
  authProvider: String (enum: ['local', 'google'], default: 'local'),
  hints: Number (default: 0),
  points: Number (default: 0),
  premium: Boolean (default: false),
  levelPassedEasy: Number (default: 0),
  levelPassedMedium: Number (default: 0),
  levelPassedHard: Number (default: 0),
  referredBy: String (default: ""),
  createdAt: Date (default: Date.now),
  lastLogin: Date (default: Date.now)
}
```

**Indexes:**
- `username`: Unique
- `email`: Unique
- `googleId`: Unique, sparse

---

#### 2. purchaseHistory Collection

**Schema:**
```javascript
{
  username: String (required),
  purchaseDate: Date (default: Date.now),
  purchaseId: String (required, unique),
  amount: Number (required),
  purchaseType: String (enum: ['Premium', 'Hints'], required),
  pack: String (required),
  purchaseMode: String (enum: ['Money', 'Points', 'Referral'], default: 'Money')
}
```

**Indexes:**
- `purchaseId`: Unique
- `username`: Indexed for queries

---

#### 3. priceOffer Collection

**Schema:**
```javascript
{
  hintPack: String (required, unique),
  marketPrice: Number (required),
  offerPrice: Number (required),
  hintCount: Number (required),
  offerReason: String (default: 'Special Offer')
}
```

**Indexes:**
- `hintPack`: Unique

---

## Payment Gateway Integration

### Razorpay Configuration

**Environment Variables:**
- `RAZORPAY_KEY_ID`: Razorpay key ID
- `RAZORPAY_KEY_SECRET`: Razorpay key secret

**Android Integration:**
1. Add Razorpay Android SDK dependency
2. Initialize Razorpay in Application class
3. Create order via backend API
4. Open Razorpay checkout
5. Handle payment result callbacks
6. Verify payment via backend API

**Payment Flow:**
```
User clicks "Buy Hints"
  ↓
Frontend calls /api/razorpay/create-order
  ↓
Backend creates Razorpay order
  ↓
Frontend receives orderId
  ↓
Frontend opens Razorpay checkout
  ↓
User completes payment
  ↓
Razorpay returns paymentId, signature
  ↓
Frontend calls /api/razorpay/verify-payment
  ↓
Backend verifies signature
  ↓
Backend updates user hints
  ↓
Backend creates purchase history
  ↓
Frontend updates UI
```

**Payment Modes:**
- UPI
- Credit/Debit Cards
- Net Banking
- Wallets

---

## Authentication System

### Local Authentication

**Flow:**
1. User enters username/email + password
2. Frontend sends to `/api/login` or `/api/signup`
3. Backend hashes password (bcrypt)
4. Backend verifies credentials
5. Backend returns user data
6. Frontend stores username in localStorage
7. Frontend syncs user data

**Password Hashing:**
- Algorithm: bcrypt
- Salt rounds: 10

---

### Google OAuth

**Flow:**
1. User clicks "Sign in with Google"
2. Google Identity Services loads
3. User selects Google account
4. Google returns ID token
5. Frontend sends ID token to `/api/auth/google/signin`
6. Backend verifies token with Google
7. Backend creates/updates user
8. Backend returns user data
9. Frontend stores username

**Configuration:**
- Frontend: `VITE_GOOGLE_CLIENT_ID` environment variable
- Backend: `GOOGLE_CLIENT_ID` environment variable
- Must match same OAuth client

**User Creation:**
- Username generated from Google name (sanitized, unique)
- Email from Google account
- `authProvider: 'google'`
- `googleId` stored
- Password field left empty

---

## State Management

### Frontend State (React)

**App-Level State:**
- `view`: Current screen ('LOGIN' | 'HOME' | 'LEVEL_SELECT' | 'GAME' | 'WIN' | 'GAME_OVER' | 'GAME_LOST')
- `selectedDifficulty`: Current difficulty
- `currentLevelId`: Current level number
- `loginName`: Username
- `isMuted`: Audio mute state
- `isTimerRunning`: Timer active state
- `timeLimit`: Timer limit (seconds)
- `wrongAttempts`: Wrong click counter (0-3)
- `progress`: User progress object
- `priceOffer`: Current price offer
- Modal states (info, theme, payment, etc.)

**LocalStorage:**
- `findMyPuppy_progress`: User progress JSON

**Game State (useGameState hook):**
- `puppies`: Array of puppy objects
- `bgImage`: Background image URL
- `loading`: Loading state

---

### Backend State (MongoDB)

**Persistent State:**
- User accounts
- Purchase history
- Price offers
- Level progress

**Session State:**
- None (stateless API)

---

## UI/UX Specifications

### Typography

**Font Family:**
- System default: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`

**Font Sizes:**
- Headers: `text-2xl`, `text-3xl`, `text-4xl`
- Body: `text-sm`, `text-base`
- Small: `text-xs`, `text-[10px]`

**Font Weights:**
- Bold: `font-bold`
- Black: `font-black`
- Medium: `font-medium`

---

### Spacing

**Padding:**
- Cards: `p-4`, `p-5`, `p-6`, `p-8`
- Buttons: `px-4 py-2`, `px-3 py-1.5`
- Sections: `space-y-4`, `space-y-6`

**Margins:**
- Between elements: `mb-2`, `mb-3`, `mb-4`, `mb-6`
- Gaps: `gap-2`, `gap-3`, `gap-4`

---

### Border Radius

- Cards: `rounded-[2rem]`, `rounded-2xl`, `rounded-xl`
- Buttons: `rounded-full`, `rounded-lg`
- Icons: `rounded-full`

---

### Shadows

- Cards: `shadow-2xl`, `shadow-lg`
- Buttons: `shadow-lg`, `shadow-md`
- Icons: `shadow-sm`

---

### Transitions

- Hover: `transition-all`, `transition-colors`
- Duration: `duration-300`, `duration-500`
- Easing: `ease-out`, `ease-in-out`

---

## Animations & Transitions

### Loading Animations

**AI Generation:**
- Spinning ring
- Bouncing circle with icon
- Progress bar with moving dog emoji
- Percentage display

**Asset Loading:**
- Progress bar (10% → 100%)
- Fade transition (500ms)

---

### Game Animations

**Puppy Found:**
- Scale up (2.5x)
- Bounce animation
- Drop shadow
- Brightness increase

**Hint Highlighting:**
- Golden glow (`drop-shadow(0 0 15px rgba(255, 215, 0, 0.9))`)
- Pulse animation
- Ring border (4px, yellow-400)

**Wrong Attempt:**
- Red flash (optional)
- Counter update animation

---

### Modal Animations

**Fade In:**
- `animate-fade-in` class
- Opacity 0 → 1
- Duration: 300ms

**Bounce:**
- Trophy icon: `animate-bounce-short`
- Duration: 0.5s, infinite

**Pulse:**
- Timer (critical): `animate-pulse`
- Hint button (active): `animate-pulse`

---

### Confetti Animation

**WIN Screen:**
- 20 falling squares
- Random colors (red, yellow, blue, green, pink)
- Random positions
- Random delays (0-2s)
- Random durations (2-5s)
- Rotation animation

---

## Audio System

### Background Music

**File:** Ambient loop (optional)
**Behavior:**
- Plays on HOME screen (if not muted)
- Loops continuously
- Pauses on mute
- Stops on logout

---

### Sound Effects

**Types:**
1. **found** - Puppy found (success sound)
2. **clear** - Level cleared (victory sound)
3. **fail** - Game over / wrong attempt (error sound)
4. **pay** - Payment success (cha-ching sound)
5. **hint** - Hint activated (magic sound)

**Implementation:**
- HTML5 Audio elements
- Play on demand
- Respect mute setting
- Short duration (< 1s)

---

## Complete Feature List

### Core Gameplay
- [x] Find hidden puppies in AI-generated scenes
- [x] 3 difficulty modes (Easy, Medium, Hard)
- [x] 100 levels per difficulty
- [x] Timer system (Medium/Hard only)
- [x] Wrong attempts limit (3 max)
- [x] Zoom and pan controls
- [x] Puppy camouflage system
- [x] Level progression tracking
- [x] Points system
- [x] First clear bonus

### Hints System
- [x] 2 free hints per level
- [x] Premium hints (purchasable)
- [x] Points-based hints (10 points = 2 hints)
- [x] Hint highlighting (1-2 puppies)
- [x] Auto-scroll to highlighted puppies
- [x] Hint counter display

### User Management
- [x] Local authentication (username/password)
- [x] Google OAuth sign-in
- [x] User registration
- [x] Profile management
- [x] Progress synchronization
- [x] Offline mode support

### Payment System
- [x] Razorpay integration
- [x] Hint pack purchases
- [x] Points-based purchases
- [x] Purchase history
- [x] Payment verification
- [x] Price offers system

### Referral Program
- [x] Referral code generation (username + 4 random chars)
- [x] Referral code sharing (native share)
- [x] 25 hints bonus for new user
- [x] 25 hints bonus for referrer
- [x] Referral tracking in database

### Themes
- [x] 18 different themes
- [x] Theme selection modal
- [x] Theme persistence
- [x] Dynamic color application

### UI/UX Features
- [x] Responsive design (mobile-first)
- [x] Dark/light theme support (via themes)
- [x] Smooth animations
- [x] Loading states
- [x] Error handling
- [x] Empty states
- [x] Modal system
- [x] Toast notifications (via alerts)

### Information & Help
- [x] Info modal with game guide
- [x] YouTube video link
- [x] Step-by-step instructions
- [x] Difficulty explanations
- [x] Controls guide
- [x] Pro tips

### Audio
- [x] Background music
- [x] Sound effects
- [x] Mute toggle
- [x] Audio state persistence

### Data Management
- [x] LocalStorage for progress
- [x] MongoDB for user data
- [x] Real-time synchronization
- [x] Purchase history tracking
- [x] Level progress tracking

---

## Android Implementation Notes

### Screen Sizes
- **Target:** Mobile phones (portrait)
- **Minimum:** 360x640 (mdpi)
- **Recommended:** 390x844 (iPhone 12 size for web)
- **Maximum:** Tablet support (optional)

### Navigation
- **Back Button:** Hardware back button support
- **Stack Management:** Proper activity/fragment stack
- **Deep Linking:** Support for referral codes in URLs

### Performance
- **Image Loading:** Lazy loading for game images
- **Caching:** Cache AI-generated scenes
- **Memory:** Optimize for large images (1600x1600)
- **Network:** Offline mode support

### Permissions
- **Internet:** Required
- **Storage:** Optional (for caching)

### Dependencies (Android)
```gradle
// Razorpay
implementation 'com.razorpay:checkout:1.6.33'

// Networking
implementation 'com.squareup.retrofit2:retrofit:2.9.0'
implementation 'com.squareup.okhttp3:okhttp:4.11.0'

// Image Loading
implementation 'io.coil-kt:coil:2.5.0'

// Google Sign-In
implementation 'com.google.android.gms:play-services-auth:20.7.0'

// JSON
implementation 'com.google.code.gson:gson:2.10.1'
```

---

## Exact Color Values

### Brand Colors (Hex)
- Brand Light: `#FFD1DC`
- Brand: `#FF69B4`
- Brand Dark: `#C71585`

### Difficulty Colors
- Easy: `#10B981` (Emerald-500)
- Medium: `#3B82F6` (Blue-500)
- Hard: `#E11D48` (Rose-600)

### Status Colors
- Success: `#10B981` (Green)
- Warning: `#F59E0B` (Amber-500)
- Error: `#EF4444` (Red-500)
- Info: `#3B82F6` (Blue-500)

### Background Colors
- Dark: `#0F172A` (Slate-900)
- Light: `#F8FAFC` (Slate-50)
- White: `#FFFFFF`

---

## Font Awesome Icons Used

- `fa-paw` - Puppy/paw icon
- `fa-clock` - Timer
- `fa-lightbulb` - Hints
- `fa-trophy` - Victory
- `fa-times` - Close/error
- `fa-sad-tear` - Game lost
- `fa-dog` - Puppy icon (attempts)
- `fa-exclamation-triangle` - Warning
- `fa-book-open` - Info/guide
- `fa-palette` - Themes
- `fa-shopping-cart` - Purchase
- `fa-history` - Purchase history
- `fa-share-alt` - Share referral
- `fa-user` - User profile
- `fa-sign-out-alt` - Logout
- `fa-redo` - Retry
- `fa-map` - Back to map
- `fa-arrow-right` - Next
- `fa-youtube` - YouTube link
- `fa-heart` - Favorites (if used)
- `fa-star` - Points/rating
- `fa-gift` - Free hints
- `fa-coins` - Points
- `fa-check` - Success/cleared
- `fa-lock` - Locked
- `fa-unlock` - Unlocked

---

## API Error Handling

### Standard Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Server Error

---

## Environment Variables

### Frontend (.env.local)
```
VITE_API_BASE_URL=https://findmypuppydb.onrender.com
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### Backend (.env)
```
MONGO_URI=mongodb+srv://...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
GOOGLE_CLIENT_ID=...
PORT=5774
NODE_ENV=production
```

---

## Testing Checklist

### Authentication
- [ ] Local login
- [ ] Local signup
- [ ] Google OAuth sign-in
- [ ] Google OAuth sign-up
- [ ] Referral code in signup
- [ ] Invalid credentials
- [ ] Duplicate username/email

### Gameplay
- [ ] Level initialization
- [ ] Puppy finding
- [ ] Wrong attempts counting
- [ ] Timer countdown
- [ ] Level completion
- [ ] Game over (time)
- [ ] Game lost (wrong attempts)
- [ ] Zoom and pan
- [ ] Hint activation

### Payments
- [ ] Razorpay order creation
- [ ] Payment flow
- [ ] Payment verification
- [ ] Points purchase
- [ ] Purchase history

### Data Sync
- [ ] User data sync
- [ ] Progress sync
- [ ] Offline mode
- [ ] Purchase history fetch

---

## Additional Notes

### AI Scene Generation
- Uses Google Gemini API
- Generates unique scenes per level
- Caches theme prompts
- Fallback to default scene on error

### Image Loading
- Background images: Large (1600x1600)
- Puppy images: Variable sizes
- Lazy loading recommended
- Error handling with fallback

### Performance Optimization
- Code splitting
- Image optimization
- Lazy loading
- Caching strategies

---

## Conclusion

This guide contains all the information needed to recreate the FindMyPuppy game as an exact Android application. Every screen, component, color, API endpoint, and feature has been documented in detail.

**Key Points for AI Implementation:**
1. Follow the exact color scheme and theme system
2. Implement all 7 views exactly as described
3. Use the same API endpoints and data structures
4. Match the UI/UX specifications precisely
5. Implement all game mechanics (wrong attempts, hints, etc.)
6. Support all 18 themes
7. Integrate Razorpay and Google OAuth
8. Follow the exact navigation flow

**Good luck with the Android implementation!** 🚀

