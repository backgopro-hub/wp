# Requirements Document

## Introduction

This specification addresses UI design inconsistencies in the Telegram Mini App across multiple pages (lochi.html, setup.html, profile.html, order.html). The user has reported that the current implementation looks "absolutely not similar" to the original design. The goal is to make all pages look exactly like the original design (1в1 - one to one) while maintaining all existing functionality and Telegram WebApp API integration.

## Glossary

- **Mini_App**: The Telegram Mini App web application
- **UI_Component**: A visual element on the page (button, card, modal, etc.)
- **Design_System**: The collection of styling rules, colors, spacing, and typography
- **Tailwind_CSS**: The CSS framework used for styling
- **WebApp_API**: Telegram's JavaScript API for Mini Apps
- **Modal_Window**: A popup overlay window for displaying additional content
- **Device_Slider**: The interactive slider component for selecting number of devices
- **Plan_Card**: A subscription plan selection card with pricing information

## Requirements

### Requirement 1: Order Page UI Consistency

**User Story:** As a user, I want the order page to match the original design exactly, so that the visual experience is consistent and professional.

#### Acceptance Criteria

1. WHEN viewing the order page, THE Mini_App SHALL display the device slider with correct styling matching the original design
2. WHEN viewing subscription plan cards, THE Mini_App SHALL display them with correct colors, borders, spacing, and typography matching the original design
3. WHEN a plan card is selected, THE Mini_App SHALL apply the correct selected state styling with proper border color and opacity
4. WHEN viewing the "Popular" badge, THE Mini_App SHALL display it with correct background color, text color, and positioning
5. WHEN viewing the payment button, THE Mini_App SHALL display it with correct background, border, text styling, and old price strikethrough

### Requirement 2: Profile Page Modal Windows

**User Story:** As a user, I want the modal windows in the profile page to match the original design exactly, so that the interface feels polished and consistent.

#### Acceptance Criteria

1. WHEN opening a modal window, THE Mini_App SHALL display it with correct background color, border radius, and backdrop blur
2. WHEN viewing modal content, THE Mini_App SHALL display text with correct font sizes, colors, and line heights
3. WHEN viewing the modal header, THE Mini_App SHALL display the title and close button with correct styling
4. WHEN viewing empty states in modals, THE Mini_App SHALL display them with correct icon size, color, and text styling
5. WHEN viewing the referral program modal, THE Mini_App SHALL display the info box, link snippet, and copy button with correct styling

### Requirement 3: Main Page (lochi.html) UI Consistency

**User Story:** As a user, I want the main page to match the original design exactly, so that the app looks professional from the first screen.

#### Acceptance Criteria

1. WHEN viewing the main page, THE Mini_App SHALL display the logo with correct size and positioning
2. WHEN viewing the bottom panel, THE Mini_App SHALL display it with correct background blur, border radius, and padding
3. WHEN viewing buttons, THE Mini_App SHALL display them with correct colors, gradients, borders, and shadows
4. WHEN viewing the status text, THE Mini_App SHALL display it with correct color based on subscription status
5. WHEN viewing the device badge, THE Mini_App SHALL display it with correct background color and text styling

### Requirement 4: Setup Page UI Consistency

**User Story:** As a user, I want the setup page to match the original design exactly, so that the onboarding experience is visually consistent.

#### Acceptance Criteria

1. WHEN viewing the setup page, THE Mini_App SHALL display the progress circle with correct size, stroke width, and animation
2. WHEN viewing the rings animation, THE Mini_App SHALL display them with correct sizes, colors, and opacity
3. WHEN viewing the status icon, THE Mini_App SHALL display it with correct size and color
4. WHEN viewing buttons, THE Mini_App SHALL display them with correct styling including the pulsing animation
5. WHEN transitioning between steps, THE Mini_App SHALL update the progress bar smoothly with correct animation timing

### Requirement 5: Typography and Font Consistency

**User Story:** As a developer, I want all text to use consistent typography, so that the design system is cohesive across all pages.

#### Acceptance Criteria

1. THE Mini_App SHALL use the Onest font family for all text elements
2. WHEN displaying headings, THE Mini_App SHALL use correct font weights (600-800) and sizes (18px-20px)
3. WHEN displaying body text, THE Mini_App SHALL use correct font weight (400-500) and size (14-15px)
4. WHEN displaying secondary text, THE Mini_App SHALL use correct color (#9ca3af) and opacity
5. WHEN displaying prices, THE Mini_App SHALL use correct font size (24px) and weight (500-600)

### Requirement 6: Color System Consistency

**User Story:** As a developer, I want all colors to match the design system exactly, so that the visual identity is consistent.

#### Acceptance Criteria

1. THE Mini_App SHALL use #00D68F as the primary color for all primary actions and highlights
2. THE Mini_App SHALL use #00A36C as the darker primary color for the main purchase button
3. THE Mini_App SHALL use rgba(0, 214, 143, 0.2) for light primary backgrounds
4. THE Mini_App SHALL use rgba(0, 214, 143, 0.5) for medium primary borders
5. THE Mini_App SHALL use #9ca3af for default text color and #b0b7bf for default-light text

### Requirement 7: Spacing and Layout Consistency

**User Story:** As a user, I want all spacing and layout to match the original design, so that the interface feels balanced and professional.

#### Acceptance Criteria

1. WHEN viewing any page, THE Mini_App SHALL use correct padding values (16px for page, 20-25px for panels)
2. WHEN viewing button groups, THE Mini_App SHALL use correct gap spacing (10px for rows, 12px for columns)
3. WHEN viewing cards, THE Mini_App SHALL use correct border radius (14px for medium, 24px for large)
4. WHEN viewing the order page grid, THE Mini_App SHALL use correct grid layout (2 columns with 12px gap)
5. WHEN viewing modal content, THE Mini_App SHALL use correct padding (24px) and spacing between elements

### Requirement 8: Interactive States and Animations

**User Story:** As a user, I want interactive elements to respond correctly to my actions, so that the interface feels responsive and polished.

#### Acceptance Criteria

1. WHEN pressing a button, THE Mini_App SHALL apply scale(0.97) transform with smooth transition
2. WHEN hovering over interactive elements, THE Mini_App SHALL provide appropriate visual feedback
3. WHEN copying text, THE Mini_App SHALL show the check icon animation for 2 seconds
4. WHEN opening a modal, THE Mini_App SHALL animate it with slideUp animation (0.3s ease)
5. WHEN the pulsing button is displayed, THE Mini_App SHALL animate the shadow pulse effect continuously

### Requirement 9: Responsive Design and Mobile Optimization

**User Story:** As a mobile user, I want the app to work perfectly on my device, so that I can use all features comfortably.

#### Acceptance Criteria

1. WHEN viewing on any mobile device, THE Mini_App SHALL fit within the viewport without horizontal scrolling
2. WHEN viewing on small screens (≤375px), THE Mini_App SHALL adjust padding to maintain usability
3. WHEN viewing on any device, THE Mini_App SHALL prevent text selection and context menu on long press
4. WHEN the keyboard appears, THE Mini_App SHALL maintain proper layout without breaking
5. WHEN rotating the device, THE Mini_App SHALL maintain correct layout and proportions

### Requirement 10: Telegram WebApp API Integration

**User Story:** As a developer, I want to maintain all Telegram WebApp API functionality, so that the app works correctly within Telegram.

#### Acceptance Criteria

1. THE Mini_App SHALL expand to full height using tg.expand()
2. THE Mini_App SHALL set header color to #010101 using tg.setHeaderColor()
3. THE Mini_App SHALL set background color to #010101 using tg.setBackgroundColor()
4. WHEN navigating between pages, THE Mini_App SHALL show the back button using tg.BackButton.show()
5. WHEN user interactions occur, THE Mini_App SHALL trigger appropriate haptic feedback using tg.HapticFeedback
