import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PodcastFilter from "../PodcastFilter";

describe("PodcastFilter", () => {
  const defaultProps = {
    filter: "",
    onFilterChange: jest.fn(),
    resultsCount: 100,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the filter input", () => {
      render(<PodcastFilter {...defaultProps} />);

      expect(
        screen.getByPlaceholderText("Filter podcasts...")
      ).toBeInTheDocument();
    });

    it("should render the results count badge", () => {
      render(<PodcastFilter {...defaultProps} resultsCount={100} />);

      expect(screen.getByText("100")).toBeInTheDocument();
    });

    it("should display the correct filter value", () => {
      render(<PodcastFilter {...defaultProps} filter="test query" />);

      const input = screen.getByPlaceholderText("Filter podcasts...");
      expect(input).toHaveValue("test query");
    });

    it("should have the correct CSS classes", () => {
      const { container } = render(<PodcastFilter {...defaultProps} />);

      expect(container.querySelector(".podcast-filter")).toBeInTheDocument();
      expect(container.querySelector(".filter-badge")).toBeInTheDocument();
      expect(container.querySelector(".filter-input")).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should call onFilterChange when typing in the input", () => {
      const mockOnFilterChange = jest.fn();
      render(
        <PodcastFilter {...defaultProps} onFilterChange={mockOnFilterChange} />
      );

      const input = screen.getByPlaceholderText("Filter podcasts...");
      fireEvent.change(input, { target: { value: "rock" } });

      expect(mockOnFilterChange).toHaveBeenCalledWith("rock");
    });

    it("should call onFilterChange for each character typed", async () => {
      const user = userEvent.setup();
      const mockOnFilterChange = jest.fn();
      render(
        <PodcastFilter {...defaultProps} onFilterChange={mockOnFilterChange} />
      );

      const input = screen.getByPlaceholderText("Filter podcasts...");
      await user.type(input, "abc");

      expect(mockOnFilterChange).toHaveBeenCalledTimes(3);
      expect(mockOnFilterChange).toHaveBeenNthCalledWith(1, "a");
      expect(mockOnFilterChange).toHaveBeenNthCalledWith(2, "b");
      expect(mockOnFilterChange).toHaveBeenNthCalledWith(3, "c");
    });

    it("should handle clearing the input", () => {
      const mockOnFilterChange = jest.fn();
      render(
        <PodcastFilter
          {...defaultProps}
          filter="existing filter"
          onFilterChange={mockOnFilterChange}
        />
      );

      const input = screen.getByPlaceholderText("Filter podcasts...");
      fireEvent.change(input, { target: { value: "" } });

      expect(mockOnFilterChange).toHaveBeenCalledWith("");
    });
  });

  describe("Results Count", () => {
    it("should display zero results", () => {
      render(<PodcastFilter {...defaultProps} resultsCount={0} />);

      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("should display large numbers correctly", () => {
      render(<PodcastFilter {...defaultProps} resultsCount={1000} />);

      expect(screen.getByText("1000")).toBeInTheDocument();
    });

    it("should update when results count changes", () => {
      const { rerender } = render(
        <PodcastFilter {...defaultProps} resultsCount={100} />
      );

      expect(screen.getByText("100")).toBeInTheDocument();

      rerender(<PodcastFilter {...defaultProps} resultsCount={50} />);

      expect(screen.getByText("50")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have an accessible input with id", () => {
      render(<PodcastFilter {...defaultProps} />);

      const input = screen.getByPlaceholderText("Filter podcasts...");
      expect(input).toHaveAttribute("id", "podcast-filter-input");
    });

    it("should have proper input type", () => {
      render(<PodcastFilter {...defaultProps} />);

      const input = screen.getByPlaceholderText("Filter podcasts...");
      expect(input).toHaveAttribute("type", "text");
    });
  });
});
