// Thin fetch wrapper for the FolioHub API: attaches the JWT, serializes
// JSON bodies, and normalizes error responses into ApiError.
import { browser } from '$app/environment';

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8080/api';
const TOKEN_KEY = 'devfolio_token';

export function getToken(): string | null {
	if (!browser) return null;
	return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
	if (browser) localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
	if (browser) localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

type ApiOptions = {
	method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	body?: unknown;
	/** Attach the stored JWT if present. Defaults to true. */
	auth?: boolean;
};

export async function apiFetch<T = unknown>(path: string, opts: ApiOptions = {}): Promise<T> {
	const { method = 'GET', body, auth: useAuth = true } = opts;
	const headers: Record<string, string> = {};
	if (body !== undefined) headers['Content-Type'] = 'application/json';
	if (useAuth) {
		const token = getToken();
		if (token) headers['Authorization'] = `Bearer ${token}`;
	}

	let res: Response;
	try {
		res = await fetch(`${API_BASE}${path}`, {
			method,
			headers,
			body: body !== undefined ? JSON.stringify(body) : undefined
		});
	} catch {
		throw new ApiError(0, 'Could not reach the server. Is the backend running?');
	}

	if (res.status === 204) return null as T;

	let data: unknown = null;
	try {
		data = await res.json();
	} catch {
		// no JSON body
	}

	if (!res.ok) {
		const message =
			data && typeof data === 'object' && 'error' in data
				? String((data as { error: unknown }).error)
				: `Request failed (${res.status})`;
		throw new ApiError(res.status, message);
	}

	return data as T;
}
