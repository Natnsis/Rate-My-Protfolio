import { expect, test } from '@playwright/test';

const BASE = 'http://localhost:4173';
const API = 'http://localhost:8080/api';

async function seedSession(page: import('@playwright/test').Page) {
	const res = await page.request.post(`${API}/auth/login`, {
		data: { email: 'aria@devfolio.dev', password: 'password123' }
	});
	expect(res.ok()).toBeTruthy();
	const { token } = await res.json();
	await page.addInitScript((t) => localStorage.setItem('devfolio_token', t), token);
}

test('landing page loads and links to auth', async ({ page }) => {
	await page.goto(`${BASE}/`);
	await expect(page.getByText('/DEVFOLIO').first()).toBeVisible();
});

test('guest is redirected to auth for a protected page', async ({ page }) => {
	await page.goto(`${BASE}/notifications`);
	await expect(page).toHaveURL(/\/auth/);
});

test('login form signs in a seeded account and lands on the feed', async ({ page }) => {
	await page.goto(`${BASE}/auth`);
	await page.getByRole('button', { name: 'Login' }).last().click();
	await page.getByLabel('Email').fill('aria@devfolio.dev');
	await page.getByLabel('Password').fill('password123');
	await page.getByRole('button', { name: 'Login' }).last().click();

	await expect(page).toHaveURL(/\/feed/, { timeout: 20_000 });
	await expect(page.locator('a[href^="/post/"]').first()).toBeVisible({ timeout: 20_000 });
});

test('feed, explore and leaderboard render API data for a signed-in user', async ({ page }) => {
	await seedSession(page);

	await page.goto(`${BASE}/feed`);
	await expect(page.locator('a[href^="/post/"]').first()).toBeVisible({ timeout: 20_000 });

	await page.goto(`${BASE}/explore`);
	await expect(page.locator('a[href^="/post/"]').first()).toBeVisible({ timeout: 20_000 });

	await page.goto(`${BASE}/leaderboard`);
	await expect(page.getByText('TOP DEVELOPERS').first()).toBeVisible({ timeout: 20_000 });
	await expect(page.getByText('Weekly').first()).toBeVisible();
});