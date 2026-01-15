import "@testing-library/jest-dom";

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Suppress expected console.error messages during tests:
// 1. React 19 act() warnings for async hook tests
// 2. Expected error logs from error handling tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const message = args[0];
    if (typeof message === "string") {
      // Suppress React act() warnings (expected with async hooks)
      if (message.includes("not wrapped in act")) {
        return;
      }
      // Suppress expected error logs from error handling tests
      if (
        message.includes("Error loading podcasts") ||
        message.includes("Error loading podcast detail") ||
        message.includes("Error loading episode detail")
      ) {
        return;
      }
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
