describe("Navigation Flows", () => {
  beforeEach(() => {
    cy.mockTopPodcasts();
    cy.mockPodcastDetail("360084272");
  });

  describe("Complete User Journey", () => {
    it("should complete full navigation flow: Home → Podcast → Episode → Home", () => {
      // Start at home page
      cy.visit("/");
      cy.get(".podcast-card", { timeout: 10000 }).should("have.length", 5);

      // Navigate to podcast detail
      cy.get(".podcast-card").first().click();
      cy.url().should("include", "/podcast/360084272");
      cy.get(".podcast-sidebar__title", { timeout: 10000 })
        .should("contain", "The Joe Rogan Experience");

      // Navigate to episode detail
      cy.get(".episode-list__row", { timeout: 10000 }).first().click();
      cy.url().should("include", "/episode/");
      cy.get(".episode-player", { timeout: 10000 }).should("be.visible");

      // Navigate to home via header
      cy.get(".header__title").click();
      cy.url().should("eq", Cypress.config().baseUrl + "/");
      cy.get(".podcast-card", { timeout: 10000 }).should("have.length", 5);
    });
  });

  describe("Browser History Navigation", () => {
    it("should support browser back button navigation", () => {
      cy.visit("/");
      cy.get(".podcast-card", { timeout: 10000 }).should("have.length", 5);

      // Navigate forward
      cy.get(".podcast-card").first().click();
      cy.url().should("include", "/podcast/360084272");

      cy.get(".episode-list__row", { timeout: 10000 }).first().click();
      cy.url().should("include", "/episode/");

      // Go back
      cy.go("back");
      cy.url().should("include", "/podcast/360084272");
      cy.url().should("not.include", "/episode/");

      cy.go("back");
      cy.url().should("eq", Cypress.config().baseUrl + "/");
    });
  });

  describe("Direct URL Navigation", () => {
    it("should load home page directly", () => {
      cy.visit("/");
      cy.get(".podcast-card", { timeout: 10000 }).should("have.length", 5);
    });

    it("should load podcast detail page directly via URL", () => {
      cy.visit("/podcast/360084272");
      cy.get(".podcast-sidebar__title", { timeout: 10000 })
        .should("contain", "The Joe Rogan Experience");
      cy.get(".episode-list__row").should("have.length.at.least", 1);
    });

    it("should load episode detail page directly via URL", () => {
      cy.visit("/podcast/360084272/episode/1000641234567");
      cy.get(".episode-player", { timeout: 10000 }).should("be.visible");
    });
  });

  describe("Header Navigation", () => {
    it("should navigate home from any page", () => {
      cy.visit("/podcast/360084272/episode/1000641234567");
      cy.get(".episode-player", { timeout: 10000 }).should("be.visible");
      cy.get(".header__title").click();
      cy.url().should("eq", Cypress.config().baseUrl + "/");
    });
  });
});
