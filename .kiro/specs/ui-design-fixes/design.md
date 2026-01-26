# Design Document: UI Design Fixes

## Overview

This design document outlines the approach to fix UI inconsistencies across all pages of the Telegram Mini App to match the original design exactly. The solution focuses on CSS styling corrections, proper use of Tailwind CSS classes, and ensuring visual consistency while maintaining all existing functionality.

The main issues identified are:
1. **Button styles not matching** - Incorrect sizes, padding, border radius, and font sizes
2. **Text sizes not matching** - Font sizes for headings, body text, and prices are inconsistent
3. **Order page styling** - Plan cards, device slider, and payment button need corrections
4. **Profile page modals** - May have styling inconsistencies
5. **Overall design system** - Need consistent application of spacing, colors, and typography

The approach will be to:
- **Fix button dimensions**: Correct height, padding, border-radius, and font-size for all button variants
- **Fix text sizes**: Ensure all text elements use correct font-size values matching the original
- **Standardize spacing**: Apply consistent padding and gap values across all components
- **Audit CSS classes**: Review all Tailwind classes and custom CSS against original design
- **Create unified design system**: Ensure consistent colors, spacing, and typography
- **Maintain functionality**: Keep all Telegram WebApp API integration and JavaScript behavior

## Architecture

### Component Structure

```
Mini App
├── lochi.html (Main Page)
│   ├── Logo and Rings Animation
│   ├── Bottom Panel
│   │   ├── Header (Title, Date, Status)
│   │   └── Buttons (Purchase, Setup, Profile, Support)
│   └── Background Layer
│
├── order.html (Subscription Purchase)
│   ├── Page Header
│   ├── Device Slider Block
│   ├── Plan Cards Grid (2x2)
│   └── Payment Button
│
├── profile.html (User Profile)
│   ├── Profile Header (Name, ID)
│   ├── Menu List
│   ├── Subscription Link Block
│   ├── Instructions Button
│   └── Modal Windows
│       ├── Payment Modal
│       ├── Transactions Modal
│       ├── Referral Modal
│       └── Policy Modal
│
└── setup.html (Setup Wizard)
    ├── Progress Circle with Rings
    ├── Status Icon
    ├── Text Content
    └── Action Buttons
```

### Styling Architecture

The app uses a hybrid approach:
- **Tailwind CSS** (via CDN) for utility classes
- **Custom CSS** (styles.css) for complex components and animations
- **Inline styles** for dynamic values and specific overrides

### Design System Layers

1. **CSS Variables Layer** (`:root`)
   - Primary colors
   - Background colors
   - Border colors and opacities
   - Border radius values

2. **Tailwind Configuration Layer**
   - Extended color palette
   - Custom spacing values
   - Custom border radius values

3. **Component Styles Layer**
   - Button variants
   - Card styles
   - Modal styles
   - Animation keyframes

## Components and Interfaces

### Specific Issues and Fixes

#### Issue 1: Order Page Plan Card Buttons
**Current Problem:**
- Plan cards have different heights (some have badge, some don't) - they should all be the same height
- Missing gradient background in each card
- Border radius needs to be soft/rounded
- Subtitle text "Подключайте больше устройств..." should be removed

**Fix:**
```css
.OrderPage__button {
    padding: 20px;                    /* All sides */
    border-radius: 16px;              /* Soft rounded corners */
    height: 160px;                    /* Fixed height for all cards */
    min-height: 160px;
    background: linear-gradient(135deg, rgba(0, 214, 143, 0.1) 0%, rgba(0, 20, 15, 0.8) 100%);
    border: 1px solid rgba(0, 214, 143, 0.3);
    position: relative;
}

.OrderPage__button--selected {
    border-color: rgba(0, 214, 143, 0.9);  /* Brighter border */
    background: linear-gradient(135deg, rgba(0, 214, 143, 0.15) 0%, rgba(0, 20, 15, 0.9) 100%);
}

/* Text inside plan cards */
.OrderPage__button .text-sm {
    font-size: 14px;                  /* Period text */
    color: #ffffff;
}

.OrderPage__button .text-2xl {
    font-size: 24px;                  /* Price */
    font-weight: 600;
    margin-top: auto;                 /* Push to bottom */
}

.OrderPage__button .plan-monthly {
    font-size: 14px;                  /* Monthly breakdown */
    color: #9ca3af;                   /* Gray */
}

/* Badge positioning */
.OrderPage__buttonChip {
    position: absolute;
    top: 12px;
    right: 12px;
    padding: 4px 12px;
    border-radius: 8px;
    font-size: 13px;
    background: rgba(0, 214, 143, 0.2);
    color: rgba(255, 255, 255, 0.9);
}
```

**HTML Changes:**
- Remove subtitle: `<p class="OrderPage__subtitle">Подключайте больше устройств...</p>`
- Ensure all plan cards have same structure and height

#### Issue 2: Payment Button Size
**Current Problem:**
- Using `h-54` (54px height) which is correct
- Font size `text-[16px]` is correct
- Need to verify border-radius is exactly 14px

**Fix:**
```css
.OrderPage__buyButton {
    height: 54px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 14px;              /* Must be 14px, not 24px */
    padding: 0 24px;
}
```

#### Issue 3: Main Page Buttons
**Current Problem:**
- Button heights should all be 54px
- Font size should be 14px
- Border radius should be 14px

**Fix:**
```css
.Button {
    height: 54px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 14px;
    padding: 0 16px;
}
```

#### Issue 4: Setup Page Buttons
**Current Problem:**
- Using `border-radius: 24px` in inline styles
- Should be 14px for consistency

**Fix:**
```css
.Button-Original {
    height: 54px;
    border-radius: 14px;              /* Not 24px */
    font-size: 14px;
    font-weight: 500;
}
```

#### Issue 5: Profile Page Menu Items
**Current Problem:**
- Height should be exactly 48px
- Font size should be 14px
- Icon size should be 16px

**Fix:**
```css
.menu-item {
    height: 48px;
    padding: 12px 16px;
    font-size: 14px;
}

.menu-icon svg {
    width: 16px;
    height: 16px;
}
```

### 1. Color System

```css
:root {
    --primary: #00D68F;              /* Main brand color */
    --primary-dark: #00A36C;         /* Darker variant for main button */
    --primary-light: rgba(0, 214, 143, 0.2);  /* 20% opacity */
    --primary-50: rgba(0, 214, 143, 0.5);     /* 50% opacity */
    --primary-90: rgba(0, 214, 143, 0.9);     /* 90% opacity */
    
    --background: #010101;           /* Main background */
    --dark-40: rgba(255, 255, 255, 0.05);     /* Panel background */
    --dark-70: #1a1a1a;              /* Dark elements */
    
    --text-default: #9ca3af;         /* Secondary text */
    --text-default-light: #b0b7bf;   /* Lighter secondary text */
    --text-white: #ffffff;           /* Primary text */
    
    --border-dim: rgba(0, 214, 143, 0.5);     /* Medium border */
    --border-light: rgba(0, 214, 143, 0.3);   /* Light border */
    --divider: rgba(255, 255, 255, 0.08);     /* Divider lines */
}
```

### 2. Typography System

**CRITICAL: Text Size Specifications**

All text must follow these exact font-size specifications:

```css
/* Page Titles */
.text-xl {
    font-size: 20px;           /* Main page titles */
    font-weight: 600;
    color: #ffffff;
    line-height: 1.2;
}

.text-lg {
    font-size: 18px;           /* Section titles */
    font-weight: 600;
    line-height: 1.2;
    color: #ffffff;
}

/* Body Text */
.text-base {
    font-size: 16px;           /* Large body text */
    font-weight: 400;
}

.text-sm {
    font-size: 14px;           /* Standard body text */
    font-weight: 400;
}

.text-xs {
    font-size: 13px;           /* Small text (badges) */
    font-weight: 400;
}

/* Default/Secondary Text */
.text-default {
    font-size: 14px;
    color: #9ca3af;
    font-weight: 400;
}

.text-default-light {
    font-size: 14px;
    color: #b0b7bf;
    font-weight: 400;
}

/* Prices and Numbers */
.text-2xl {
    font-size: 24px;           /* Main prices */
    font-weight: 600;
    line-height: 1.2;
}

.text-3xl {
    font-size: 32px;           /* Large numbers (device count) */
    font-weight: 400;
    line-height: 1;
}

/* Brand Text */
.header-brand-text {
    font-size: 16px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #ffffff;
}

/* Modal Text */
.modal-title {
    font-size: 20px;
    font-weight: 600;
    color: #ffffff;
}

.modal-body {
    font-size: 15px;
    color: #9ca3af;
    line-height: 1.6;
}

.modal-section-title {
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
}
```

**Font Weight Standards:**
- 300: Light (used sparingly for subtle text)
- 400: Normal (body text, descriptions)
- 500: Medium (buttons, emphasis)
- 600: Semi-bold (headings, prices)
- 700: Bold (primary buttons)
- 800: Extra-bold (brand text)

### 3. Button Components

**CRITICAL: Button Size Specifications**

All buttons must follow these exact specifications:

#### Standard Button Dimensions
```css
.Button {
    height: 54px;              /* Fixed height */
    border-radius: 14px;       /* Medium radius */
    font-size: 14px;           /* Standard button text */
    font-weight: 500;          /* Medium weight */
    padding: 0 16px;           /* Horizontal padding */
}
```

#### Order Page Plan Card Buttons
```css
.OrderPage__button {
    height: auto;              /* Variable height for content */
    min-height: 140px;         /* Minimum height */
    padding: 20px;             /* All sides padding */
    border-radius: 14px;       /* Medium radius */
}

.OrderPage__button .text-sm {
    font-size: 14px;           /* Period text */
}

.OrderPage__button .text-2xl {
    font-size: 24px;           /* Price text */
    font-weight: 600;          /* Semi-bold */
    margin-top: 32px;          /* Space above price */
}

.OrderPage__button .plan-monthly {
    font-size: 14px;           /* Monthly price */
    color: #9ca3af;            /* Gray text */
}
```

#### Payment Button
```css
.OrderPage__buyButton {
    height: 54px;              /* Standard button height */
    font-size: 16px;           /* Slightly larger text */
    font-weight: 600;          /* Semi-bold */
    border-radius: 14px;       /* Medium radius */
}
```

#### Primary Button (Purchase)
```css
.Button.bg-primary {
    background-color: #00A36C;  /* Darker green */
    color: #ffffff;
    font-weight: 700;
    height: 54px;
    border-radius: 14px;
    border: none;
    transition: transform 0.1s;
}

.Button.bg-primary:active {
    transform: scale(0.98);
}
```

#### Lighted Button (with gradient)
```css
.Button--lighted {
    background: transparent;
    border: 1px solid rgba(0, 214, 143, 0.5);
    position: relative;
}

.Button--lighted::before {
    content: "";
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: -1;
    background-image: url("data:image/svg+xml...");  /* Gradient SVG */
    background-position: center -60px;
    opacity: 0.6;
}
```

#### Pulsing Button Animation
```css
.Button--variant_pulsed {
    animation: shadowPulse 2s infinite;
}

@keyframes shadowPulse {
    0% { box-shadow: 0 0 0 0 rgba(0, 214, 143, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(0, 214, 143, 0); }
    100% { box-shadow: 0 0 0 0 rgba(0, 214, 143, 0); }
}
```

### 4. Order Page Components

#### Device Slider
```html
<div class="OrderPage__devicesBlock">
    <!-- Device count display -->
    <div class="device-count-display">
        <div class="count-badge">{count}</div>
        <div class="count-label">
            <span class="count-title">Устройство</span>
            <span class="count-subtitle">Одновременно в подписке</span>
        </div>
    </div>
    
    <!-- Slider track -->
    <div class="slider-track">
        <div class="slider-fill"></div>
        <div class="slider-dots"><!-- 5 dots --></div>
        <div class="slider-thumb"></div>
    </div>
</div>
```

Styling:
```css
.OrderPage__devicesBlock {
    border: 1px solid rgba(0, 214, 143, 0.3);
    background: rgba(0, 20, 15, 0.3);
    padding: 16px;
    border-radius: 16px;
    gap: 8px;
}

.count-badge {
    background: rgba(255, 255, 255, 0.05);
    color: #96ffdc;
    width: 52px;
    height: 52px;
    border-radius: 12px;
    font-size: 32px;
}
```

#### Plan Cards
```html
<button class="OrderPage__button">
    <p class="plan-period">6 месяцев</p>
    <div class="plan-badge">Популярный</div>
    <p class="plan-price">949 ₽</p>
    <p class="plan-monthly">158₽ в месяц</p>
</button>
```

Styling:
```css
.OrderPage__button {
    background: rgba(0, 20, 15, 0.8);
    border: 1px solid rgba(0, 214, 143, 0.3);
    border-radius: 14px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
}

.OrderPage__button--selected {
    border-color: rgba(0, 214, 143, 0.9);
}

.plan-badge {
    background: rgba(0, 214, 143, 0.2);
    color: rgba(255, 255, 255, 0.9);
    padding: 4px 12px;
    border-radius: 8px;
    font-size: 13px;
    margin-top: 8px;
}
```

### 5. Profile Page Components

#### Modal Window
```html
<div class="modal-overlay">
    <div class="modal-content">
        <div class="modal-header">
            <h2 class="modal-title">Title</h2>
            <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
            <!-- Content -->
        </div>
    </div>
</div>
```

Styling:
```css
.modal-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: flex-end;
    animation: fadeIn 0.3s ease;
}

.modal-content {
    width: 100%;
    max-width: 500px;
    background: #1a1a1a;
    border-radius: 20px 20px 0 0;
    padding: 24px;
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
}
```

#### Menu Items
```css
.menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    height: 48px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.menu-icon {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.menu-icon.success {
    background: rgba(0, 214, 143, 0.1);
    color: #00D68F;
}
```

### 6. Setup Page Components

#### Progress Circle
```html
<div class="SetupPage__progress">
    <svg viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="15.8" class="progress-bg"></circle>
        <circle cx="16" cy="16" r="15.8" class="progress-fill"></circle>
    </svg>
</div>
```

Styling:
```css
.progress-fill {
    fill: none;
    stroke: rgba(0, 214, 143, 0.5);
    stroke-width: 0.2;
    stroke-linecap: round;
    stroke-dasharray: 99.274 99.274;
    stroke-dashoffset: 99.274;
    transition: stroke-dashoffset 0.7s ease-in-out;
    transform: rotate(-90deg);
}
```

JavaScript for progress update:
```javascript
function updateProgress(percent) {
    const circumference = 99.274;
    const offset = circumference * (1 - percent / 100);
    progressCircle.style.strokeDashoffset = offset;
}
```

## Data Models

### App Data Structure
```javascript
{
    title: string,           // App title
    userId: string,          // User ID
    status: string,          // 'active' | 'expired' | 'not_found'
    date: string,            // Expiration date
    vpn_key: string,         // VPN subscription key
    links: {
        ios: string,         // iOS app link
        android: string,     // Android app link
        windows: string,     // Windows app link
        macos: string,       // macOS app link
        manual: string,      // Manual setup link
        support: string      // Support link
    }
}
```

### UI State Models

#### Order Page State
```javascript
{
    devices: number,         // 1-5
    selectedPlan: number,    // 0-3 (index)
    plans: [
        {
            period: string,
            price: number,
            old: number | null
        }
    ]
}
```

#### Setup Page State
```javascript
{
    currentStep: number,     // 0-3
    progress: number,        // 0, 33, 66, 100
    deviceName: string,      // 'iOS', 'Android', 'Windows', 'macOS'
    installLink: string
}
```

## Data Models

### CSS Class Naming Conventions

The app uses BEM-like naming for custom components:
- Block: `.OrderPage`, `.HomePage`, `.SetupPage`
- Element: `.OrderPage__button`, `.HomePage__bottom`
- Modifier: `.OrderPage__button--selected`, `.Button--lighted`

### Responsive Breakpoints

```css
/* Small phones */
@media screen and (max-width: 375px) {
    .HomePage__bottom { padding: 4px; }
}

/* All pages constrained to max-width */
.App {
    max-width: 500px;
    margin: 0 auto;
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified the following testable properties. Many visual styling criteria cannot be automatically tested without visual regression tools, so the focus is on behavioral properties, CSS property verification, and API integration.

**Redundancy Analysis:**
- Properties 5.1-5.5 (typography) can be combined into fewer comprehensive properties
- Properties 6.1, 6.3, 6.4, 6.5 (color system) can be consolidated
- Properties 7.1, 7.2, 7.3, 7.5 (spacing) can be combined
- Properties 10.1, 10.2, 10.3 (Telegram API initialization) can be combined into one property

### Core Properties

**Property 1: Plan Selection State Management**
*For any* subscription plan card, when it is selected, the card should have the `OrderPage__button--selected` class applied and the border color should change to `rgba(0, 214, 143, 0.9)`, and all other plan cards should not have the selected class.
**Validates: Requirements 1.3**

**Property 2: Status Color Mapping**
*For any* subscription status value (active, expired, not_found), the status text element should display the correct color: green (#00D68F) for active, yellow (#facc15) for expired, and gray (#9ca3af) for not_found.
**Validates: Requirements 3.4**

**Property 3: Typography Consistency**
*For all* text elements in the application, they should use the Onest font family (either directly or through inheritance).
**Validates: Requirements 5.1**

**Property 4: Heading Typography Standards**
*For all* heading elements (h1, h2, .text-xl, .text-lg), the font-weight should be between 600-800 and font-size should be between 18px-20px.
**Validates: Requirements 5.2**

**Property 5: Body Text Typography Standards**
*For all* body text elements (.text-sm, .text-default, paragraph text), the font-weight should be between 400-500 and font-size should be between 14px-15px.
**Validates: Requirements 5.3**

**Property 6: Secondary Text Color Consistency**
*For all* elements with secondary text styling (.text-default, .text-default-light), the color should be either #9ca3af or #b0b7bf.
**Validates: Requirements 5.4**

**Property 7: Price Typography Standards**
*For all* price display elements (.text-2xl, .plan-price), the font-size should be 24px and font-weight should be between 500-600.
**Validates: Requirements 5.5**

**Property 8: Primary Color Consistency**
*For all* elements marked with primary color classes (.bg-primary, .text-primary, .border-primary), they should use color values derived from #00D68F (including rgba variants).
**Validates: Requirements 6.1, 6.3, 6.4, 6.5**

**Property 9: Spacing System Consistency**
*For all* page containers, the padding should be 16px, and for all panel elements (.HomePage__bottom, .modal-content), the padding should be between 20px-25px.
**Validates: Requirements 7.1**

**Property 10: Button Group Spacing**
*For all* button group containers (.HomePageBottom__row, .Buttons-Row), the gap property should be either 10px (for rows) or 12px (for columns).
**Validates: Requirements 7.2**

**Property 11: Border Radius Consistency**
*For all* card elements, those with medium radius classes should have border-radius of 14px, and those with large radius classes should have border-radius of 24px.
**Validates: Requirements 7.3**

**Property 12: Modal Padding Consistency**
*For all* modal content elements (.modal-content), the padding should be 24px.
**Validates: Requirements 7.5**

**Property 13: Button Press Transform**
*For all* button elements, when the :active pseudo-class is triggered, the transform property should be set to scale(0.97).
**Validates: Requirements 8.1**

**Property 14: Copy Action Feedback**
*For all* copy button interactions, when the copy action is triggered, the check icon should appear and then disappear after 2000ms (2 seconds).
**Validates: Requirements 8.3**

**Property 15: Modal Animation**
*For all* modal windows, when opened, they should have the slideUp animation applied with duration 0.3s and easing function ease.
**Validates: Requirements 8.4**

**Property 16: Pulsing Button Animation**
*For all* buttons with the pulsing class (.Button--variant_pulsed, .Button--pulsed), they should have the shadowPulse animation applied with duration 2s and iteration-count infinite.
**Validates: Requirements 8.5**

**Property 17: Viewport Fit**
*For any* viewport size, the document body width should equal the viewport width and there should be no horizontal overflow (overflow-x should be hidden or not present).
**Validates: Requirements 9.1**

**Property 18: Text Selection Prevention**
*For all* elements in the application, the user-select CSS property should be set to none (or inherited as none) to prevent text selection.
**Validates: Requirements 9.3**

**Property 19: Telegram WebApp Initialization**
*For any* page load, the Telegram WebApp API should be initialized by calling tg.expand(), tg.setHeaderColor('#010101'), and tg.setBackgroundColor('#010101').
**Validates: Requirements 10.1, 10.2, 10.3**

**Property 20: Back Button Display**
*For all* pages except the main page (lochi.html), the Telegram back button should be shown by calling tg.BackButton.show().
**Validates: Requirements 10.4**

**Property 21: Haptic Feedback on Interactions**
*For all* interactive elements (buttons, clickable items), when clicked or tapped, they should trigger Telegram haptic feedback by calling tg.HapticFeedback methods.
**Validates: Requirements 10.5**

### Example-Based Tests

These are specific test cases for particular scenarios:

**Example 1: Main Purchase Button Color**
The main purchase button (#main-btn) should have background-color #00A36C (darker green variant).
**Validates: Requirements 6.2**

**Example 2: Order Page Grid Layout**
The order page plan cards grid (.OrderPage__buttons) should have display: grid, grid-template-columns: repeat(2, 1fr), and gap: 12px.
**Validates: Requirements 7.4**

**Example 3: Small Screen Padding Adjustment**
When viewport width is ≤375px, the .HomePage__bottom element should have padding of 4px.
**Validates: Requirements 9.2**

## Error Handling

### CSS Loading Failures

If external CSS (Tailwind CDN) fails to load:
- Fallback to inline styles for critical components
- Ensure custom styles.css provides baseline styling
- Display warning in console but don't break functionality

### Font Loading Failures

If Onest font fails to load from Google Fonts:
- Browser will fallback to system sans-serif fonts
- Layout should remain functional with fallback fonts
- No error handling needed as this is graceful degradation

### Telegram WebApp API Unavailable

If Telegram WebApp API is not available (testing outside Telegram):
- Provide mock tg object with no-op methods
- Log warnings to console
- Allow app to function in degraded mode for development

```javascript
if (typeof window.Telegram === 'undefined') {
    window.Telegram = {
        WebApp: {
            expand: () => console.warn('Telegram WebApp not available'),
            setHeaderColor: () => {},
            setBackgroundColor: () => {},
            BackButton: { show: () => {}, onClick: () => {} },
            HapticFeedback: {
                impactOccurred: () => {},
                notificationOccurred: () => {}
            }
        }
    };
}
```

### Modal State Management

If multiple modals are opened simultaneously:
- Only the topmost modal should be visible
- Clicking overlay should close only the topmost modal
- Body scroll should be locked when any modal is open

### Slider Interaction Edge Cases

If slider is dragged beyond bounds:
- Clamp device count to valid range (1-5)
- Prevent negative values or values > 5
- Ensure thumb position stays within track bounds

```javascript
function updateSlider(value) {
    devices = Math.max(1, Math.min(5, value));  // Clamp to 1-5
    const percent = (devices - 1) * 25;
    // Update UI...
}
```

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests:

**Unit Tests** - Focus on:
- Specific examples (main button color, grid layout)
- Edge cases (small screen padding, slider bounds)
- Integration points (Telegram API initialization)
- Modal state management
- Event handlers

**Property Tests** - Focus on:
- Typography consistency across all text elements
- Color system consistency across all components
- Spacing consistency across all containers
- Animation properties across all interactive elements
- CSS property verification across element collections

### Property-Based Testing Configuration

**Library Selection:**
- For JavaScript/Browser testing: Use **fast-check** library
- For DOM testing: Use **jsdom** or **@testing-library/dom**

**Test Configuration:**
- Minimum 100 iterations per property test
- Each test must reference its design document property
- Tag format: `Feature: ui-design-fixes, Property {number}: {property_text}`

**Example Property Test Structure:**

```javascript
import fc from 'fast-check';
import { screen, within } from '@testing-library/dom';

describe('Feature: ui-design-fixes, Property 3: Typography Consistency', () => {
    it('should use Onest font family for all text elements', () => {
        fc.assert(
            fc.property(
                fc.constantFrom('lochi.html', 'order.html', 'profile.html', 'setup.html'),
                (pageName) => {
                    // Load page
                    const page = loadPage(pageName);
                    
                    // Get all text elements
                    const textElements = page.querySelectorAll('*');
                    
                    // Verify each has Onest font
                    textElements.forEach(el => {
                        const computedStyle = window.getComputedStyle(el);
                        const fontFamily = computedStyle.fontFamily;
                        expect(fontFamily).toContain('Onest');
                    });
                }
            ),
            { numRuns: 100 }
        );
    });
});
```

### Unit Test Examples

```javascript
describe('Main Purchase Button Color', () => {
    it('should have background color #00A36C', () => {
        const button = document.getElementById('main-btn');
        const computedStyle = window.getComputedStyle(button);
        expect(computedStyle.backgroundColor).toBe('rgb(0, 163, 108)'); // #00A36C
    });
});

describe('Order Page Grid Layout', () => {
    it('should have 2 columns with 12px gap', () => {
        const grid = document.querySelector('.OrderPage__buttons');
        const computedStyle = window.getComputedStyle(grid);
        expect(computedStyle.display).toBe('grid');
        expect(computedStyle.gridTemplateColumns).toBe('repeat(2, 1fr)');
        expect(computedStyle.gap).toBe('12px');
    });
});
```

### Visual Regression Testing (Optional)

While not covered by automated property tests, visual regression testing is recommended:
- Use tools like Percy, Chromatic, or BackstopJS
- Capture screenshots of all pages in different states
- Compare against baseline images from original design
- Run on multiple viewport sizes (320px, 375px, 414px, 500px)

### Manual QA Checklist

Since many visual aspects cannot be automatically tested:
1. Compare each page side-by-side with original design
2. Verify colors match exactly using color picker
3. Verify spacing using browser dev tools
4. Test all interactive states (hover, active, focus)
5. Test on real Telegram app (iOS and Android)
6. Verify animations are smooth and match timing
7. Test modal interactions and transitions
8. Verify responsive behavior on different screen sizes

### Test Coverage Goals

- **Automated Property Tests**: Cover all behavioral and CSS property requirements
- **Unit Tests**: Cover specific examples and edge cases
- **Integration Tests**: Cover Telegram API integration
- **Manual QA**: Cover visual design matching and user experience
- **Target**: 80%+ code coverage for JavaScript, 100% coverage of critical user paths
