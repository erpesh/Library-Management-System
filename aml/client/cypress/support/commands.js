Cypress.Commands.add("login", () => {
	cy.intercept("/api/auth/session", { fixture: "session.json" }).as("session");

	cy.session('user-session', () => {
		cy.setCookie(
			'next-auth.session-token',
			'2593f955-43ba-4631-b967-ac6fcb5f066c'	
		);
	});
});