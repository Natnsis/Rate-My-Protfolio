import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiFetch, ApiError, getToken, setToken, clearToken } from './api';

vi.mock('$app/environment', () => ({ browser: true }));

function makeLocalStorage() {
	const store: Record<string, string> = {};
	return {
		getItem: (k: string) => store[k] ?? null,
		setItem: (k: string, v: string) => {
			store[k] = v;
		},
		removeItem: (k: string) => {
			delete store[k];
		}
	};
}

async function jsonResponse(status: number, data: unknown): Promise<Response> {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'content-type': 'application/json' }
	});
}

describe('apiFetch', () => {
	beforeEach(() => {
		vi.stubGlobal('localStorage', makeLocalStorage());
		vi.stubGlobal('fetch', vi.fn());
	});
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('GETs and returns parsed JSON', async () => {
		vi.mocked(fetch).mockResolvedValueOnce(await jsonResponse(200, { id: 1 }));
		await expect(apiFetch<{ id: number }>('/portfolios/1')).resolves.toEqual({ id: 1 });

		const [url, init] = vi.mocked(fetch).mock.calls[0];
		expect(url).toBe('http://localhost:8080/api/portfolios/1');
		expect(init?.headers).toEqual({});
	});

	it('serializes a JSON body and sets the content type', async () => {
		vi.mocked(fetch).mockResolvedValueOnce(await jsonResponse(201, { ok: true }));
		await apiFetch('/portfolios', { method: 'POST', body: { title: 'Port' } });

		const [, init] = vi.mocked(fetch).mock.calls[0];
		expect(init?.method).toBe('POST');
		expect(init?.headers?.['Content-Type']).toBe('application/json');
		expect(init?.body).toBe('{"title":"Port"}');
	});

	it('attaches the stored token as a bearer header', async () => {
		localStorage.setItem('devfolio_token', 'jwt-token');
		vi.mocked(fetch).mockResolvedValueOnce(await jsonResponse(200, {}));
		await apiFetch('/auth/me');

		const [, init] = vi.mocked(fetch).mock.calls[0];
		expect(init?.headers?.['Authorization']).toBe('Bearer jwt-token');
	});

	it('omits the token when auth is disabled', async () => {
		localStorage.setItem('devfolio_token', 'jwt-token');
		vi.mocked(fetch).mockResolvedValueOnce(await jsonResponse(200, {}));
		await apiFetch('/healthz', { auth: false });

		const [, init] = vi.mocked(fetch).mock.calls[0];
		expect(init?.headers?.['Authorization']).toBeUndefined();
	});

	it('returns null for a 204', async () => {
		vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 204 }));
		await expect(apiFetch('/notifications/read-all', { method: 'POST' })).resolves.toBeNull();
	});

	it('throws ApiError carrying the server message', async () => {
		vi.mocked(fetch).mockResolvedValueOnce(await jsonResponse(422, { error: 'mode must be roast, feedback or suggestions' }));
		const err = await apiFetch('/ai/generate', { method: 'POST', body: {} }).catch((e) => e);
		expect(err).toBeInstanceOf(ApiError);
		expect((err as ApiError).status).toBe(422);
		expect((err as ApiError).message).toBe('mode must be roast, feedback or suggestions');
	});

	it('falls back to a generic message when the body has no error field', async () => {
		vi.mocked(fetch).mockResolvedValueOnce(await jsonResponse(404, { detail: 'nope' }));
		const err = await apiFetch('/portfolios/99').catch((e) => e) as ApiError;
		expect(err.status).toBe(404);
		expect(err.message).toContain('404');
	});

	it('throws ApiError status 0 on network failure', async () => {
		vi.mocked(fetch).mockRejectedValueOnce(new TypeError('fetch failed'));
		const err = await apiFetch('/portfolios').catch((e) => e) as ApiError;
		expect(err.status).toBe(0);
	});
});

describe('token helpers', () => {
	beforeEach(() => {
		vi.stubGlobal('localStorage', makeLocalStorage());
	});
	afterEach(() => vi.unstubAllGlobals());

	it('round-trips the token through localStorage', () => {
		expect(getToken()).toBeNull();
		setToken('abc');
		expect(getToken()).toBe('abc');
		clearToken();
		expect(getToken()).toBeNull();
	});
});