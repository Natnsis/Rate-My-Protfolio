<script lang="ts">
	import AppChrome from '$lib/components/AppChrome.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import Screenshot from '$lib/components/Screenshot.svelte';
	import { MagnifyingGlassIcon, ArrowClockwiseIcon, CaretDownIcon, StackIcon, HeartIcon, ArrowRightIcon, ArrowCounterClockwiseIcon } from 'phosphor-svelte';
	import { auth } from '$lib/auth.svelte';
	import { apiFetch, ApiError } from '$lib/api';
	import type { PortfolioSummary } from '$lib/types';

	const ink = 'var(--df-ink)';
	const line = 'var(--df-line)';
	const muted = 'var(--df-muted)';

	let filter = $state('All');
	let sortIndex = $state(0);
	let search = $state('');
	let shown = $state(6);
	let loading = $state(true);
	let errorMsg = $state('');
	let portfolios = $state<PortfolioSummary[]>([]);

	const tags = ['All', 'Web', 'Mobile', 'Design Systems', 'UI/UX', '3D', 'AI Tools', 'Backend'];
	const sorts = ['Latest', 'Most liked', 'Most versions'];
	const sortParams = ['latest', 'mostliked', 'mostversions'];

	const sortLabel = $derived(sorts[sortIndex]);
	const allShown = $derived(shown >= portfolios.length);
	const visible = $derived(portfolios.slice(0, shown));

	$effect(() => {
		auth.requireAuth();
	});

	let searchTimeout: ReturnType<typeof setTimeout>;
	function onSearchInput(value: string) {
		search = value;
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(load, 300);
	}

	async function load() {
		loading = true;
		errorMsg = '';
		shown = 6;
		try {
			const params = new URLSearchParams({ sort: sortParams[sortIndex], tag: filter, limit: '60' });
			if (search.trim()) params.set('search', search.trim());
			portfolios = await apiFetch<PortfolioSummary[]>(`/portfolios?${params}`);
		} catch (err) {
			errorMsg = err instanceof ApiError ? err.message : 'Could not load portfolios.';
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		filter;
		sortIndex;
		load();
	});
</script>

<svelte:head><title>Explore — DevFolio</title></svelte:head>

<div style="width:100%; min-height:100vh; background:var(--df-bg); color:var(--df-ink); padding-left:76px;">
	<AppChrome active="explore" initials={auth.user?.initials} />

	<div class="page-container">
		<div class="explore-header">
			<div>
				<div
					style="font-family:var(--font-mono); font-size:12px; font-weight:500; letter-spacing:0.08em; color:var(--df-muted); margin-bottom:14px;"
					>CREATIVE MINDS, REAL WORK</div
				>
				<div
					style="font-size:clamp(26px, 3.4vw, 36px); font-weight:700; line-height:1.04; letter-spacing:-0.038em; text-wrap:pretty;"
					>Explore portfolios,<br /><span style="color:var(--df-muted);">not just projects.</span></div
				>
				<div style="font-size:14.5px; color:var(--df-muted); margin-top:16px;"
					>Discover talented developers and every version they ship.</div
				>
			</div>

			<div style="padding-top:38px;">
				<div style="display:flex; gap:12px; margin-bottom:20px;">
					<div
						style="flex:1; min-width:0; display:flex; align-items:center; gap:10px; background:white; border:1px solid var(--df-line); border-radius:999px; padding:14px 20px;"
					>
						<MagnifyingGlassIcon size={17} color="var(--df-muted)" style="flex-shrink:0;" />
						<input
							value={search}
							oninput={(e) => onSearchInput(e.currentTarget.value)}
							placeholder="Search by name, skills, or stack..."
							style="flex:1; min-width:0; border:none; outline:none; font-size:14px; background:transparent; color:inherit;"
						/>
					</div>
					<button
						type="button"
						onclick={() => (sortIndex = (sortIndex + 1) % sorts.length)}
						style="font-family:inherit; display:flex; align-items:center; gap:12px; background:white; border:1px solid var(--df-line); border-radius:999px; padding:14px 20px; cursor:pointer; white-space:nowrap; color:var(--df-ink);"
					>
						<ArrowClockwiseIcon size={16} color="var(--df-muted)" />
						<span style="font-size:14px; font-weight:500;">{sortLabel}</span>
						<CaretDownIcon size={14} color="var(--df-muted)" />
					</button>
				</div>

				<div style="display:flex; gap:8px; flex-wrap:wrap;">
					{#each tags as label}
						<button
							type="button"
							onclick={() => (filter = label)}
							style="font-family:inherit; background:{filter === label ? ink : 'white'}; color:{filter === label ? 'white' : ink}; border:1px solid {filter === label ? ink : line}; font-size:13px; font-weight:500; padding:9px 18px; border-radius:999px; cursor:pointer; white-space:nowrap;"
							>{label}</button
						>
					{/each}
				</div>
			</div>
		</div>

		{#if loading}
			<div style="padding:80px 0; text-align:center; color:var(--df-muted);">Loading portfolios…</div>
		{:else if errorMsg}
			<div style="background:white; border-radius:8px; padding:40px; text-align:center; color:var(--df-red);"
				>{errorMsg}</div
			>
		{:else if portfolios.length === 0}
			<div style="background:white; border-radius:8px; padding:60px 24px; text-align:center; color:var(--df-muted);">
				Nothing matches yet. Try a different tag or search.
			</div>
		{:else}
			<div class="explore-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:24px;">
				{#each visible as ep}
					<div
						class="explore-card"
						style="background:white; border-radius:8px; overflow:hidden; box-shadow:var(--df-shadow-1); display:flex; flex-direction:column; align-self:start;"
					>
						<div class="explore-card-media">
							<Screenshot
								src={ep.latestVersion.screenshotUrl}
								alt="Portfolio screenshot"
								shape="rect"
								class="explore-card-image"
								style="width:100%; display:block;"
							/>
							{#if ep.demo}
								<div
									style="position:absolute; top:14px; left:14px; background:rgba(255,255,255,0.94); border:1px solid var(--df-line); color:var(--df-muted); font-family:var(--font-mono); font-size:10.5px; letter-spacing:0.04em; padding:6px 12px; border-radius:999px;"
									>sample data</div
								>
							{/if}
							{#if ep.likeCount > 200}
								<div
									style="position:absolute; top:14px; right:14px; background:rgba(255,255,255,0.92); color:var(--df-ink); font-size:11.5px; font-weight:600; padding:6px 13px; border-radius:999px;"
									>Featured</div
								>
							{/if}
						</div>

						<div class="explore-card-body">
							<div class="explore-card-title">{ep.title}</div>
							<div class="explore-card-author">
								<Avatar name={ep.user.name} size={42} />
								<div class="explore-card-person">
									<div style="font-size:14.5px; font-weight:600; letter-spacing:-0.015em;"
										>{ep.user.name}</div
									>
									<div style="font-size:12.5px; color:var(--df-muted);">{ep.user.role}</div>
								</div>
								<a
									href={`/post/${ep.id}`}
									class="explore-card-action"
								>
									View portfolio
									<ArrowRightIcon size={13} color="currentColor" weight="regular" />
								</a>
							</div>

							<div class="explore-card-stats">
								<div class="explore-card-stat">
									<StackIcon size={14} color="currentColor" weight="regular" />
									<span style="font-size:12.5px;">{ep.versionCount} versions</span>
								</div>
								<div class="explore-card-stat">
									<HeartIcon size={14} color="currentColor" weight="regular" />
									<span style="font-size:12.5px;">{ep.likeCount}</span>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<div style="display:flex; justify-content:center; margin-top:40px;">
				<button
					type="button"
					onclick={() => {
						if (!allShown) shown = portfolios.length;
					}}
					style="font-family:inherit; display:flex; align-items:center; gap:10px; background:white; border:1px solid var(--df-line); border-radius:999px; padding:13px 26px; font-size:13.5px; font-weight:500; cursor:pointer; color:var(--df-ink);"
				>
					<ArrowCounterClockwiseIcon size={15} color="currentColor" />
					{allShown ? 'All caught up' : 'Load more'}
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.page-container {
		max-width: 1320px;
		margin: 0 auto;
		padding: 56px 48px 64px 48px;
		--hd-offset: 76px;
	}
	.explore-header {
		display: grid;
		grid-template-columns: minmax(0, 0.78fr) minmax(0, 1.22fr);
		gap: 48px;
		align-items: start;
		margin-bottom: 38px;
		position: sticky;
		top: 0;
		z-index: 6;
		background: var(--df-bg);
		padding: var(--hd-offset) 0 22px;
		margin-top: calc(-1 * (var(--hd-offset) - 20px));
		box-shadow: 0 1px 0 0 var(--df-line);
	}
	.explore-grid {
		align-items: start;
	}
	.explore-card {
		border-radius: 14px !important;
		border: 1px solid color-mix(in oklch, var(--df-line) 88%, white);
		box-shadow: 0 1px 2px rgb(22 29 42 / 3%), 0 8px 24px rgb(22 29 42 / 4%) !important;
		transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
	}
	.explore-card:hover {
		transform: translateY(-3px);
		border-color: color-mix(in oklch, var(--df-accent) 30%, var(--df-line));
		box-shadow: 0 14px 34px rgb(22 29 42 / 10%) !important;
	}
	.explore-card-media {
		position: relative;
		overflow: hidden;
		background: var(--df-ink-soft);
	}
	.explore-card-media::after {
		content: '';
		position: absolute;
		inset: auto 0 0;
		height: 34%;
		pointer-events: none;
		background: linear-gradient(transparent, rgb(20 27 39 / 10%));
	}
	:global(.explore-card-image) {
		height: 188px !important;
		object-fit: cover;
		transition: transform 320ms ease;
	}
	.explore-card:hover :global(.explore-card-image) {
		transform: scale(1.025);
	}
	.explore-card-body {
		display: flex;
		flex-direction: column;
		padding: 18px 20px 16px;
	}
	.explore-card-title {
		margin-bottom: 16px;
		font-size: 15px;
		font-weight: 700;
		letter-spacing: -0.022em;
		line-height: 1.2;
	}
	.explore-card-author {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.explore-card-person {
		flex: 1;
		min-width: 0;
	}
	.explore-card-action {
		display: flex;
		align-items: center;
		gap: 7px;
		border: 1px solid var(--df-line);
		border-radius: 999px;
		padding: 8px 13px;
		font-size: 12px;
		font-weight: 600;
		white-space: nowrap;
		color: var(--df-ink);
		background: white;
	}
	.explore-card-action:hover {
		background: var(--df-ink);
		border-color: var(--df-ink);
		color: white;
	}
	.explore-card-stats {
		display: flex;
		align-items: center;
		gap: 18px;
		margin-top: 17px;
		padding-top: 14px;
		border-top: 1px solid var(--df-ink-soft);
		color: var(--df-muted);
	}
	.explore-card-stat {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	@media (max-width: 900px) {
		.page-container {
			padding: 32px 24px 48px 24px;
			--hd-offset: 60px;
		}
		.explore-header {
			grid-template-columns: 1fr;
			gap: 24px;
		}
	}
	@media (max-width: 640px) {
		.page-container {
			padding: 24px 16px 40px 16px;
			--hd-offset: 56px;
		}
		.explore-grid {
			gap: 16px !important;
		}
		:global(.explore-card-image) {
			height: 178px !important;
		}
		.explore-card-body {
			padding: 16px;
		}
		.explore-card-title {
			margin-bottom: 14px;
		}
		.explore-card-action {
			padding: 8px 12px;
		}
	}
</style>
