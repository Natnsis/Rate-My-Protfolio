import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Avatar from './Avatar.svelte';

describe('Avatar.svelte', () => {
	it('renders initials from a two-word name', async () => {
		render(Avatar, { name: 'Malik Okoye' });
		await expect.element(page.getByText('MO')).toBeInTheDocument();
	});

	it('renders a single initial for a one-word name', async () => {
		render(Avatar, { name: 'priya' });
		await expect.element(page.getByText('P')).toBeInTheDocument();
	});

	it('falls back to a question mark when the name is empty', async () => {
		render(Avatar, { name: '' });
		await expect.element(page.getByText('?')).toBeInTheDocument();
	});

	it('strips non-letter characters', async () => {
		render(Avatar, { name: 'Devi... Kumar!' });
		await expect.element(page.getByText('DK')).toBeInTheDocument();
	});

	it('respects the size prop', async () => {
		render(Avatar, { name: 'A B', size: 64 });
		const el = page.getByText('AB');
		await expect.element(el).toHaveStyle({ width: '64px', height: '64px' });
	});
});