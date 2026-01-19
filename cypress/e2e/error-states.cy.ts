describe("Error States", () => {
  describe("Podcast List Errors", () => {
    it("should display error message when API fails", () => {
      cy.mockApiError();
      cy.visit("/");
      cy.get(".podcast-list-error", { timeout: 15000 }).should("be.visible");
    });
  });

  describe("Episode Not Found", () => {
    beforeEach(() => {
      cy.mockTopPodcasts();
      cy.mockPodcastDetail("360084272");
    });

    it("should display error for non-existent episode", () => {
      cy.visit("/podcast/360084272/episode/999999999999");
      cy.get(".episode-detail-error", { timeout: 15000 }).should("be.visible");
    });
  });

  describe("Empty Filter Results", () => {
    beforeEach(() => {
      cy.mockTopPodcasts();
    });

    it("should show no results message when filter matches nothing", () => {
      cy.visit("/");
      cy.get(".podcast-card", { timeout: 10000 }).should("have.length", 5);
      cy.get(".podcast-filter__input").type("xyznonexistent123");
      cy.get(".podcast-card").should("have.length", 0);
      cy.get(".no-results").should("be.visible");
    });
  });
});
