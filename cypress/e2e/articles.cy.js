describe('Login + Accès & Ajout article', () => {
    it('Se connecte, navigue vers les articles, recherche un article, puis en ajoute un', () => {
      cy.visit('/login');
  
      // ✅ Connexion
      cy.contains('Connexion').should('exist');
      cy.get('input[type="email"]').type('abc@abc.abc');
      cy.get('input[type="password"]').type('abc');
      cy.get('button').contains('Se connecter').click();
  
      // ✅ Redirection vers le dashboard
      cy.url().should('include', '/dashboard');
  
      // ✅ Navigation vers /articles
      cy.get('a').contains('Articles').click();
      cy.url().should('include', '/articles');
      cy.contains('📖 Articles').should('exist');
  
      // ⏱ Attente de 5 secondes
      cy.wait(5000);
  
      // ✍️ Ajout d'un article
      cy.get('input[placeholder="Titre de l\'article"]').type('Titre test Cypress');
      cy.get('textarea[placeholder="Contenu de l\'article"]').type('Contenu généré via test e2e');
      cy.get('input[placeholder="SEO Title"]').type('SEO Test Title');
      cy.get('input[placeholder="SEO Description"]').type('Description test pour Cypress');
      cy.get('input[placeholder="Slug"]').type('test-cypress-slug');
      cy.get('input[placeholder*="Tags"]').type('tag1,tag2');
        
      // 🔍 Recherche de l'article "eee"
    //   cy.get('input[placeholder*="Rechercher"]').type('eee');
  
      // Optionnel : upload d’image (si tu veux le faire en test, ajoute un fichier dans /cypress/fixtures/)
      // cy.get('input[type="file"]').selectFile('cypress/fixtures/test.jpg');
  
      // Clique sur publier
      cy.get('button').contains('Publier').click();
  
    //   cy.get('input[placeholder*="Rechercher"]').type('');

      cy.wait(5000);
      // ✅ Vérifie que l’article apparaît (attend un peu le temps que l’API réponde)
      cy.contains('Titre test Cypress', { timeout: 10000 }).should('exist');

    // 🔍 Recherche de l'article "eee"
    cy.get('input[placeholder*="Rechercher"]').type('titreee');
    cy.contains('Voir +').click();

    // 📝 Poster un commentaire sur l'article
    cy.get('textarea[placeholder="Écrivez votre commentaire..."]').type('Ceci est un commentaire de test.');
    cy.get('button').contains('Envoyer').click();

    cy.get('button').contains('Déconnexion').click();

    
    });
  });