import { page } from 'vitest/browser';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import AppChrome from './AppChrome.svelte';

function jsonResponse(data: unknown): Response {
	return new Response(JSON.stringify(data), {
		status: 200,
		headers: { 'content-type': 'application/json' }
	});
}

describe('AppChrome.svelte', () => {
	beforeEach(() => {
		localStorage.setItem('devfolio_token', 'test-token');
		vi.stubGlobal('fetch', vi.fn());
	});

	it('shows a badge with the unread notification count', async () => {
		vi.mocked(fetch).mockResolvedValueOnce(
			jsonResponse([
				{ id: 1, kind: 'like', message: 'liked', read: false },
				{ id: 2, kind: 'comment', message: 'commented', read: false },
				{ id: 3, kind: 'roast', message: 'roasted', read: true }
			])
		);

		const { container } = render(AppChrome);

		const badge = await vi.waitFor(() => {
			const el = [...container.querySelectorAll('span')].find((s) => s.textContent === '2');
			if (!el) throw new Error('badge not found');
			return el;
		});
		expect(badge).toBeTruthy();
	});

	it('hides the badge when everything is read', async () => {
		vi.mocked(fetch).mockResolvedValueOnce(
			jsonResponse([{ id: 1, kind: 'like', message: 'liked', read: true }])
		);

		const { container } = render(AppChrome);

		await expect.element(page.getByText('1')).not.toBeInTheDocument();
		const badge = [...container.querySelectorAll('span')].some((s) =>
			/\d/.test(s.textContent ?? '')
		);
		expect(badge).toBe(false);
	});
});
