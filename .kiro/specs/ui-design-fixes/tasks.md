# Implementation Plan: UI Design Fixes

## Overview

This implementation plan focuses on fixing UI inconsistencies in the Telegram Mini App, specifically on the order.html page. The main changes involve making subscription plan cards uniform in height, adding gradient backgrounds, softening corners, and removing unnecessary subtitle text.

## Tasks

- [x] 1. Fix Order Page Subscription Plan Cards
  - [x] 1.1 Update plan card styling for uniform appearance
    - Modify `.OrderPage__button` CSS to set fixed height of 160px
    - Add gradient background: `linear-gradient(135deg, rgba(0, 214, 143, 0.1) 0%, rgba(0, 20, 15, 0.8) 100%)`
    - Update border-radius to 16px for soft corners
    - Ensure all cards use flexbox with `flex-direction: column` for consistent layout
    - _Requirements: 1.2, 1.3, 7.3_
  
  - [x] 1.2 Update selected plan card styling
    - Modify `.OrderPage__button--selected` to use brighter gradient
    - Update border color to `rgba(0, 214, 143, 0.9)`
    - Ensure smooth transition between states
    - _Requirements: 1.3_
  
  - [x] 1.3 Fix plan card content layout
    - Update HTML structure to ensure consistent spacing
    - Use `margin-top: auto` on price element to push it to bottom
    - Ensure badge positioning is absolute (top-right corner)
    - Remove `mt-8` class from price elements
    - _Requirements: 1.2, 7.2_
  
  - [x] 1.4 Remove subtitle text from order page
    - Delete the `<p class="OrderPage__subtitle">` element containing "Подключайте больше устройств..."
    - Adjust spacing after title to compensate for removed element
    - _Requirements: 1.2_

- [x] 2. Update Order Page Tailwind Configuration
  - [x] 2.1 Verify Tailwind color configuration
    - Ensure `primary-dark-900` color is defined correctly
    - Verify `primary` opacity variants (20%, 30%, 50%, 90%) are available
    - _Requirements: 6.1, 6.3, 6.4_
  
  - [x] 2.2 Add custom gradient utilities if needed
    - Create custom Tailwind gradient class for plan cards if not using inline styles
    - Document gradient values in Tailwind config
    - _Requirements: 1.2_

- [x] 3. Test Plan Card Interactions
  - [x] 3.1 Test plan selection functionality
    - Verify clicking any plan card applies selected state correctly
    - Verify only one card can be selected at a time
    - Verify selected state persists until another card is clicked
    - _Requirements: 1.3_
  
  - [x] 3.2 Test visual consistency across all cards
    - Verify all 4 plan cards have identical height (160px)
    - Verify gradient appears correctly in all cards
    - Verify border-radius is consistent (16px)
    - Verify badge appears only on "Popular" plan
    - _Requirements: 1.2, 1.3, 7.3_
  
  - [x] 3.3 Test responsive behavior
    - Verify 2-column grid layout maintains on mobile devices
    - Verify cards don't overflow viewport
    - Verify touch interactions work correctly
    - _Requirements: 9.1, 9.3_

- [x] 4. Update Device Slider Block Styling
  - [x] 4.1 Verify device slider block styling
    - Ensure border and background colors match design
    - Verify border-radius is 16px (matching plan cards)
    - Verify padding is consistent (16px)
    - _Requirements: 1.1, 7.1_

- [x] 5. Verify Payment Button Styling
  - [x] 5.1 Check payment button dimensions
    - Verify height is 54px
    - Verify border-radius is 14px
    - Verify font-size is 16px
    - Verify padding is appropriate
    - _Requirements: 1.5, 7.1_

- [~] 6. Cross-browser and Cross-device Testing
  - [-] 6.1 Test in Telegram WebApp on iOS
    - Verify all styling renders correctly
    - Verify gradients display properly
    - Verify interactions work smoothly
    - _Requirements: 9.1, 10.1_
  
  - [~] 6.2 Test in Telegram WebApp on Android
    - Verify all styling renders correctly
    - Verify gradients display properly
    - Verify interactions work smoothly
    - _Requirements: 9.1, 10.1_
  
  - [~] 6.3 Test in Telegram Desktop
    - Verify all styling renders correctly
    - Verify gradients display properly
    - Verify interactions work smoothly
    - _Requirements: 9.1, 10.1_

- [x] 7. Final Visual Comparison
  - [x] 7.1 Compare with original design
    - Open original design (ultm.in/order) and current implementation side-by-side
    - Verify plan cards match exactly (height, gradient, corners)
    - Verify subtitle is removed
    - Verify all spacing and colors match
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Focus is primarily on order.html page
- All changes should maintain existing JavaScript functionality
- Telegram WebApp API integration must remain intact
- No changes needed to lochi.html, profile.html, or setup.html at this time
- Gradient values can be adjusted if user provides feedback after initial implementation
- Border-radius values (16px for cards, 14px for buttons) should be consistent across the app
