describe("Podcast List Page", () => {
  beforeEach(() => {
    cy.mockTopPodcasts();
  });

  describe("Page Load and Display", () => {
    it("should display the header with app title", () => {
      cy.visit("/");
      cy.get(".header__title").should("contain", "Podcaster");
    });

    it("should display podcast cards after loading", () => {
      cy.visit("/");
      cy.get(".podcast-card", { timeout: 10000 }).should("have.length", 5);
    });

    it("should display podcast name and artist on each card", () => {
      cy.visit("/");
      cy.get(".podcast-card", { timeout: 10000 })
        .first()
        .within(() => {
          cy.get(".podcast-card__title").should(
            "contain",
            "The Joe Rogan Experience"
          );
          cy.get(".podcast-card__artist").should("contain", "Joe Rogan");
        });
    });

    it("should display podcast images with alt text", () => {
      cy.visit("/");
      cy.get(".podcast-card__image", { timeout: 10000 })
        .first()
        .should("have.attr", "alt", "The Joe Rogan Experience");
    });
  });

  describe("Filter Functionality", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.get(".podcast-card", { timeout: 10000 }).should("have.length", 5);
    });

    it("should display the filter input with correct placeholder", () => {
      cy.get(".podcast-filter__input")
        .should("be.visible")
        .and("have.attr", "placeholder", "Filter podcasts...");
    });

    it("should display the results count badge", () => {
      cy.get(".podcast-filter__badge").should("contain", "5");
    });

    it("should filter podcasts by name", () => {
      cy.get(".podcast-filter__input").type("Crime");
      cy.get(".podcast-card").should("have.length", 1);
      cy.get(".podcast-card__title").should("contain", "Crime Junkie");
    });

    it("should filter podcasts by artist name", () => {
      cy.get(".podcast-filter__input").type("New York Times");
      cy.get(".podcast-card").should("have.length", 1);
      cy.get(".podcast-card__title").should("contain", "The Daily");
    });

    it("should be case insensitive when filtering", () => {
      cy.get(".podcast-filter__input").type("smartless");
      cy.get(".podcast-card").should("have.length", 1);
    });

    it("should update results count when filtering", () => {
      cy.get(".podcast-filter__input").type("Joe");
      cy.get(".podcast-filter__badge").should("contain", "1");
    });

    it("should show no results message when filter matches nothing", () => {
      cy.get(".podcast-filter__input").type("xyz123nonexistent");
      cy.get(".podcast-card").should("have.length", 0);
      cy.get(".no-results").should("be.visible");
    });

    it("should clear filter and show all podcasts", () => {
      cy.get(".podcast-filter__input").type("Crime");
      cy.get(".podcast-card").should("have.length", 1);
      cy.get(".podcast-filter__input").clear();
      cy.get(".podcast-card").should("have.length", 5);
    });
  });

  describe("Keyboard Navigation", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.get(".podcast-card", { timeout: 10000 }).should("have.length", 5);
    });

    it("should have tabIndex on podcast cards", () => {
      cy.get(".podcast-card").first().should("have.attr", "tabIndex", "0");
    });

    it("should navigate to podcast detail on Enter key", () => {
      cy.mockPodcastDetail("360084272");
      cy.get(".podcast-card").first().focus().type("{enter}");
      cy.url().should("include", "/podcast/360084272");
    });

    it("should have visible focus indicator on podcast cards", () => {
      cy.get(".podcast-card").first().focus();
      cy.focused().should("have.class", "podcast-card");
    });
  });

  describe("Click Navigation", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.get(".podcast-card", { timeout: 10000 }).should("have.length", 5);
    });

    it("should navigate to podcast detail page on card click", () => {
      cy.mockPodcastDetail("360084272");
      cy.get(".podcast-card").first().click();
      cy.url().should("include", "/podcast/360084272");
    });

    it("should navigate home when clicking header title", () => {
      cy.mockPodcastDetail("360084272");
      cy.get(".podcast-card").first().click();
      cy.url().should("include", "/podcast/");
      cy.get(".header__title").click();
      cy.url().should("eq", Cypress.config().baseUrl + "/");
    });
  });

  describe("Responsive Layout", () => {
    it("should display grid layout on desktop", () => {
      cy.viewport(1280, 720);
      cy.visit("/");
      cy.get(".podcast-grid", { timeout: 10000 }).should("be.visible");
    });

    it("should adapt layout on mobile", () => {
      cy.viewport(375, 667);
      cy.visit("/");
      cy.get(".podcast-grid", { timeout: 10000 }).should("be.visible");
    });
  });
});
