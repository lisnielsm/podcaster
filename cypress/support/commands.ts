// ***********************************************
// Custom commands for Podcaster E2E tests
// ***********************************************

// Mock top podcasts API response - intercept all CORS proxy requests for top podcasts
Cypress.Commands.add("mockTopPodcasts", () => {
  // Intercept all requests to CORS proxies that contain the encoded iTunes URL
  cy.intercept("GET", "**/api.allorigins.win/raw?url=**", (req) => {
    if (req.url.includes("toppodcasts") || req.url.includes("rss")) {
      req.reply({ fixture: "top-podcasts.json" });
    }
  }).as("getTopPodcastsProxy1");

  cy.intercept("GET", "**/corsproxy.io/**", (req) => {
    if (req.url.includes("toppodcasts") || req.url.includes("rss")) {
      req.reply({ fixture: "top-podcasts.json" });
    }
  }).as("getTopPodcastsProxy2");

  cy.intercept("GET", "**/cors-anywhere.herokuapp.com/**", (req) => {
    if (req.url.includes("toppodcasts") || req.url.includes("rss")) {
      req.reply({ fixture: "top-podcasts.json" });
    }
  }).as("getTopPodcastsProxy3");

  // Direct iTunes API (fallback)
  cy.intercept("GET", "**/itunes.apple.com/**/toppodcasts/**", {
    fixture: "top-podcasts.json",
  }).as("getTopPodcastsDirect");
});

// Mock podcast detail API response
Cypress.Commands.add("mockPodcastDetail", (_podcastId: string) => {
  // Intercept all requests to CORS proxies that contain lookup
  cy.intercept("GET", "**/api.allorigins.win/raw?url=**", (req) => {
    if (req.url.includes("lookup")) {
      req.reply({ fixture: "podcast-detail.json" });
    }
  }).as("getPodcastDetailProxy1");

  cy.intercept("GET", "**/corsproxy.io/**", (req) => {
    if (req.url.includes("lookup")) {
      req.reply({ fixture: "podcast-detail.json" });
    }
  }).as("getPodcastDetailProxy2");

  cy.intercept("GET", "**/cors-anywhere.herokuapp.com/**", (req) => {
    if (req.url.includes("lookup")) {
      req.reply({ fixture: "podcast-detail.json" });
    }
  }).as("getPodcastDetailProxy3");

  // Direct iTunes API (fallback)
  cy.intercept("GET", "**/itunes.apple.com/lookup**", {
    fixture: "podcast-detail.json",
  }).as("getPodcastDetailDirect");
});

// Mock empty podcasts response
Cypress.Commands.add("mockEmptyPodcasts", () => {
  const emptyResponse = { feed: { entry: [] } };

  cy.intercept("GET", "**/api.allorigins.win/raw?url=**", (req) => {
    if (req.url.includes("toppodcasts") || req.url.includes("rss")) {
      req.reply(emptyResponse);
    }
  }).as("getEmptyPodcastsProxy1");

  cy.intercept("GET", "**/corsproxy.io/**", (req) => {
    if (req.url.includes("toppodcasts") || req.url.includes("rss")) {
      req.reply(emptyResponse);
    }
  }).as("getEmptyPodcastsProxy2");

  cy.intercept("GET", "**/cors-anywhere.herokuapp.com/**", (req) => {
    if (req.url.includes("toppodcasts") || req.url.includes("rss")) {
      req.reply(emptyResponse);
    }
  }).as("getEmptyPodcastsProxy3");
});

// Mock API error
Cypress.Commands.add("mockApiError", () => {
  const errorResponse = { statusCode: 500, body: { error: "Internal Server Error" } };

  cy.intercept("GET", "**/api.allorigins.win/raw?url=**", (req) => {
    if (req.url.includes("toppodcasts") || req.url.includes("rss")) {
      req.reply(errorResponse);
    }
  }).as("getTopPodcastsErrorProxy1");

  cy.intercept("GET", "**/corsproxy.io/**", (req) => {
    if (req.url.includes("toppodcasts") || req.url.includes("rss")) {
      req.reply(errorResponse);
    }
  }).as("getTopPodcastsErrorProxy2");

  cy.intercept("GET", "**/cors-anywhere.herokuapp.com/**", (req) => {
    if (req.url.includes("toppodcasts") || req.url.includes("rss")) {
      req.reply(errorResponse);
    }
  }).as("getTopPodcastsErrorProxy3");
});

export {};
