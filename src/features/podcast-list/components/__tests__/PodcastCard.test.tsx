import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import PodcastCard from "../PodcastCard";
import { Podcast } from "../../../../core/domain/models/Podcast";

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("PodcastCard", () => {
  const mockNavigate = jest.fn();
  const mockPodcast: Podcast = {
    id: "123",
    name: "Test Podcast",
    artist: "Test Artist",
    image: "https://example.com/image.jpg",
    summary: "Test summary",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  describe("Rendering", () => {
    it("should render the podcast name", () => {
      render(<PodcastCard podcast={mockPodcast} />);

      expect(screen.getByText("Test Podcast")).toBeInTheDocument();
    });

    it("should render the podcast artist with 'Author:' prefix", () => {
      render(<PodcastCard podcast={mockPodcast} />);

      expect(screen.getByText("Author: Test Artist")).toBeInTheDocument();
    });

    it("should render the podcast image with correct src and alt", () => {
      render(<PodcastCard podcast={mockPodcast} />);

      const image = screen.getByRole("img");
      expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
      expect(image).toHaveAttribute("alt", "Test Podcast");
    });

    it("should have the correct CSS class", () => {
      const { container } = render(<PodcastCard podcast={mockPodcast} />);

      expect(container.querySelector(".podcast-card")).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("should navigate to podcast detail page when clicked", () => {
      render(<PodcastCard podcast={mockPodcast} />);

      const card = screen.getByText("Test Podcast").closest(".podcast-card");
      fireEvent.click(card!);

      expect(mockNavigate).toHaveBeenCalledWith("/podcast/123");
    });

    it("should navigate with the correct podcast id", () => {
      const anotherPodcast: Podcast = {
        ...mockPodcast,
        id: "456",
      };

      render(<PodcastCard podcast={anotherPodcast} />);

      const card = screen.getByText("Test Podcast").closest(".podcast-card");
      fireEvent.click(card!);

      expect(mockNavigate).toHaveBeenCalledWith("/podcast/456");
    });
  });

  describe("Edge cases", () => {
    it("should handle podcast with long name", () => {
      const longNamePodcast: Podcast = {
        ...mockPodcast,
        name: "This is a very long podcast name that might overflow the card",
      };

      render(<PodcastCard podcast={longNamePodcast} />);

      expect(
        screen.getByText(
          "This is a very long podcast name that might overflow the card"
        )
      ).toBeInTheDocument();
    });

    it("should handle podcast without summary", () => {
      const noSummaryPodcast: Podcast = {
        id: "789",
        name: "No Summary Podcast",
        artist: "Artist",
        image: "https://example.com/image.jpg",
      };

      render(<PodcastCard podcast={noSummaryPodcast} />);

      expect(screen.getByText("No Summary Podcast")).toBeInTheDocument();
    });

    it("should handle special characters in podcast name", () => {
      const specialCharsPodcast: Podcast = {
        ...mockPodcast,
        name: "Podcast & Music <Test> 'Special'",
      };

      render(<PodcastCard podcast={specialCharsPodcast} />);

      expect(
        screen.getByText("Podcast & Music <Test> 'Special'")
      ).toBeInTheDocument();
    });
  });
});
