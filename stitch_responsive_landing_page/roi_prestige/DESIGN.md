---
name: ROI Prestige
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363940'
  surface-container-lowest: '#0b0e14'
  surface-container-low: '#191c22'
  surface-container: '#1d2026'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e1e2eb'
  on-surface-variant: '#b9cbbd'
  inverse-surface: '#e1e2eb'
  inverse-on-surface: '#2e3037'
  outline: '#849588'
  outline-variant: '#3b4a40'
  surface-tint: '#00e293'
  primary: '#cdffde'
  on-primary: '#003921'
  primary-container: '#00f5a0'
  on-primary-container: '#006b43'
  inverse-primary: '#006c44'
  secondary: '#a5e7ff'
  on-secondary: '#003543'
  secondary-container: '#00d2ff'
  on-secondary-container: '#00566a'
  tertiary: '#f6f1ff'
  on-tertiary: '#2900a0'
  tertiary-container: '#d8d2ff'
  on-tertiary-container: '#5745d1'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#50ffaf'
  primary-fixed-dim: '#00e293'
  on-primary-fixed: '#002111'
  on-primary-fixed-variant: '#005232'
  secondary-fixed: '#b6ebff'
  secondary-fixed-dim: '#47d6ff'
  on-secondary-fixed: '#001f28'
  on-secondary-fixed-variant: '#004e60'
  tertiary-fixed: '#e4dfff'
  tertiary-fixed-dim: '#c6bfff'
  on-tertiary-fixed: '#160066'
  on-tertiary-fixed-variant: '#4029ba'
  background: '#10131a'
  on-background: '#e1e2eb'
  surface-variant: '#32353c'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.5'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 48px
---

## Brand & Style

The brand personality is defined as **Smart, Secure, and Profitable**. This design system targets high-net-worth individuals and serious retail investors who demand a sophisticated, high-fidelity experience that reflects the value of their capital.

The visual style is a fusion of **Modern Corporate** and **Glassmorphism**. It utilizes a "Deep Stack" approach where layers are defined by varying levels of transparency, background blurs, and subtle inner glows. This creates a sense of physical depth and technological precision. High-quality 3D assets represent tangible wealth and digital security, bridging the gap between traditional finance and the future of digital assets. The overall mood is one of quiet confidence, institutional strength, and cutting-edge performance.

## Colors

The palette is anchored in a monochromatic base of "Midnight Navy" and "Obsidian Black" to ensure maximum contrast for the vibrant neon accents.

- **Primary & Secondary:** Emerald Green and Electric Blue serve as the primary action colors, often blended into gradients to signify growth and liquidity.
- **Tertiary:** A deep Royal Purple is used sparingly for decorative elements and "Pro" tier features.
- **Semantic Colors:** Emerald Green always represents profit, growth, and "Success" states. Electric Blue represents security and "Info" states. A refined Gold is reserved for "VIP" or "Premium" investment tiers.
- **Gradients:** Use linear gradients (135°) transitioning from Electric Blue to Emerald Green for primary call-to-actions to symbolize the flow from security to profit.

## Typography

This design system utilizes **Inter** for its exceptional legibility on high-density screens and its neutral, professional character. 

- **Weight Strategy:** Use Bold (700) and Semi-Bold (600) for headers to establish a strong hierarchy against the dark background. 
- **Numerical Data:** For financial figures and balances, use a slightly tighter letter-spacing to give them a "ticker" feel.
- **Hierarchy:** Secondary text should utilize a reduced opacity (60-70%) rather than a different color to maintain the monochromatic depth of the interface.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a focus on verticality and "card-stacking." 

- **Grid:** A 12-column grid for desktop and a 4-column grid for mobile. 
- **Rhythm:** An 8px base unit drives all spacing. Elements are grouped using 24px (md) gaps, while major sections are separated by 40px (lg) to 64px (xl) to provide visual breathing room.
- **Padding:** Containers and cards should utilize generous internal padding (min 24px) to reinforce the premium, "un-crowded" feel.

## Elevation & Depth

Depth is the primary communicator of hierarchy. The system uses three distinct tiers:

1.  **Canvas (Base):** The deepest layer, a dark #05070A.
2.  **Glass Layers (Level 1):** Semi-transparent surfaces (`rgba(16, 20, 28, 0.6)`) with a 20px `backdrop-filter: blur()`. These surfaces feature a 1px white border at 10% opacity to catch light.
3.  **Floating Elements (Level 2):** Critical status cards or modals. These use a slightly higher opacity and a soft, diffused glow (shadow) tinted with the primary emerald or blue color (`0px 20px 40px rgba(0, 245, 160, 0.15)`).

3D icons should appear to sit "on top" of these glass layers, utilizing realistic drop shadows to anchor them to the surface.

## Shapes

The shape language is **Rounded**, conveying a modern, approachable yet professional feel. 

- **Cards & Modals:** Use a standard 1rem (16px) radius to soften the high-tech aesthetic.
- **Buttons:** Use a 0.5rem (8px) radius for a more structural, "clickable" look.
- **Small Elements:** Chips and tags should be fully pill-shaped (rounded-full) to contrast against the larger structural cards.
- **Borders:** All borders on containers should be 1px and semi-transparent to mimic the edge of a glass pane.

## Components

- **Buttons:** Primary buttons use a vibrant Emerald-to-Blue gradient with white text. Secondary buttons are "ghost" style with a glass background and a 1px border.
- **Cards:** The core of the UI. Cards must feature a subtle inner glow on the top edge and a backdrop blur. They should never be 100% opaque.
- **Input Fields:** Dark backgrounds with a 1px border that glows (primary color) when focused. Labels sit above the field in `label-sm` style.
- **Chips/Badges:** Used for percentage changes (e.g., +12.5%). Positive values are Emerald with a 10% opacity Emerald background; negative values use a soft Coral Red.
- **Progress Bars & Charts:** These should be rendered as "Neon Tubes"—thin, high-intensity lines with a soft outer glow.
- **3D Icons:** Used as focal points for main categories (Wallet, Growth, Security). They should be high-fidelity, featuring metallic or glass textures that react to the UI's primary light source (top-left).