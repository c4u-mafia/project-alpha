---
name: homelyn-mobile-stack
description: Homelyn mobile app tech stack, brand colors, design system, and routing structure
metadata:
  type: project
---

## Tech Stack
- Expo Router v6 (`expo-router ~6.0.23`)
- NativeWind + Tailwind CSS (for styling)
- Gluestack UI v3 (component library)
- React Native Reanimated v4 (animations)
- Zustand (state management)
- React Query v5 (data fetching)
- Better Auth (`@better-auth/expo`) — auth client connects to `http://localhost:3001`
- `@expo/vector-icons` (Ionicons) available without install

## Brand Colors (from gluestack config)
- Primary Teal: `primary-500` = `#0F766E` (brand teal `#0E7C7B`)
- Sunbloom Accent: `#F2A65A`
- Charcoal text: `#1A2332`
- Cream background: `#FAF7F2`
- Mint: `#D4EDE6`
- Health Green: `#1E9E5C`
- Health Amber: `#E89B2C`
- Health Orange: `#E2683C`
- Health Red: `#D54545`

## Typography
- Body font: Geist (loaded via expo-google-fonts)
- Tailwind classes: `font-geist`, `font-geist-medium`, `font-geist-bold`

## Routing Structure
- `/` → splash
- `/onboarding` → 3-slide welcome carousel
- `/role-select` → role card selection
- `/sign-up` → signup form
- `/verify-otp` → OTP verification
- `/login` → login
- `/onboarding/tenant/*` → tenant onboarding steps
- `/onboarding/landlord/*` → landlord onboarding steps
- `/onboarding/complete` → completion
- `/(tenant)/` → home feed (tab group)
- `/(tenant)/search`, `/(tenant)/rent`, `/(tenant)/me` — tenant tabs
- `/(landlord)/` → dashboard (tab group)
- `/(landlord)/properties`, `/(landlord)/tenants`, `/(landlord)/me` — landlord tabs

## Design System
- Spacing: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
- Border radius: buttons 12px, cards 16px, modals 24px, pills 999px
- Fonts: Inter body / Space Grotesk headings (using Geist as available)
- Icons: `@expo/vector-icons` Ionicons
- Tagline: "Rent direct. Live easy."

**Why:** User wants complete UI implementation matching design docs in docs/ folder.
**How to apply:** Follow design specs exactly. Rent Health Bar is the signature feature. All money in kobo (divide by 100 for display).
