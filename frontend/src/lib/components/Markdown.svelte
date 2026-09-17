<script lang="ts">
	import { parseMarkdown } from '$lib/markdown';
	import InlineText from './InlineText.svelte';

	let { text, class: klass = '' }: { text: string; class?: string } = $props();

	const blocks = $derived(parseMarkdown(text));
</script>

<div class={`df-md ${klass}`}>
	{#each blocks as block (block)}
		{#if block.t === 'h'}
			<svelte:element this={`h${block.level}`}><InlineText nodes={block.v} /></svelte:element>
		{:else if block.t === 'p'}
			<p><InlineText nodes={block.v} /></p>
		{:else if block.t === 'ul'}
			<ul>
				{#each block.v as item (item)}
					<li><InlineText nodes={item} /></li>
				{/each}
			</ul>
		{:else if block.t === 'ol'}
			<ol>
				{#each block.v as item (item)}
					<li><InlineText nodes={item} /></li>
				{/each}
			</ol>
		{:else if block.t === 'quote'}
			<blockquote><InlineText nodes={block.v} /></blockquote>
		{:else if block.t === 'code'}
			<pre><code>{block.v}</code></pre>
		{:else if block.t === 'hr'}
			<hr />
		{/if}
	{/each}
</div>

<style>
	.df-md {
		line-height: 1.6;
	}
	.df-md :global(p) {
		margin: 0 0 10px;
	}
	.df-md :global(p:last-child) {
		margin-bottom: 0;
	}
	.df-md :global(h1),
	.df-md :global(h2),
	.df-md :global(h3),
	.df-md :global(h4) {
		margin: 14px 0 6px;
		line-height: 1.3;
	}
	.df-md :global(h1:first-child),
	.df-md :global(h2:first-child),
	.df-md :global(h3:first-child),
	.df-md :global(h4:first-child) {
		margin-top: 0;
	}
	.df-md :global(h1) {
		font-size: 17px;
	}
	.df-md :global(h2) {
		font-size: 15.5px;
	}
	.df-md :global(h3) {
		font-size: 14px;
	}
	.df-md :global(h4) {
		font-size: 13px;
	}
	.df-md :global(ul),
	.df-md :global(ol) {
		margin: 0 0 10px;
		padding-left: 20px;
	}
	.df-md :global(ul:last-child),
	.df-md :global(ol:last-child) {
		margin-bottom: 0;
	}
	.df-md :global(li) {
		margin: 3px 0;
	}
	.df-md :global(blockquote) {
		margin: 10px 0;
		padding: 8px 14px;
		border-left: 3px solid var(--df-line);
		color: var(--df-muted);
		background: color-mix(in oklab, var(--df-ink) 3%, transparent);
		border-radius: 0 6px 6px 0;
	}
	.df-md :global(pre) {
		margin: 10px 0;
		padding: 12px 14px;
		background: var(--df-ink);
		color: white;
		border-radius: 8px;
		overflow-x: auto;
		font-size: 12px;
		line-height: 1.5;
	}
	.df-md :global(pre code) {
		background: none;
		color: inherit;
		padding: 0;
	}
	.df-md :global(hr) {
		border: none;
		border-top: 1px solid var(--df-line);
		margin: 14px 0;
	}
</style>
