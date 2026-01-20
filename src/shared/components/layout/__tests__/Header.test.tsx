import React from "react";
import { render, screen, act } from "@testing-library/react";
import { useLocation } from "react-router-dom";
import Header from "../Header";

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  Link: ({
    children,
    to,
    className,
  }: {
    children: React.ReactNode;
    to: string;
    className?: string;
  }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
  useLocation: jest.fn(),
}));

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (useLocation as jest.Mock).mockReturnValue({ pathname: "/" });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Rendering", () => {
    it("should render the header element", () => {
      render(<Header />);

      expect(document.querySelector(".header")).toBeInTheDocument();
    });

    it("should render the title link", () => {
      render(<Header />);

      expect(screen.getByText("Podcaster")).toBeInTheDocument();
    });

    it("should link title to home page", () => {
      render(<Header />);

      const link = screen.getByText("Podcaster");
      expect(link.closest("a")).toHaveAttribute("href", "/");
    });

    it("should have header__content class", () => {
      render(<Header />);

      expect(document.querySelector(".header__content")).toBeInTheDocument();
    });

    it("should have header__title class on link", () => {
      render(<Header />);

      const link = screen.getByText("Podcaster").closest("a");
      expect(link).toHaveClass("header__title");
    });
  });

  describe("Loading Indicator", () => {
    it("should show loading indicator initially on route change", () => {
      render(<Header />);

      expect(
        document.querySelector(".header__loading-indicator")
      ).toBeInTheDocument();
    });

    it("should hide loading indicator after 300ms", () => {
      render(<Header />);

      expect(
        document.querySelector(".header__loading-indicator")
      ).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(
        document.querySelector(".header__loading-indicator")
      ).not.toBeInTheDocument();
    });

    it("should show loading indicator when route changes", () => {
      const { rerender } = render(<Header />);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(
        document.querySelector(".header__loading-indicator")
      ).not.toBeInTheDocument();

      // Simulate route change
      (useLocation as jest.Mock).mockReturnValue({ pathname: "/podcast/123" });
      rerender(<Header />);

      expect(
        document.querySelector(".header__loading-indicator")
      ).toBeInTheDocument();
    });

    it("should have correct accessibility attributes on loading indicator", () => {
      render(<Header />);

      const indicator = document.querySelector(".header__loading-indicator");
      expect(indicator).toHaveAttribute("role", "status");
      expect(indicator).toHaveAttribute("aria-label", "Loading");
      expect(indicator).toHaveAttribute("aria-live", "polite");
    });

    it("should cleanup timeout on unmount", () => {
      const { unmount } = render(<Header />);

      expect(
        document.querySelector(".header__loading-indicator")
      ).toBeInTheDocument();

      unmount();

      // Should not throw after advancing timers
      act(() => {
        jest.advanceTimersByTime(300);
      });
    });
  });
});
