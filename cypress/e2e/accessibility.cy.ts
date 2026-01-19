describe("Accessibility", () => {
  beforeEach(() => {
    cy.mockTopPodcasts();
    cy.mockPodcastDetail("360084272");
  });

  describe("ARIA Attributes - Podcast List Page", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.get(".podcast-card", { timeout: 10000 }).should("have.length", 5);
    });

    it("should have role=button on podcast cards", () => {
      cy.get(".podcast-card").first().should("have.attr", "role", "button");
    });

    it("should have aria-label on podcast cards", () => {
      cy.get(".podcast-card").first().should("have.attr", "aria-label");
    });

    it("should have role=search on filter container", () => {
      cy.get(".podcast-filter").should("have.attr", "role", "search");
    });

    it("should have aria-live on results count", () => {
      cy.get(".podcast-filter__badge").should("have.attr", "aria-live", "polite");
    });

    it("should have associated label for filter input", () => {
      cy.get("label[for='podcast-filter-input']").should("exist");
    });
  });

  describe("ARIA Attributes - Podcast Detail Page", () => {
    beforeEach(() => {
      cy.visit("/podcast/360084272");
      cy.get(".episode-list", { timeout: 10000 }).should("be.visible");
    });

    it("should have aria-label on episode list section", () => {
      cy.get(".episode-list").should("have.attr", "aria-label", "Episode list");
    });

    it("should have scope=col on table headers", () => {
      cy.get(".episode-list__table th").each(($th) => {
        cy.wrap($th).should("have.attr", "scope", "col");
      });
    });

    it("should have role=button on episode rows", () => {
      cy.get(".episode-list__row").first().should("have.attr", "role", "button");
    });

    it("should have aria-label on episode rows", () => {
      cy.get(".episode-list__row").first().should("have.attr", "aria-label");
    });
  });

  describe("Keyboard Accessibility", () => {
    it("should have tabIndex on podcast cards", () => {
      cy.visit("/");
      cy.get(".podcast-card", { timeout: 10000 }).first()
        .should("have.attr", "tabIndex", "0");
    });

    it("should have tabIndex on episode rows", () => {
      cy.visit("/podcast/360084272");
      cy.get(".episode-list__row", { timeout: 10000 }).first()
        .should("have.attr", "tabIndex", "0");
    });

    it("should activate podcast card with Enter", () => {
      cy.visit("/");
      cy.get(".podcast-card", { timeout: 10000 }).first().focus().type("{enter}");
      cy.url().should("include", "/podcast/");
    });

    it("should activate episode row with Enter", () => {
      cy.visit("/podcast/360084272");
      cy.get(".episode-list__row", { timeout: 10000 }).first().focus().type("{enter}");
      cy.url().should("include", "/episode/");
    });
  });

  describe("Semantic HTML", () => {
    it("should use header element for app header", () => {
      cy.visit("/");
      cy.get("header.header").should("exist");
    });

    it("should use main element for main content", () => {
      cy.visit("/");
      cy.get("main#main-content").should("exist");
    });

    it("should use aside element for sidebar", () => {
      cy.visit("/podcast/360084272");
      cy.get("aside.podcast-sidebar", { timeout: 10000 }).should("exist");
    });

    it("should use article element for podcast cards", () => {
      cy.visit("/");
      cy.get("article.podcast-card", { timeout: 10000 }).should("exist");
    });

    it("should use section element for episode list", () => {
      cy.visit("/podcast/360084272");
      cy.get("section.episode-list", { timeout: 10000 }).should("exist");
    });
  });

  describe("Image Accessibility", () => {
    it("should have alt text on podcast card images", () => {
      cy.visit("/");
      cy.get(".podcast-card__image", { timeout: 10000 }).each(($img) => {
        cy.wrap($img).should("have.attr", "alt").and("not.be.empty");
      });
    });

    it("should have alt text on sidebar images", () => {
      cy.visit("/podcast/360084272");
      cy.get(".podcast-sidebar__image", { timeout: 10000 })
        .should("have.attr", "alt")
        .and("not.be.empty");
    });
  });

  describe("Form Accessibility", () => {
    it("should have visually hidden label for filter input", () => {
      cy.visit("/");
      cy.get("label[for='podcast-filter-input']", { timeout: 10000 })
        .should("have.class", "visually-hidden");
    });

    it("should have placeholder text on filter input", () => {
      cy.visit("/");
      cy.get(".podcast-filter__input", { timeout: 10000 })
        .should("have.attr", "placeholder", "Filter podcasts...");
    });
  });

  describe("Audio Player Accessibility", () => {
    it("should have controls attribute on audio element", () => {
      cy.visit("/podcast/360084272/episode/1000641234567");
      cy.get(".episode-player__audio", { timeout: 10000 }).should("have.attr", "controls");
    });
  });

  describe("Document Structure", () => {
    it("should have correct language attribute", () => {
      cy.visit("/");
      cy.document().its("documentElement").should("have.attr", "lang", "en");
    });

    it("should have a page title", () => {
      cy.visit("/");
      cy.title().should("eq", "Podcaster");
    });
  });
});
