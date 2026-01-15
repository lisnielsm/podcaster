import React from "react";
import { render } from "@testing-library/react";
import LoadingSpinner from "../LoadingSpinner";

describe("LoadingSpinner", () => {
  it("should render the loading spinner container", () => {
    const { container } = render(<LoadingSpinner />);

    expect(
      container.querySelector(".loading-spinner-container")
    ).toBeInTheDocument();
  });

  it("should render the loading spinner element", () => {
    const { container } = render(<LoadingSpinner />);

    expect(container.querySelector(".loading-spinner")).toBeInTheDocument();
  });

  it("should have both container and spinner nested correctly", () => {
    const { container } = render(<LoadingSpinner />);

    const spinnerContainer = container.querySelector(
      ".loading-spinner-container"
    );
    const spinner = spinnerContainer?.querySelector(".loading-spinner");
    expect(spinner).toBeInTheDocument();
  });
});
