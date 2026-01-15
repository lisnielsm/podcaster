import React from "react";
import { render, screen } from "@testing-library/react";
import PodcastSidebar from "../PodcastSidebar";

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
}));

describe("PodcastSidebar", () => {
  const defaultProps = {
    id: 123,
    name: "Test Podcast",
    artist: "Test Artist",
    image: "https://example.com/image.jpg",
    description: "This is a test podcast description",
  };

  describe("Rendering", () => {
    it("should render the sidebar element", () => {
      render(<PodcastSidebar {...defaultProps} />);

      expect(document.querySelector(".podcast-sidebar")).toBeInTheDocument();
    });

    it("should render the sidebar card", () => {
      render(<PodcastSidebar {...defaultProps} />);

      expect(
        document.querySelector(".podcast-sidebar-card")
      ).toBeInTheDocument();
    });

    it("should render the podcast image", () => {
      render(<PodcastSidebar {...defaultProps} />);

      const image = screen.getByRole("img");
      expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
      expect(image).toHaveAttribute("alt", "Test Podcast");
    });

    it("should render the podcast name", () => {
      render(<PodcastSidebar {...defaultProps} />);

      expect(screen.getByText("Test Podcast")).toBeInTheDocument();
    });

    it("should render the podcast artist with 'by' prefix", () => {
      render(<PodcastSidebar {...defaultProps} />);

      expect(screen.getByText("by Test Artist")).toBeInTheDocument();
    });

    it("should render the description section", () => {
      render(<PodcastSidebar {...defaultProps} />);

      expect(screen.getByText("Description:")).toBeInTheDocument();
      expect(
        screen.getByText("This is a test podcast description")
      ).toBeInTheDocument();
    });
  });

  describe("Links", () => {
    it("should link image to podcast detail page", () => {
      render(<PodcastSidebar {...defaultProps} />);

      const image = screen.getByRole("img");
      const link = image.closest("a");
      expect(link).toHaveAttribute("href", "/podcast/123");
    });

    it("should link title to podcast detail page", () => {
      render(<PodcastSidebar {...defaultProps} />);

      const titleLink = screen.getByText("Test Podcast").closest("a");
      expect(titleLink).toHaveAttribute("href", "/podcast/123");
    });

    it("should link artist to podcast detail page", () => {
      render(<PodcastSidebar {...defaultProps} />);

      const artistLink = screen.getByText("by Test Artist").closest("a");
      expect(artistLink).toHaveAttribute("href", "/podcast/123");
    });
  });

  describe("CSS Classes", () => {
    it("should have podcast-sidebar-image class on image", () => {
      render(<PodcastSidebar {...defaultProps} />);

      const image = screen.getByRole("img");
      expect(image).toHaveClass("podcast-sidebar-image");
    });

    it("should have podcast-sidebar-title class on title link", () => {
      render(<PodcastSidebar {...defaultProps} />);

      const titleLink = screen.getByText("Test Podcast").closest("a");
      expect(titleLink).toHaveClass("podcast-sidebar-title");
    });

    it("should have podcast-sidebar-artist class on artist link", () => {
      render(<PodcastSidebar {...defaultProps} />);

      const artistLink = screen.getByText("by Test Artist").closest("a");
      expect(artistLink).toHaveClass("podcast-sidebar-artist");
    });

    it("should have podcast-sidebar-content class", () => {
      render(<PodcastSidebar {...defaultProps} />);

      expect(
        document.querySelector(".podcast-sidebar-content")
      ).toBeInTheDocument();
    });

    it("should have podcast-sidebar-description class", () => {
      render(<PodcastSidebar {...defaultProps} />);

      expect(
        document.querySelector(".podcast-sidebar-description")
      ).toBeInTheDocument();
    });
  });

  describe("Without Description", () => {
    it("should not render description section when description is undefined", () => {
      const propsWithoutDesc = {
        id: 123,
        name: "Test Podcast",
        artist: "Test Artist",
        image: "https://example.com/image.jpg",
      };

      render(<PodcastSidebar {...propsWithoutDesc} />);

      expect(screen.queryByText("Description:")).not.toBeInTheDocument();
      expect(
        document.querySelector(".podcast-sidebar-description")
      ).not.toBeInTheDocument();
    });

    it("should not render description section when description is empty", () => {
      const propsWithEmptyDesc = {
        ...defaultProps,
        description: "",
      };

      render(<PodcastSidebar {...propsWithEmptyDesc} />);

      expect(screen.queryByText("Description:")).not.toBeInTheDocument();
    });
  });

  describe("Different IDs", () => {
    it("should use correct ID in links", () => {
      const propsWithDifferentId = {
        ...defaultProps,
        id: 456,
      };

      render(<PodcastSidebar {...propsWithDifferentId} />);

      const titleLink = screen.getByText("Test Podcast").closest("a");
      expect(titleLink).toHaveAttribute("href", "/podcast/456");
    });
  });
});
