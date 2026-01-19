import React from "react";
import { render } from "@testing-library/react";
import LoadingSpinner from "../LoadingSpinner";

describe("LoadingSpinner", () => {
  it("should render the loading spinner container", () => {
    const { container } = render(<LoadingSpinner />);

    expect(container.querySelector(".loading-spinner")).toBeInTheDocument();
  });

  it("should render the loading spinner icon element", () => {
    const { container } = render(<LoadingSpinner />);

    expect(
      container.querySelector(".loading-spinner__icon")
    ).toBeInTheDocument();
  });

  it("should have both container and icon nested correctly", () => {
    const { container } = render(<LoadingSpinner />);

    const spinnerContainer = container.querySelector(".loading-spinner");
    const icon = spinnerContainer?.querySelector(".loading-spinner__icon");
    expect(icon).toBeInTheDocument();
  });
});
