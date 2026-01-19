describe("Podcast Detail Page", () => {
  beforeEach(() => {
    cy.mockTopPodcasts();
    cy.mockPodcastDetail("360084272");
  });

  describe("Page Load and Display", () => {
    beforeEach(() => {
      cy.visit("/podcast/360084272");
    });

    it("should display the podcast sidebar", () => {
      cy.get(".podcast-sidebar", { timeout: 10000 }).should("be.visible");
    });

    it("should display podcast image in sidebar", () => {
      cy.get(".podcast-sidebar__image", { timeout: 10000 })
        .should("be.visible")
        .and("have.attr", "alt", "The Joe Rogan Experience");
    });

    it("should display podcast title in sidebar", () => {
      cy.get(".podcast-sidebar__title", { timeout: 10000 }).should(
        "contain",
        "The Joe Rogan Experience"
      );
    });

    it("should display podcast artist in sidebar", () => {
      cy.get(".podcast-sidebar__artist", { timeout: 10000 }).should(
        "contain",
        "Joe Rogan"
      );
    });

    it("should display episodes count header", () => {
      cy.get(".episodes-header h2", { timeout: 10000 }).should(
        "contain",
        "Episodes:"
      );
    });
  });

  describe("Episode List", () => {
    beforeEach(() => {
      cy.visit("/podcast/360084272");
    });

    it("should display episode list table", () => {
      cy.get(".episode-list__table", { timeout: 10000 }).should("be.visible");
    });

    it("should display table headers", () => {
      cy.get(".episode-list__table th", { timeout: 10000 }).should(
        "have.length",
        3
      );
      cy.get(".episode-list__table th").eq(0).should("contain", "Title");
      cy.get(".episode-list__table th").eq(1).should("contain", "Release Date");
      cy.get(".episode-list__table th").eq(2).should("contain", "Duration");
    });

    it("should display episode rows", () => {
      cy.get(".episode-list__row", { timeout: 10000 }).should(
        "have.length.at.least",
        1
      );
    });

    it("should display episode title in first row", () => {
      cy.get(".episode-list__row", { timeout: 10000 })
        .first()
        .within(() => {
          cy.get(".episode-list__title").should("be.visible");
        });
    });
  });

  describe("Keyboard Navigation", () => {
    beforeEach(() => {
      cy.visit("/podcast/360084272");
    });

    it("should have tabIndex on episode rows", () => {
      cy.get(".episode-list__row", { timeout: 10000 })
        .first()
        .should("have.attr", "tabIndex", "0");
    });

    it("should navigate to episode detail on Enter key", () => {
      cy.get(".episode-list__row", { timeout: 10000 })
        .first()
        .focus()
        .type("{enter}");
      cy.url().should("include", "/episode/");
    });

    it("should have visible focus on episode rows", () => {
      cy.get(".episode-list__row", { timeout: 10000 }).first().focus();
      cy.focused().should("have.class", "episode-list__row");
    });
  });

  describe("Click Navigation", () => {
    beforeEach(() => {
      cy.visit("/podcast/360084272");
    });

    it("should navigate to episode detail page on row click", () => {
      cy.get(".episode-list__row", { timeout: 10000 }).first().click();
      cy.url().should("include", "/episode/");
    });

    it("should navigate home when clicking header title", () => {
      cy.get(".header__title").click();
      cy.url().should("eq", Cypress.config().baseUrl + "/");
    });
  });

  describe("Sidebar Links", () => {
    beforeEach(() => {
      cy.visit("/podcast/360084272");
    });

    it("should have clickable podcast title in sidebar", () => {
      cy.get(".podcast-sidebar__title", { timeout: 10000 }).should(
        "have.attr",
        "href",
        "/podcast/360084272"
      );
    });

    it("should have clickable artist name in sidebar", () => {
      cy.get(".podcast-sidebar__artist", { timeout: 10000 }).should(
        "have.attr",
        "href",
        "/podcast/360084272"
      );
    });
  });

  describe("Responsive Layout", () => {
    it("should display sidebar and main content on desktop", () => {
      cy.viewport(1280, 720);
      cy.visit("/podcast/360084272");
      cy.get(".podcast-sidebar", { timeout: 10000 }).should("be.visible");
      cy.get(".podcast-detail-main").should("be.visible");
    });

    it("should display content on mobile", () => {
      cy.viewport(375, 667);
      cy.visit("/podcast/360084272");
      cy.get(".podcast-sidebar", { timeout: 10000 }).should("be.visible");
    });
  });
});
