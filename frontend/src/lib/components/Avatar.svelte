<script lang="ts">
	interface Props {
		name: string;
		size?: number;
		style?: string;
		bg?: string;
		color?: string;
	}

	let {
		name,
		size = 42,
		style = '',
		bg = 'var(--df-ink-soft)',
		color = 'var(--df-ink)'
	}: Props = $props();

	const initials = $derived(
		(name || '?')
			.replace(/[^A-Za-z ]/g, ' ')
			.trim()
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((p) => p[0].toUpperCase())
			.join('') || '?'
	);
</script>

<div
	style="width:{size}px; height:{size}px; border-radius:50%; background:{bg}; color:{color}; display:flex; align-items:center; justify-content:center; font-weight:600; flex-shrink:0; font-size:{Math.max(10, size * 0.34)}px; letter-spacing:0.01em; {style}"
	>{initials}</div
>