import { test, expect } from '@playwright/test';

test('affiche localhost:5174 et le bouton d\'inscription est présent et cliquable', async ({
  page,
}) => {
  await page.goto('http://localhost:5174');

  // L'app utilise "Créer un compte" (pas "Signup") — cibler le texte réel de l'UI
  const signupButton = page.getByRole('button', { name: /Créer un compte/i });
  await expect(signupButton).toBeVisible();
  await signupButton.click();
});

test('remplit le formulaire d\'inscription, le soumet et vérifie le toast de succès', async ({
  page,
}) => {
  await page.goto('http://localhost:5174');

  // Aller sur le formulaire d'inscription ("Créer un compte")
  await page.getByRole('button', { name: /Créer un compte/i }).click();

  // Vérifier qu'on est sur la vue Inscription
  await expect(page.getByRole('heading', { name: 'Inscription' })).toBeVisible();

  // Remplir le formulaire (email unique pour éviter les doublons)
  const uniqueEmail = `test-${Date.now()}@example.com`;
  const password = 'MotDePasse123!';

  await page.getByLabel('Email').fill(uniqueEmail);
  await page.getByLabel('Mot de passe').fill(password);

  // Soumettre et attendre la réponse API
  await Promise.all([
    page.waitForResponse(
      (resp) => resp.url().includes('/api/users') && resp.request().method() === 'POST' && resp.status() === 200,
      { timeout: 15000 }
    ),
    page.getByRole('button', { name: "S'inscrire" }).click(),
  ]);

  // Toast vert (classe .toast-success) plus fiable que getByRole('status')
  const toastSuccess = page.locator('.toast-success').filter({ hasText: 'Inscription réussie' });
  await expect(toastSuccess).toBeVisible({ timeout: 5000 });
  await expect(toastSuccess).toContainText('Inscription réussie');
});
