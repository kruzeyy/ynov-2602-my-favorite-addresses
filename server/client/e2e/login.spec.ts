import { test, expect } from '@playwright/test';

test('se connecte avec un compte et vérifie que le Dashboard s\'affiche', async ({
  page,
}) => {
  await page.goto('http://localhost:5174');

  // 1. Créer un compte (pour avoir des identifiants valides)
  await page.getByRole('button', { name: /Créer un compte/i }).click();
  const uniqueEmail = `login-${Date.now()}@example.com`;
  const password = 'MotDePasse123!';
  await page.getByLabel('Email').fill(uniqueEmail);
  await page.getByLabel('Mot de passe').fill(password);
  await Promise.all([
    page.waitForResponse(
      (resp) => resp.url().includes('/api/users') && resp.request().method() === 'POST' && resp.status() === 200,
      { timeout: 15000 }
    ),
    page.getByRole('button', { name: "S'inscrire" }).click(),
  ]);
  // Toast vert "Inscription réussie" (getByText plus fiable que getByRole('status') ici)
  await expect(page.locator('.toast-success').filter({ hasText: 'Inscription réussie' })).toBeVisible({ timeout: 5000 });

  // 2. Se connecter (l'email est déjà renseigné)
  await page.getByLabel('Mot de passe').fill(password);
  await page.getByRole('button', { name: 'Se connecter' }).click();

  // 3. Vérifier que le Dashboard s'affiche
  await expect(page.getByRole('heading', { name: 'Mon compte' })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Mes adresses favorites/i })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Se déconnecter' })).toBeVisible();
});
