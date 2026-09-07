# Design Document

## Project

**Smart College Canteen Queue & Ordering System**

---

# Design Philosophy

The application follows a clean, modern, dashboard-first design that prioritizes speed, readability, and ease of navigation.

The interface is designed to help students quickly order food, monitor queue status, and track orders while reducing visual clutter. Important information such as queue length, waiting time, active orders, and announcements should always be visible.

The overall design language should resemble a modern SaaS dashboard instead of a traditional food delivery application.

---

# Design Style

- Modern
- Minimal
- Dashboard First
- Desktop First
- Responsive
- Clean
- Professional
- User Friendly

---

# Target Platform

Primary Platform

- Desktop Web Application (1440px)

Secondary

- Laptop
- Tablet
- Mobile

Built using

- React
- Tailwind CSS

---

# Color Palette

## Primary Color

Orange

`#F97316`

Used for

- Active navigation
- Primary buttons
- Icons
- Progress bars
- CTA buttons
- Active category cards

---

## Background

Light Gray

`#F8FAFC`

---

## Surface

White

`#FFFFFF`

Used for

- Cards
- Sidebar
- Navbar
- Popups

---

## Text Colors

Primary

`#111827`

Secondary

`#6B7280`

Muted

`#94A3B8`

---

## Status Colors

Success

`#22C55E`

Warning

`#F59E0B`

Danger

`#EF4444`

Information

`#3B82F6`

---

# Typography

Font Family

Inter

Fallback

sans-serif

## Heading

- Bold
- Large
- High Contrast

## Body

- Medium Weight
- Easy to Read

## Buttons

- Semi Bold

---

# Border Radius

Large Cards

16px

Buttons

12px

Inputs

999px (pill shaped)

Food Images

12px

---

# Shadows

Use soft shadows only.

Example

- Low elevation
- Subtle hover shadow

Avoid heavy shadows.

---

# Layout

Desktop First

```
--------------------------------------------------------
 Top Navigation
--------------------------------------------------------

 Sidebar | Main Dashboard
         |
         |
         |
```

---

# Navigation

## Sidebar

Position

Left

Width

Approximately 240px

Contains

- Dashboard
- Menu
- My Orders
- Order History
- Profile

Features

- Active item highlighted in orange
- Icon + Label
- Fixed while scrolling

---

## Top Navigation

Contains

- Search Bar
- Notifications
- Messages
- User Profile

Features

- Sticky/Fixed
- Rounded search input
- Minimal design

---

# Dashboard Structure

The dashboard is divided into multiple sections.

## Welcome Section

Displays

- Greeting
- Subtitle
- Current Date

---

## Queue Status

Displays

- Number of people waiting
- Estimated waiting time

Small summary cards positioned at the top.

---

## Active Order Card

Displays

- Food image
- Food name
- Current status
- Pickup time
- Order progress

Uses a horizontal progress bar.

---

## Categories

Displayed as icon cards.

Examples

- Snacks
- Meals
- Beverages
- Desserts
- Healthy

The selected category should be highlighted using the primary orange color.

---

## Featured Items

Food cards should contain

- Food Image
- Name
- Short Description
- Price
- Favorite Button
- Add to Cart Button

Cards should have

- Rounded corners
- White background
- Soft shadow
- Hover animation

---

## Announcements

Displays important notices.

Examples

- Today's Special
- Early Closure
- New Menu Items

Each announcement should have

- Icon
- Title
- Description

---

## Recent Orders

Displays

- Food Image
- Food Name
- Date
- Quantity
- Price
- Status Badge

Status Examples

- Completed
- Preparing
- Cancelled

---

# Components

Reusable Components

- Sidebar
- Navbar
- Search Bar
- Queue Card
- Waiting Time Card
- Active Order Card
- Category Card
- Food Card
- Announcement Card
- Recent Order Card
- Status Badge
- Progress Bar
- Primary Button
- Secondary Button
- Profile Dropdown

---

# Buttons

## Primary

- Orange Background
- White Text
- Rounded
- Hover Effect

## Secondary

- White Background
- Orange Border
- Orange Text

## Floating Action

Circular orange Add (+) button on food cards.

---

# Icons

Library

Lucide React

Style

Outline Icons

Consistent stroke width

---

# Images

Food images should

- Be high quality
- Use a consistent aspect ratio
- Have rounded corners
- Fill the card without distortion

---

# Spacing System

Use an 8px spacing system.

Common spacing

- 8px
- 16px
- 24px
- 32px
- 48px

---

# Responsive Design

## Desktop (1440px+)

- Full Sidebar
- Multi-column Dashboard
- Four-column Food Grid

---

## Laptop (1024px–1439px)

- Slightly compact spacing
- Three-column Food Grid

---

## Tablet (768px–1023px)

- Collapsible Sidebar
- Two-column Grid

---

## Mobile (<768px)

- Hamburger Menu
- Sidebar becomes Drawer
- Single-column Layout
- Cards stacked vertically

---

# Animations

Use subtle animations only.

Examples

- Sidebar hover
- Button hover
- Card hover
- Smooth page transitions
- Progress bar animation

Animation Duration

150ms–250ms

---

# Accessibility

- High color contrast
- Readable typography
- Visible focus states
- Keyboard accessible
- Fully responsive
- Proper spacing between interactive elements

---

# Future Screens

The same design language should be maintained across:

- Login
- Register
- Student Dashboard
- Menu
- Cart
- Checkout
- Order Tracking
- Order History
- Profile
- Admin Dashboard
- Analytics
- Settings

---

# Design Goals

- Clean and modern interface
- Reduce cognitive load
- Highlight queue information
- Enable quick food ordering
- Consistent reusable components
- Responsive across all devices
- Professional SaaS-style dashboard

---

# Design Reference

This design is based on a modern dashboard layout featuring a left navigation sidebar, a top navigation bar, dashboard summary cards, category cards, food cards, announcements, and recent orders. The interface uses a light theme with orange accents, rounded components, subtle shadows, and generous whitespace to create a clean and intuitive user experience.