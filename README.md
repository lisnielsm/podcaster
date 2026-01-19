# Podcaster

A Single Page Application for discovering and listening to music podcasts, built with React 19 and TypeScript following a **hybrid architecture** that combines **Hexagonal Architecture** (Ports & Adapters) with **Screaming Architecture** principles.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Accessibility (WCAG & ARIA)](#accessibility-wcag--aria)
- [CSS Methodology (BEM)](#css-methodology-bem)
- [Design Decisions](#design-decisions)
- [Caching Strategy](#caching-strategy)
- [API Integration](#api-integration)
- [Linting & Code Quality](#linting--code-quality)
- [Security](#security)
- [Application Views](#application-views)
- [Browser Support](#browser-support)
- [Future Improvements](#future-improvements)

---

## Features

- 🎙️ Browse the top 100 most popular podcasts from Apple's iTunes API
- 🔍 Real-time filtering by podcast title or author name
- 📋 View podcast details with complete episode listing
- 🎧 Listen to episodes with native HTML5 audio player
- ⚡ Client-side caching with 24-hour expiration for optimal performance
- 🔗 Clean URL routing without hash-based navigation
- 📱 Responsive sidebar navigation
- ♿ Full WCAG 2.1 accessibility compliance with ARIA attributes
- ⌨️ Complete keyboard navigation support
- 🧪 Comprehensive unit and end-to-end testing

---

## Tech Stack

| Category        | Technology                                |
| --------------- | ----------------------------------------- |
| UI Library      | React 19                                  |
| Language        | TypeScript 5.x                            |
| Routing         | React Router DOM 7                        |
| Bundler         | Webpack 5                                 |
| Transpiler      | Babel                                     |
| Unit Testing    | Jest + React Testing Library              |
| E2E Testing     | Cypress 13                                |
| Linting         | ESLint with TypeScript + jsx-a11y support |
| Security        | DOMPurify (XSS prevention)                |
| CSS Methodology | BEM (Block Element Modifier)              |

---

## Architecture

This project implements a **hybrid architecture** that combines the best aspects of two complementary patterns:

1. **Hexagonal Architecture** (Ports & Adapters) - For technical isolation and testability
2. **Screaming Architecture** - For domain clarity and intent revelation

### Why a Hybrid Approach?

Each architecture pattern solves different problems:

| Pattern       | Problem It Solves            | What It Optimizes         |
| ------------- | ---------------------------- | ------------------------- |
| **Hexagonal** | Coupling to external systems | Testability & Flexibility |
| **Screaming** | "What does this app do?"     | Readability & Intent      |

By combining both, we get:

- ✅ **Clear intent**: Looking at `features/` immediately tells you "this is a podcast app"
- ✅ **Swappable infrastructure**: Can change from localStorage to IndexedDB without touching business logic
- ✅ **Testable core**: Domain logic is isolated and can be unit tested without mocking React
- ✅ **Feature isolation**: Each feature is self-contained with its own components, hooks, and pages
- ✅ **Scalable structure**: New features don't require modifying existing code

### Hexagonal Architecture (Ports & Adapters)

**Author**: Alistair Cockburn (2005)

The core idea is to isolate the **domain** from **external concerns** through well-defined interfaces (ports) and their implementations (adapters).

```
                    ┌─────────────────────────────────────┐
                    │           PRIMARY ADAPTERS          │
                    │        (React UI, Components)       │
                    └──────────────────┬──────────────────┘
                                       │
                            ┌──────────▼──────────┐
                            │    PRIMARY PORTS    │
                            │  (Use Case Inputs)  │
                            └──────────┬──────────┘
                                       │
                            ┌──────────▼──────────┐
                            │                     │
                            │    DOMAIN CORE      │
                            │  (Entities, Rules)  │
                            │                     │
                            └──────────┬──────────┘
                                       │
                            ┌──────────▼──────────┐
                            │   SECONDARY PORTS   │
                            │    (Interfaces)     │
                            └──────────┬──────────┘
                                       │
                    ┌──────────────────▼──────────────────┐
                    │         SECONDARY ADAPTERS          │
                    │   (iTunes API, LocalStorage, HTTP)  │
                    └─────────────────────────────────────┘
```

#### Ports (Interfaces)

Ports define contracts that the domain expects. They live in `domain/repositories/`:

```typescript
// IPodcastRepository.ts - What the domain needs
interface IPodcastRepository {
  getTopPodcasts(): Promise<Podcast[]>;
  getPodcastDetail(id: string): Promise<PodcastDetail>;
}

// IStorageRepository.ts - Storage abstraction
interface IStorageRepository {
  get<T>(key: string): T | null;
  set<T>(key: string, data: T): void;
}
```

#### Adapters (Implementations)

Adapters fulfill port contracts with real implementations. They live in `infrastructure/`:

```typescript
// PodcastApiAdapter.ts - iTunes API implementation
class PodcastApiAdapter implements IPodcastRepository {
  async getTopPodcasts(): Promise<Podcast[]> {
    // Fetches from iTunes API via CORS proxy
  }
}

// LocalStorageAdapter.ts - Browser storage implementation
class LocalStorageAdapter implements IStorageRepository {
  get<T>(key: string): T | null {
    return JSON.parse(localStorage.getItem(key));
  }
}
```

#### Benefits of Hexagonal

- **Swap implementations easily**: Replace `LocalStorageAdapter` with `IndexedDBAdapter` without changing business logic
- **Test in isolation**: Mock the ports, test the domain
- **Framework agnostic core**: Domain doesn't know about React, could be used with Vue or Angular

### Screaming Architecture

**Author**: Robert C. Martin (Uncle Bob)

The core idea is that your folder structure should **scream** what the application does, not what framework it uses.

#### ❌ Bad Example (Framework-Focused)

```
src/
├── components/     # "It's a React app..."
├── hooks/          # "...with hooks..."
├── services/       # "...and services..."
├── utils/          # "But what does it DO?"
└── types/
```

_Looking at this structure, you can't tell if it's an e-commerce site, a blog, or a podcast app._

#### ✅ Good Example (Domain-Focused / Screaming)

```
src/
├── features/
│   ├── podcast-list/      # 🎙️ "Browse podcasts!"
│   ├── podcast-detail/    # 📋 "View podcast details!"
│   └── episode-details/   # 🎧 "Play episodes!"
```

_One glance tells you: "This is a PODCAST application!"_

#### Benefits of Screaming

- **Immediate understanding**: New developers know what the app does in seconds
- **Feature ownership**: Each feature is self-contained
- **Reduced cognitive load**: Find code by thinking about features, not layers

### How We Combine Both

```
src/
├── domain/                          # 🔷 HEXAGONAL: Framework-agnostic domain
│   ├── models/                      # Entities (Podcast, Episode)
│   ├── repositories/                # PORTS (IPodcastRepository)
│   └── services/                    # Use Cases (GetTopPodcastsUseCase)
│
├── infrastructure/                  # 🔷 HEXAGONAL: Adapters
│   ├── api/                         # PodcastApiAdapter
│   ├── http/                        # HttpClient
│   └── storage/                     # LocalStorageAdapter
│
├── features/                        # 📢 SCREAMING: Domain features
│   ├── podcast-list/                # "Browse podcasts"
│   │   ├── components/              # Feature-specific UI
│   │   ├── hooks/                   # Feature-specific state
│   │   └── pages/                   # Route-level components
│   ├── podcast-detail/              # "View podcast"
│   └── episode-details/             # "Play episode"
│
├── shared/                          # Reusable across features
│   └── components/
│       ├── layout/                  # Header, Footer, Sidebar
│       └── ui/                      # LoadingSpinner, etc.
│
└── config/                          # Dependency Injection
    └── di-container.ts
```

This structure places `domain/`, `features/`, and `infrastructure/` at the same level, clearly representing the three main layers of hexagonal architecture while maintaining feature organization.

### The Dependency Rule

Dependencies flow **inward** only. Outer layers depend on inner layers, never the reverse.

```
┌─────────────────────────────────────────────────────────────┐
│  FEATURES (React Components)                                │
│    └── depends on ──────────────────────────┐               │
│                                             ▼               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  DOMAIN (Use Cases, Entities)                          │ │
│  │    └── depends on ─────────────────┐                   │ │
│  │                                    ▼                   │ │
│  │  ┌───────────────────────────────────────────────────┐ │ │
│  │  │  PORTS (Interfaces only - no implementations!)    │ │ │
│  │  └───────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  INFRASTRUCTURE (Adapters - implements Ports)               │
│    └── depends on Ports ────────────────────────────────────┘
└─────────────────────────────────────────────────────────────┘
```

**Key insight**: The domain (`domain/`) defines interfaces (ports), and infrastructure implements them. The domain never imports from infrastructure.

### Practical Example: Data Flow

When a user visits the podcast list page:

```
1. PodcastListPage.tsx (Feature/Presentation)
        │
        ▼ calls
2. usePodcastList hook (Feature/Presentation)
        │
        ▼ calls
3. GetTopPodcastsUseCase (Domain - Use Case)
        │
        ▼ uses interface
4. IPodcastRepository (Domain - Port)
        │
        ▼ implemented by
5. PodcastApiAdapter (Infrastructure - Adapter)
        │
        ▼ uses
6. HttpClient → iTunes API (External)
```

**Notice**: Steps 1-4 don't know about iTunes. We could swap to Spotify's API by creating a `SpotifyApiAdapter` without touching any other code.

### Why This Hybrid Works for This Project

| Requirement                         | How It's Solved                                   |
| ----------------------------------- | ------------------------------------------------- |
| Multiple data sources (API + Cache) | Hexagonal adapters abstract both                  |
| Clear feature boundaries            | Screaming structure with `features/`              |
| Easy testing                        | Domain is isolated, adapters are mockable         |
| Future-proof                        | Can add new features without refactoring          |
| Onboarding                          | New devs understand the app structure immediately |

### Comparison with Other Approaches

| Approach            | This Project                  | Trade-off                        |
| ------------------- | ----------------------------- | -------------------------------- |
| **Pure Hexagonal**  | ✅ Core + Infrastructure      | We add Screaming for clarity     |
| **Pure Screaming**  | ✅ Features folder            | We add Hexagonal for flexibility |
| **Vertical Slice**  | Partial (features are slices) | We keep shared domain layer      |
| **Traditional MVC** | ❌ Not used                   | Would hide the domain            |

This hybrid gives us the **best of both worlds**: technical flexibility from Hexagonal and immediate clarity from Screaming.

---

## Project Structure

```
src/
├── config/                          # Application configuration
│   └── di-container.ts              # Dependency Injection container
│
├── domain/                          # Core domain (framework-agnostic)
│   ├── models/                      # Domain entities
│   │   ├── Podcast.ts               # Podcast entity
│   │   ├── PodcastDetail.ts         # Podcast with episodes
│   │   ├── Episode.ts               # Episode entity
│   │   └── ApiTypes.ts              # API response types
│   ├── repositories/                # PORTS (Interfaces)
│   │   ├── IPodcastRepository.ts
│   │   └── IStorageRepository.ts
│   └── services/                    # Use Cases (Application Services)
│       ├── GetTopPodcastsUseCase.ts
│       ├── GetPodcastDetailUseCase.ts
│       └── GetEpisodeDetailUseCase.ts
│
├── features/                        # Feature-based modules
│   ├── podcast-list/                # Main view feature
│   │   ├── components/
│   │   │   ├── PodcastCard.tsx      # Accessible podcast card
│   │   │   ├── PodcastCard.css      # BEM-styled component
│   │   │   ├── PodcastFilter.tsx    # Search filter with ARIA
│   │   │   └── PodcastFilter.css
│   │   ├── hooks/
│   │   │   └── usePodcastList.ts
│   │   └── pages/
│   │       └── PodcastListPage.tsx
│   │
│   ├── podcast-detail/              # Podcast detail feature
│   │   ├── components/
│   │   │   ├── EpisodeList.tsx      # Keyboard-navigable table
│   │   │   └── EpisodeList.css
│   │   ├── hooks/
│   │   │   └── usePodcastDetail.ts
│   │   └── pages/
│   │       └── PodcastDetailPage.tsx
│   │
│   └── episode-details/             # Episode detail feature
│       ├── components/
│       │   ├── EpisodePlayer.tsx    # Accessible audio player
│       │   └── EpisodePlayer.css
│       ├── hooks/
│       │   └── useEpisodeDetail.ts
│       └── pages/
│           └── EpisodeDetailPage.tsx
│
├── infrastructure/                  # ADAPTERS (External implementations)
│   ├── api/
│   │   └── PodcastApiAdapter.ts     # iTunes API implementation
│   ├── http/
│   │   └── HttpClient.ts            # HTTP abstraction layer
│   └── storage/
│       └── LocalStorageAdapter.ts   # localStorage implementation
│
├── shared/                          # Shared/common code
│   └── components/
│       ├── layout/
│       │   ├── Header.tsx           # App header with loading indicator
│       │   ├── Header.css
│       │   ├── PodcastSidebar.tsx   # Reusable podcast sidebar
│       │   └── PodcastSidebar.css
│       └── ui/
│           ├── LoadingSpinner.tsx   # Accessible loading spinner
│           └── LoadingSpinner.css
│
├── App.tsx                          # Root component
├── App.css                          # Global BEM styles
└── index.tsx                        # Application entry point

cypress/                             # End-to-end tests
├── e2e/
│   ├── podcast-list.cy.ts           # Home page tests
│   ├── podcast-detail.cy.ts         # Podcast detail tests
│   ├── episode-detail.cy.ts         # Episode player tests
│   ├── navigation.cy.ts             # Navigation flow tests
│   ├── error-states.cy.ts           # Error handling tests
│   └── accessibility.cy.ts          # Accessibility tests
├── fixtures/
│   ├── top-podcasts.json            # Mock podcast data
│   └── podcast-detail.json          # Mock episode data
└── support/
    ├── commands.ts                  # Custom Cypress commands
    └── e2e.ts                       # Test configuration
```

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher (or yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/lisnielsm/podcaster
cd podcaster

# Install dependencies
npm install
```

---

## Running the Application

### Development Mode

Starts the development server with:

- Hot Module Replacement (HMR)
- Source maps for debugging
- Unminified assets for readability

```bash
npm start
```

The application will be available at **http://localhost:4500**

### Production Mode

Builds optimized assets with:

- Minified JavaScript and CSS
- Tree-shaking for smaller bundle size
- Production-ready optimizations

```bash
npm run build
```

The production build will be generated in the `dist/` folder, ready to be served by any static file server.

---

## Testing

This project includes comprehensive testing at two levels: **unit tests** with Jest and **end-to-end tests** with Cypress.

### Unit Tests (Jest + React Testing Library)

Unit tests are located alongside the components they test in `__tests__` directories.

```bash
# Run all unit tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

#### What's Tested

| Component/Hook     | Test Coverage                                    |
| ------------------ | ------------------------------------------------ |
| `PodcastCard`      | Rendering, click navigation, keyboard navigation |
| `PodcastFilter`    | Input handling, filtering logic, accessibility   |
| `EpisodeList`      | Table rendering, row interaction, formatting     |
| `EpisodePlayer`    | Audio player, HTML description, no-audio state   |
| `LoadingSpinner`   | ARIA attributes, visibility                      |
| `Header`           | Title display, loading indicator                 |
| `PodcastSidebar`   | Links, image, description                        |
| `usePodcastList`   | Data fetching, filtering, caching                |
| `usePodcastDetail` | Detail fetching, error handling                  |
| `useEpisodeDetail` | Episode lookup, loading states                   |
| Use Cases          | Business logic, cache invalidation               |
| Adapters           | API mapping, storage operations                  |

### End-to-End Tests (Cypress)

E2E tests simulate real user interactions across the entire application.

```bash
# Run all e2e tests (headless)
npm run e2e

# Open Cypress GUI to watch tests run in browser
npm run e2e:open

# Run tests with browser visible
npm run cy:run:headed

# Run Cypress only (requires server to be running)
npm run cy:run
npm run cy:open
```

#### E2E Test Suites

| Test File              | Description                                  | Tests |
| ---------------------- | -------------------------------------------- | ----- |
| `podcast-list.cy.ts`   | Home page, filtering, navigation, responsive | 18    |
| `podcast-detail.cy.ts` | Sidebar, episode list, keyboard nav          | 17    |
| `episode-detail.cy.ts` | Audio player, navigation, responsive         | 11    |
| `navigation.cy.ts`     | User journeys, browser history, direct URLs  | 6     |
| `error-states.cy.ts`   | API errors, 404 states, empty results        | 3     |
| `accessibility.cy.ts`  | ARIA attributes, keyboard, semantic HTML     | 21    |

#### Cypress Custom Commands

The project includes custom Cypress commands for API mocking:

```typescript
// Mock the top podcasts API
cy.mockTopPodcasts();

// Mock podcast detail API
cy.mockPodcastDetail("360084272");

// Mock API errors
cy.mockApiError();

// Mock empty results
cy.mockEmptyPodcasts();
```

#### API Mocking Strategy

Cypress intercepts all CORS proxy requests and returns fixture data:

```typescript
cy.intercept("GET", "**/api.allorigins.win/raw?url=**", (req) => {
  if (req.url.includes("toppodcasts") || req.url.includes("rss")) {
    req.reply({ fixture: "top-podcasts.json" });
  }
}).as("getTopPodcastsProxy");
```

---

## Accessibility (WCAG & ARIA)

This application follows **WCAG 2.1 Level AA** guidelines and implements proper **ARIA** (Accessible Rich Internet Applications) attributes throughout.

### Implemented Accessibility Features

#### 1. Semantic HTML

The application uses proper semantic elements:

| Element     | Usage                    |
| ----------- | ------------------------ |
| `<header>`  | App header component     |
| `<main>`    | Main content area        |
| `<aside>`   | Podcast sidebar          |
| `<article>` | Individual podcast cards |
| `<section>` | Episode list container   |
| `<nav>`     | Navigation elements      |

#### 2. ARIA Attributes

##### Podcast Cards

```tsx
<article
  className="podcast-card"
  role="button"
  tabIndex={0}
  aria-label={`View podcast: ${podcast.name} by ${podcast.artist}`}
  onKeyDown={handleKeyDown}
>
```

##### Filter Input

```tsx
<div className="podcast-filter" role="search">
  <span
    className="podcast-filter__badge"
    aria-live="polite"
    aria-label={`${resultsCount} podcasts found`}
  >
    {resultsCount}
  </span>
  <label htmlFor="podcast-filter-input" className="visually-hidden">
    Filter podcasts
  </label>
  <input
    id="podcast-filter-input"
    aria-describedby="filter-results-count"
    ...
  />
</div>
```

##### Episode List

```tsx
<section className="episode-list" aria-label="Episode list">
  <table>
    <thead>
      <tr>
        <th scope="col">Title</th>
        <th scope="col">Release Date</th>
        <th scope="col">Duration</th>
      </tr>
    </thead>
    <tbody>
      <tr
        role="button"
        tabIndex={0}
        aria-label={`Play episode: ${episode.title}...`}
        onKeyDown={handleKeyDown}
      >
```

##### Loading States

```tsx
<div
  className="loading-spinner"
  role="status"
  aria-live="polite"
  aria-busy="true"
>
  <div className="loading-spinner__icon" aria-hidden="true"></div>
  <span className="visually-hidden">Loading content, please wait...</span>
</div>
```

#### 3. Keyboard Navigation

All interactive elements are fully keyboard accessible:

| Element       | Tab | Enter/Space | Behavior                    |
| ------------- | --- | ----------- | --------------------------- |
| Podcast Card  | ✓   | ✓           | Navigates to podcast detail |
| Episode Row   | ✓   | ✓           | Navigates to episode player |
| Filter Input  | ✓   | N/A         | Types to filter podcasts    |
| Sidebar Links | ✓   | ✓           | Navigates to podcast detail |
| Header Title  | ✓   | ✓           | Navigates to home           |

##### Keyboard Event Handling

```typescript
const handleKeyDown = (event: React.KeyboardEvent) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    handleClick();
  }
};
```

#### 4. Focus Management

- All focusable elements have visible focus indicators
- Focus styles use a consistent blue outline (`#007bff`)
- Main content area has `tabIndex={-1}` for programmatic focus

```css
.podcast-card:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

.podcast-card:focus-visible {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}
```

#### 5. Screen Reader Support

- Visually hidden text for screen readers:

```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

- Proper alt text on all images
- Descriptive aria-labels on interactive elements
- Live regions for dynamic content updates

#### 6. Document Structure

- Proper `lang="en"` attribute on `<html>`
- Descriptive page title
- Logical heading hierarchy

---

## CSS Methodology (BEM)

This project follows the **BEM (Block Element Modifier)** methodology for CSS class naming, ensuring maintainable and scalable styles.

### BEM Naming Convention

```
.block__element--modifier
```

| Part     | Description                    | Example                   |
| -------- | ------------------------------ | ------------------------- |
| Block    | Standalone component           | `.podcast-card`           |
| Element  | Part of a block (uses `__`)    | `.podcast-card__title`    |
| Modifier | Variation or state (uses `--`) | `.podcast-card--featured` |

### Implementation Examples

#### Podcast Card

```css
/* Block */
.podcast-card {
  ...;
}

/* Elements */
.podcast-card__image-container {
  ...;
}
.podcast-card__image {
  ...;
}
.podcast-card__content {
  ...;
}
.podcast-card__title {
  ...;
}
.podcast-card__artist {
  ...;
}

/* State (pseudo-classes) */
.podcast-card:hover {
  ...;
}
.podcast-card:focus {
  ...;
}
```

#### Podcast Filter

```css
/* Block */
.podcast-filter {
  ...;
}

/* Elements */
.podcast-filter__badge {
  ...;
}
.podcast-filter__input {
  ...;
}
```

#### Episode List

```css
/* Block */
.episode-list {
  ...;
}

/* Elements */
.episode-list__table {
  ...;
}
.episode-list__row {
  ...;
}
.episode-list__title {
  ...;
}
.episode-list__date {
  ...;
}
.episode-list__duration {
  ...;
}
```

### Benefits of BEM

1. **Self-documenting** - Class names clearly indicate structure
2. **No specificity wars** - Flat selectors, predictable cascade
3. **Reusable** - Components are independent and portable
4. **Scoped** - No accidental style collisions
5. **Team-friendly** - Consistent naming across the codebase

### Component-to-BEM Mapping

| Component      | Block              | Elements                                                                 |
| -------------- | ------------------ | ------------------------------------------------------------------------ |
| App            | `.app`             | `__main`                                                                 |
| Header         | `.header`          | `__content`, `__title`, `__loading-indicator`                            |
| PodcastCard    | `.podcast-card`    | `__image-container`, `__image`, `__content`, `__title`, `__artist`       |
| PodcastFilter  | `.podcast-filter`  | `__badge`, `__input`                                                     |
| PodcastSidebar | `.podcast-sidebar` | `__card`, `__image`, `__content`, `__title`, `__artist`, `__description` |
| EpisodeList    | `.episode-list`    | `__table`, `__row`, `__title`, `__date`, `__duration`                    |
| EpisodePlayer  | `.episode-player`  | `__header`, `__description`, `__audio`, `__no-audio`                     |
| LoadingSpinner | `.loading-spinner` | `__icon`                                                                 |

---

## Design Decisions

### 1. Hybrid Architecture (Hexagonal + Screaming)

We chose to combine two complementary architectural patterns rather than using just one:

**Why not pure Hexagonal?**

- Hexagonal alone organizes by technical layers (`domain/`, `infrastructure/`)
- This can make it hard to find code related to a specific feature
- New developers might not immediately understand what the app does

**Why not pure Screaming?**

- Screaming alone organizes by features but doesn't enforce infrastructure isolation
- Without ports/adapters, features become tightly coupled to external APIs
- Testing becomes harder without clear boundaries

**The hybrid solution:**

- `features/` folder screams "this is a podcast app" (Screaming)
- `domain/` isolates business logic with ports (Hexagonal)
- `infrastructure/` contains swappable adapters (Hexagonal)
- Each feature is self-contained with its own UI (Screaming + Vertical Slice)

This gives us **clarity** from Screaming and **flexibility** from Hexagonal.

### 2. Feature-Based Organization

Instead of grouping by file type (components/, hooks/, pages/), the codebase is organized by **features**. This approach:

- Keeps related code together
- Makes features self-contained and easy to understand
- Facilitates code ownership in team environments
- Aligns with Screaming Architecture principles

### 3. Custom Hooks for State Management

Each page has a dedicated custom hook (e.g., `usePodcastList`, `usePodcastDetail`) that:

- Encapsulates all state logic
- Handles loading and error states
- Provides a clean interface to components
- Makes testing easier

### 4. Presentation Components vs Container Components

- **Pages** act as containers, connecting to hooks and orchestrating data flow
- **Components** are presentational, receiving data via props and remaining reusable

### 5. HTML5 Audio Player

The episode player uses the native HTML5 `<audio>` element with the `controls` attribute, providing:

- Cross-browser compatibility
- Accessible controls out of the box
- No external library dependencies

### 6. HTML Content Rendering

Episode descriptions may contain HTML markup. We use `dangerouslySetInnerHTML` to render this content properly, as specified in the requirements.

### 7. Accessibility-First Approach

All components were built with accessibility in mind from the start:

- Semantic HTML elements
- ARIA attributes where native semantics are insufficient
- Keyboard navigation support
- Screen reader compatibility
- Visible focus indicators

### 8. BEM CSS Methodology

Adopted BEM for consistent, maintainable CSS:

- Predictable class naming
- Flat specificity
- Component isolation
- Easy to understand and extend

---

## Caching Strategy

The application implements a **cache-first strategy** with time-based invalidation:

### How It Works

1. When data is requested, the app first checks localStorage
2. If cached data exists and is less than 24 hours old, it's returned immediately
3. If cache is missing or expired, fresh data is fetched from the API
4. New data is stored in localStorage with a timestamp

### Implementation

```typescript
// Cached data structure
interface CachedData<T> {
  data: T;
  timestamp: number;
}

// Cache validity check
private isCacheValid(timestamp: number): boolean {
  const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  return Date.now() - timestamp < CACHE_DURATION;
}
```

### Cache Keys

| Data Type        | Cache Key Pattern            |
| ---------------- | ---------------------------- |
| Top 100 Podcasts | `top_podcasts`               |
| Podcast Detail   | `podcast_detail_{podcastId}` |

---

## API Integration

### Data Sources

| Endpoint          | Purpose                              |
| ----------------- | ------------------------------------ |
| iTunes RSS Feed   | Fetches top 100 music podcasts       |
| iTunes Lookup API | Fetches podcast details and episodes |

### CORS Handling

Since the iTunes API doesn't provide CORS headers, the application implements a **multi-proxy fallback system** for maximum reliability:

| Priority | Proxy Service | URL                                    |
| -------- | ------------- | -------------------------------------- |
| 1        | AllOrigins    | `https://api.allorigins.win/raw?url=`  |
| 2        | CorsProxy.io  | `https://corsproxy.io/?`               |
| 3        | CORS Anywhere | `https://cors-anywhere.herokuapp.com/` |

#### Fallback Strategy

```typescript
private readonly corsProxies = [
  "https://api.allorigins.win/raw?url=",
  "https://corsproxy.io/?",
  "https://cors-anywhere.herokuapp.com/",
];

// Try each proxy sequentially until one succeeds
for (let i = 0; i < this.corsProxies.length; i++) {
  try {
    const proxyUrl = this.corsProxies[(this.currentProxyIndex + i) % this.corsProxies.length];
    const finalUrl = `${proxyUrl}${encodeURIComponent(url)}`;
    const response = await fetch(finalUrl);

    if (response.ok) {
      // Remember the working proxy for future requests
      this.currentProxyIndex = (this.currentProxyIndex + i) % this.corsProxies.length;
      return data;
    }
  } catch (error) {
    continue; // Try next proxy
  }
}
```

This approach ensures:

- **High availability**: If one proxy is down, the app automatically tries the next
- **Performance optimization**: The last successful proxy is remembered and tried first
- **Graceful degradation**: Only throws an error if all proxies fail

---

## Linting & Code Quality

The project uses ESLint with TypeScript support and accessibility linting for consistent code quality:

```bash
# Check for linting issues
npm run lint

# Auto-fix issues where possible
npm run lint:fix
```

### Configured Plugins & Rules

| Plugin/Rule Set          | Purpose                           |
| ------------------------ | --------------------------------- |
| `@typescript-eslint`     | TypeScript-specific linting rules |
| `eslint-plugin-jsx-a11y` | Accessibility linting for JSX     |
| `typescript-eslint`      | Type-aware linting                |

### ESLint Configuration Highlights

```javascript
// Accessibility rules (jsx-a11y)
jsxA11y.flatConfigs.recommended,

// TypeScript rules
"@typescript-eslint/no-unused-vars": "warn",
"@typescript-eslint/no-explicit-any": "error",
"@typescript-eslint/no-floating-promises": "warn",

// General rules
"no-console": ["warn", { allow: ["warn", "error"] }],
"prefer-const": "warn",
"no-var": "error",
```

### What jsx-a11y Catches

The accessibility linter warns about:

- Missing `alt` attributes on images
- Interactive elements without keyboard support
- Missing form labels
- Invalid ARIA attributes
- Incorrect ARIA roles

---

## Security

### XSS Prevention with DOMPurify

The application handles HTML content from external APIs (iTunes podcast descriptions) which could potentially contain malicious scripts. To prevent Cross-Site Scripting (XSS) attacks, we use **DOMPurify** for HTML sanitization.

#### Implementation

```typescript
// EpisodePlayer.tsx
import DOMPurify from "dompurify";

const SANITIZE_CONFIG: DOMPurify.Config = {
  ALLOWED_TAGS: ["p", "br", "strong", "em", "a", "ul", "ol", "li", "h1", "h2", "h3"],
  ALLOWED_ATTR: ["href", "target", "rel", "class"],
};

const sanitizedDescription = DOMPurify.sanitize(description, SANITIZE_CONFIG);
```

#### What It Protects Against

| Attack Type | Example | Protection |
|-------------|---------|------------|
| **Script Injection** | `<script>stealCookies()</script>` | Scripts are stripped |
| **Event Handler XSS** | `<img onerror="malicious()">` | Event handlers removed |
| **Data Theft** | `<a href="javascript:...">` | JavaScript URLs blocked |
| **Phishing** | Fake login forms | Only safe tags allowed |

#### Allowed HTML Elements

The sanitizer only permits safe formatting tags:
- Text: `<p>`, `<br>`, `<strong>`, `<b>`, `<em>`, `<i>`, `<u>`, `<span>`
- Headings: `<h1>` through `<h6>`
- Lists: `<ul>`, `<ol>`, `<li>`
- Links: `<a>` (with `target="_blank"` and `rel="noopener noreferrer"` enforced)
- Quotes: `<blockquote>`

#### Link Security

All links in sanitized content automatically receive security attributes:

```html
<!-- Before sanitization -->
<a href="https://example.com">Link</a>

<!-- After sanitization -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">Link</a>
```

- `target="_blank"` - Opens in new tab (doesn't hijack current session)
- `rel="noopener"` - Prevents `window.opener` access
- `rel="noreferrer"` - Doesn't send referrer header

---

## Application Views

### 1. Main View (`/`)

Displays a grid of the top 100 podcasts with:

- Podcast artwork
- Title and author
- Real-time search/filter functionality
- Keyboard-navigable cards
- Live results count for screen readers

### 2. Podcast Detail (`/podcast/:podcastId`)

Shows:

- Sidebar with podcast info (image, title, author, description)
- Episode count
- Episode table with title, date, and duration
- Keyboard-navigable episode rows
- Accessible table headers with `scope="col"`

### 3. Episode Detail (`/podcast/:podcastId/episode/:episodeId`)

Shows:

- Same sidebar (with clickable links back to podcast)
- Episode title
- Episode description (with HTML rendering)
- HTML5 audio player with native controls
- Fallback message for episodes without audio

---

## Available Scripts

| Script                  | Description                                |
| ----------------------- | ------------------------------------------ |
| `npm start`             | Start development server on port 4500      |
| `npm run build`         | Build production bundle to `dist/`         |
| `npm test`              | Run Jest unit tests                        |
| `npm run test:watch`    | Run tests in watch mode                    |
| `npm run test:coverage` | Generate test coverage report              |
| `npm run e2e`           | Run Cypress e2e tests (starts server)      |
| `npm run e2e:open`      | Open Cypress GUI (starts server)           |
| `npm run cy:run`        | Run Cypress tests (server must be running) |
| `npm run cy:open`       | Open Cypress GUI (server must be running)  |
| `npm run cy:run:headed` | Run Cypress with visible browser           |
| `npm run lint`          | Check for linting issues                   |
| `npm run lint:fix`      | Auto-fix linting issues                    |

---

## Browser Support

This application is optimized for the **latest version of Google Chrome** (desktop). Cross-browser compatibility and mobile responsiveness were not primary requirements for this implementation.

---

## Error Handling

As per requirements, errors are logged to the browser console rather than displayed to users. The application gracefully handles:

- Network failures
- Invalid podcast/episode IDs
- Missing audio URLs

---

## Future Improvements

If this were a production application, potential enhancements could include:

- [x] ~~Accessibility (a11y) improvements~~ ✅ Implemented
- [x] ~~End-to-end testing~~ ✅ Implemented with Cypress
- [x] ~~BEM CSS methodology~~ ✅ Implemented
- [ ] Service Worker for offline support
- [ ] IndexedDB for larger cache capacity
- [ ] Skeleton loading states
- [ ] Error boundaries for graceful error handling
- [ ] Mobile-responsive design
- [ ] Dark mode support
- [ ] Internationalization (i18n)

---

## License

ISC
