# Podcaster

A Single Page Application for discovering and listening to music podcasts, built with React 19 and TypeScript following **Hexagonal Architecture** principles.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [Design Decisions](#design-decisions)
- [Caching Strategy](#caching-strategy)
- [API Integration](#api-integration)
- [Linting & Code Quality](#linting--code-quality)

---

## Features

- 🎙️ Browse the top 100 most popular podcasts from Apple's iTunes API
- 🔍 Real-time filtering by podcast title or author name
- 📋 View podcast details with complete episode listing
- 🎧 Listen to episodes with native HTML5 audio player
- ⚡ Client-side caching with 24-hour expiration for optimal performance
- 🔗 Clean URL routing without hash-based navigation
- 📱 Responsive sidebar navigation

---

## Tech Stack

| Category   | Technology                     |
| ---------- | ------------------------------ |
| UI Library | React 19                       |
| Language   | TypeScript 5.x                 |
| Routing    | React Router DOM 7             |
| Bundler    | Webpack 5                      |
| Transpiler | Babel                          |
| Linting    | ESLint with TypeScript support |

---

## Architecture

This project implements **Hexagonal Architecture** (also known as **Ports and Adapters**), a software design pattern that promotes separation of concerns and testability.

### Why Hexagonal Architecture?

Hexagonal Architecture isolates the core business logic from external concerns (UI, databases, APIs), making the application:

- **Testable**: Business logic can be tested in isolation without mocking external dependencies
- **Maintainable**: Changes to external systems don't affect the core domain
- **Flexible**: Easy to swap implementations (e.g., change from localStorage to IndexedDB)
- **Scalable**: New features can be added without modifying existing code

### Architectural Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                       │
│                  (React Components, Pages, Hooks)               │
├─────────────────────────────────────────────────────────────────┤
│                         APPLICATION LAYER                       │
│                    (Use Cases / Application Services)           │
├─────────────────────────────────────────────────────────────────┤
│                          DOMAIN LAYER                           │
│               (Entities, Repository Interfaces - PORTS)         │
├─────────────────────────────────────────────────────────────────┤
│                       INFRASTRUCTURE LAYER                      │
│        (API Adapters, Storage Adapters, HTTP Client - ADAPTERS) │
└─────────────────────────────────────────────────────────────────┘
```

### Ports and Adapters

**Ports** (Interfaces) define contracts that the domain expects:

- `IPodcastRepository` - Contract for fetching podcast data
- `IStorageRepository` - Contract for persistent storage operations

**Adapters** (Implementations) fulfill these contracts:

- `PodcastApiAdapter` - Implements `IPodcastRepository` using iTunes API
- `LocalStorageAdapter` - Implements `IStorageRepository` using browser localStorage

This separation allows us to easily swap implementations. For example, we could replace `LocalStorageAdapter` with an `IndexedDBAdapter` without changing any business logic.

---

## Project Structure

```
src/
├── config/                          # Application configuration
│   └── di-container.ts              # Dependency Injection container
│
├── core/                            # Core domain (framework-agnostic)
│   └── domain/
│       ├── models/                  # Domain entities
│       │   ├── Podcast.ts           # Podcast entity
│       │   ├── PodcastDetail.ts     # Podcast with episodes
│       │   ├── Episode.ts           # Episode entity
│       │   └── ApiTypes.ts          # API response types
│       ├── repositories/            # PORTS (Interfaces)
│       │   ├── IPodcastRepository.ts
│       │   └── IStorageRepository.ts
│       └── services/                # Use Cases (Application Services)
│           ├── GetTopPodcastsUseCase.ts
│           ├── GetPodcastDetailUseCase.ts
│           └── GetEpisodeDetailUseCase.ts
│
├── features/                        # Feature-based modules
│   ├── podcast-list/                # Main view feature
│   │   ├── components/
│   │   │   ├── PodcastCard.tsx
│   │   │   └── PodcastFilter.tsx
│   │   ├── hooks/
│   │   │   └── usePodcastList.ts
│   │   └── pages/
│   │       └── PodcastListPage.tsx
│   │
│   ├── podcast-detail/              # Podcast detail feature
│   │   ├── components/
│   │   │   └── EpisodeList.tsx
│   │   ├── hooks/
│   │   │   └── usePodcastDetail.ts
│   │   └── pages/
│   │       └── PodcastDetailPage.tsx
│   │
│   └── episode-details/             # Episode detail feature
│       ├── components/
│       │   └── EpisodePlayer.tsx
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
│       │   └── PodcastSidebar.tsx   # Reusable podcast sidebar
│       └── ui/
│           └── LoadingSpinner.tsx   # Centered loading spinner
│
├── App.tsx                          # Root component
└── index.tsx                        # Application entry point
```

### Key Architectural Components

#### Dependency Injection Container (`config/di-container.ts`)

Centralizes the creation and wiring of dependencies, following the **Dependency Inversion Principle**:

```typescript
// Dependencies are injected, not created inside use cases
const podcastRepository = new PodcastApiAdapter(httpClient);
const storageRepository = new LocalStorageAdapter();

export const diContainer = {
  getTopPodcastsUseCase: new GetTopPodcastsUseCase(
    podcastRepository,
    storageRepository
  ),
  // ...
};
```

#### Use Cases (`core/domain/services/`)

Encapsulate business logic and orchestrate the flow of data:

```typescript
// Use cases depend on abstractions (interfaces), not implementations
class GetTopPodcastsUseCase {
  constructor(
    private podcastRepository: IPodcastRepository, // Port
    private storageRepository: IStorageRepository // Port
  ) {}
}
```

#### Feature Modules (`features/`)

Each feature is self-contained with its own:

- **Components**: UI elements specific to the feature
- **Hooks**: Custom React hooks for state management
- **Pages**: Route-level components

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

## Design Decisions

### 1. Feature-Based Organization

Instead of grouping by file type (components/, hooks/, pages/), the codebase is organized by **features**. This approach:

- Keeps related code together
- Makes features self-contained and easy to understand
- Facilitates code ownership in team environments

### 2. Custom Hooks for State Management

Each page has a dedicated custom hook (e.g., `usePodcastList`, `usePodcastDetail`) that:

- Encapsulates all state logic
- Handles loading and error states
- Provides a clean interface to components
- Makes testing easier

### 3. Presentation Components vs Container Components

- **Pages** act as containers, connecting to hooks and orchestrating data flow
- **Components** are presentational, receiving data via props and remaining reusable

### 4. HTML5 Audio Player

The episode player uses the native HTML5 `<audio>` element with the `controls` attribute, providing:

- Cross-browser compatibility
- Accessible controls out of the box
- No external library dependencies

### 5. HTML Content Rendering

Episode descriptions may contain HTML markup. We use `dangerouslySetInnerHTML` to render this content properly, as specified in the requirements.

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

The project uses ESLint with TypeScript support for consistent code quality:

```bash
# Check for linting issues
npm run lint

# Auto-fix issues where possible
npm run lint:fix
```

### Configured Rules

- TypeScript strict mode
- React hooks rules
- Import ordering
- No unused variables
- Consistent naming conventions

---

## Application Views

### 1. Main View (`/`)

Displays a grid of the top 100 podcasts with:

- Podcast artwork
- Title and author
- Real-time search/filter functionality

### 2. Podcast Detail (`/podcast/:podcastId`)

Shows:

- Sidebar with podcast info (image, title, author, description)
- Episode count
- Episode table with title, date, and duration

### 3. Episode Detail (`/podcast/:podcastId/episode/:episodeId`)

Shows:

- Same sidebar (with clickable links back to podcast)
- Episode title
- Episode description (with HTML rendering)
- HTML5 audio player

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

- [ ] Service Worker for offline support
- [ ] IndexedDB for larger cache capacity
- [ ] Skeleton loading states
- [ ] Error boundaries for graceful error handling
- [ ] Accessibility (a11y) improvements
- [ ] Mobile-responsive design

---

## License

ISC
