<script lang="ts">
	import type { InlineNode } from '$lib/markdown';
	import InlineText from './InlineText.svelte';
	let { nodes }: { nodes: InlineNode[] } = $props();
</script>

{#each nodes as node (node)}
	{#if node.t === 'strong'}
		<strong><InlineText nodes={node.v} /></strong>
	{:else if node.t === 'em'}
		<em><InlineText nodes={node.v} /></em>
	{:else if node.t === 'code'}
		<code class="df-md-inline-code">{node.v}</code>
	{:else if node.t === 'link'}
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external links allowed -->
		<a href={node.href} target="_blank" rel="noopener noreferrer" class="df-md-link">
			<InlineText nodes={node.v} />
		</a>
	{:else}
		{node.v}
	{/if}
{/each}
