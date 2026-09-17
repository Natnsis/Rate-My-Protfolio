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
	return token as string;
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

test('notifications list for the signed-in user and can be marked read', async ({ page }) => {
	const malik = await page.request.post(`${API}/auth/login`, {
		data: { email: 'malik@devfolio.dev', password: 'password123' }
	});
	const { token: malikToken } = await malik.json();

	for (let attempt = 0; attempt < 2; attempt++) {
		const res = await page.request.post(`${API}/portfolios/1/like`, {
			headers: { Authorization: `Bearer ${malikToken}` }
		});
		const { liked } = await res.json();
		if (liked) break;
	}

	const ariaToken = await seedSession(page);
	const notificationResponse = await page.request.get(`${API}/notifications`, {
		headers: { Authorization: `Bearer ${ariaToken}` }
	});
	expect(notificationResponse.ok()).toBeTruthy();
	const notifications = (await notificationResponse.json()) as Array<{
		id: number;
		message: string;
		read: boolean;
		portfolio?: { id: number };
	}>;
	const unread = notifications.find((notification) => !notification.read);
	expect(unread).toBeTruthy();
	await page.goto(`${BASE}/notifications`);

	await expect(page.getByText('Notifications', { exact: true }).first()).toBeVisible({
		timeout: 20_000
	});
	await expect(page.getByText('Malik Okoye').first()).toBeVisible({ timeout: 20_000 });
	await page.getByRole('link', { name: `Open notification: ${unread!.message}` }).first().click();
	await expect(page).toHaveURL(new RegExp(`/post/${unread!.portfolio?.id ?? ''}`), { timeout: 20_000 });

	const updatedResponse = await page.request.get(`${API}/notifications`, {
		headers: { Authorization: `Bearer ${ariaToken}` }
	});
	const updatedNotifications = (await updatedResponse.json()) as Array<{ id: number; read: boolean }>;
	expect(updatedNotifications.find((notification) => notification.id === unread!.id)?.read).toBe(true);

	await page.goto(`${BASE}/notifications`);
	await page.getByRole('button', { name: 'Mark all read' }).click();
	await expect(page.getByText('0 unread')).toBeVisible({ timeout: 20_000 });
});
