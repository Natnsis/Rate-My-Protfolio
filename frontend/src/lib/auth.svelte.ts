// Shared, reactive auth state. Import `auth` anywhere; it's a singleton.
import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import { apiFetch, setToken, clearToken, getToken, ApiError } from './api';
import type { UserPublic } from './types';

class AuthStore {
	user = $state<UserPublic | null>(null);
	loading = $state(true);
	error = $state('');

	get isAuthenticated() {
		return this.user !== null;
	}

	/** Called once from the root layout; restores the session from the stored token. */
	async init() {
		if (!browser) return;
		const token = getToken();
		if (!token) {
			this.loading = false;
			return;
		}
		try {
			this.user = await apiFetch<UserPublic>('/auth/me');
		} catch {
			clearToken();
			this.user = null;
		} finally {
			this.loading = false;
		}
	}

	async login(email: string, password: string) {
		this.error = '';
		try {
			const res = await apiFetch<{ token: string; user: UserPublic }>('/auth/login', {
				method: 'POST',
				body: { email, password },
				auth: false
			});
			setToken(res.token);
			this.user = res.user;
			return true;
		} catch (err) {
			this.error = err instanceof ApiError ? err.message : 'Something went wrong. Try again.';
			return false;
		}
	}

	async register(username: string, email: string, password: string, name?: string) {
		this.error = '';
		try {
			const res = await apiFetch<{ token: string; user: UserPublic }>('/auth/register', {
				method: 'POST',
				body: { username, email, password, name },
				auth: false
			});
			setToken(res.token);
			this.user = res.user;
			return true;
		} catch (err) {
			this.error = err instanceof ApiError ? err.message : 'Something went wrong. Try again.';
			return false;
		}
	}

	logout() {
		clearToken();
		this.user = null;
		goto('/auth');
	}

	/** Call from a protected page's script to bounce guests to /auth. */
	requireAuth() {
		if (!this.loading && !this.isAuthenticated) {
			goto('/auth');
		}
	}
}

export const auth = new AuthStore();
