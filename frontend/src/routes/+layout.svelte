<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { auth } from '$lib/auth.svelte';

	let { children } = $props();

	auth.init();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
