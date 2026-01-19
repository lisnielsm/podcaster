describe("Episode Detail Page", () => {
  beforeEach(() => {
    cy.mockTopPodcasts();
    cy.mockPodcastDetail("360084272");
  });

  describe("Page Load and Display", () => {
    beforeEach(() => {
      cy.visit("/podcast/360084272/episode/1000641234567");
    });

    it("should display the podcast sidebar", () => {
      cy.get(".podcast-sidebar", { timeout: 10000 }).should("be.visible");
    });

    it("should display podcast info in sidebar", () => {
      cy.get(".podcast-sidebar__title", { timeout: 10000 })
        .should("contain", "The Joe Rogan Experience");
      cy.get(".podcast-sidebar__artist").should("contain", "Joe Rogan");
    });
  });

  describe("Episode Player", () => {
    beforeEach(() => {
      cy.visit("/podcast/360084272/episode/1000641234567");
    });

    it("should display episode player component", () => {
      cy.get(".episode-player", { timeout: 10000 }).should("be.visible");
    });

    it("should display episode title", () => {
      cy.get(".episode-player__header h2", { timeout: 10000 }).should("be.visible");
    });

    it("should display episode description", () => {
      cy.get(".episode-player__description", { timeout: 10000 }).should("be.visible");
    });

    it("should display audio player element", () => {
      cy.get(".episode-player__audio", { timeout: 10000 }).should("be.visible");
    });

    it("should have audio controls enabled", () => {
      cy.get(".episode-player__audio", { timeout: 10000 }).should("have.attr", "controls");
    });
  });

  describe("Sidebar Navigation", () => {
    beforeEach(() => {
      cy.visit("/podcast/360084272/episode/1000641234567");
    });

    it("should navigate to podcast detail when clicking sidebar title", () => {
      cy.get(".podcast-sidebar__title", { timeout: 10000 }).click();
      cy.url().should("include", "/podcast/360084272");
      cy.url().should("not.include", "/episode/");
    });

    it("should navigate to home when clicking header title", () => {
      cy.get(".header__title").click();
      cy.url().should("eq", Cypress.config().baseUrl + "/");
    });
  });

  describe("Responsive Layout", () => {
    it("should display sidebar and player on desktop", () => {
      cy.viewport(1280, 720);
      cy.visit("/podcast/360084272/episode/1000641234567");
      cy.get(".podcast-sidebar", { timeout: 10000 }).should("be.visible");
      cy.get(".episode-player").should("be.visible");
    });

    it("should display content on mobile", () => {
      cy.viewport(375, 667);
      cy.visit("/podcast/360084272/episode/1000641234567");
      cy.get(".podcast-sidebar", { timeout: 10000 }).should("be.visible");
      cy.get(".episode-player").should("be.visible");
    });
  });
});
