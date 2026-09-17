import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Screenshot from './Screenshot.svelte';

describe('Screenshot.svelte', () => {
	it('renders an image when a src is provided', async () => {
		render(Screenshot, { src: '/shots/one.png', alt: 'Shot one' });
		const img = page.getByRole('img', { name: 'Shot one' });
		await expect.element(img).toBeInTheDocument();
		await expect.element(img).toHaveAttribute('src', '/shots/one.png');
	});

	it('renders a placeholder when no src is given', async () => {
		render(Screenshot, { placeholder: 'Drop an image' });
		await expect.element(page.getByText('Drop an image')).toBeInTheDocument();
	});

	it('applies circle radius for the circle shape', async () => {
		const { container } = render(Screenshot, { shape: 'circle' });
		const el = container.querySelector('div');
		await expect.element(page.getByText('Drop an image')).toBeInTheDocument();
		await expect.element(el).toHaveStyle({ 'border-radius': '50%' });
	});
});