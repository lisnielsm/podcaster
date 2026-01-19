// Import commands.js using ES2015 syntax:
import "./commands";

// Prevent TypeScript errors for Cypress globals
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to intercept and mock the top podcasts API
       */
      mockTopPodcasts(): Chainable<void>;
      /**
       * Custom command to intercept and mock a podcast detail API
       */
      mockPodcastDetail(podcastId: string): Chainable<void>;
      /**
       * Custom command to intercept and mock an empty podcasts response
       */
      mockEmptyPodcasts(): Chainable<void>;
      /**
       * Custom command to intercept and mock API errors
       */
      mockApiError(): Chainable<void>;
    }
  }
}

// Hide fetch/XHR requests from command log for cleaner output
const app = window.top;
if (
  app &&
  !app.document.head.querySelector("[data-hide-command-log-request]")
) {
  const style = app.document.createElement("style");
  style.innerHTML =
    ".command-name-request, .command-name-xhr { display: none }";
  style.setAttribute("data-hide-command-log-request", "");
  app.document.head.appendChild(style);
}
