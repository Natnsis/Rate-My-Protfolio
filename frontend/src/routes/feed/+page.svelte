<script lang="ts">
	import AppChrome from '$lib/components/AppChrome.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import Screenshot from '$lib/components/Screenshot.svelte';
	import { HeartIcon, ChatTextIcon, TrophyIcon, ArrowRightIcon } from 'phosphor-svelte';
	import { auth } from '$lib/auth.svelte';
	import { apiFetch, ApiError } from '$lib/api';
	import { timeAgo, ratingLabel } from '$lib/format';
	import type { PortfolioSummary, LeaderboardRow, Roast } from '$lib/types';

	const ink = 'var(--df-ink)';
	const line = 'var(--df-line)';
	const muted = 'var(--df-muted)';

	let tab = $state('Trending');
	const tabs = ['Following', 'Trending', 'Newest'];

	let items = $state<PortfolioSummary[]>([]);
	let topRows = $state<LeaderboardRow[]>([]);
	let freshRoast = $state<Roast | null>(null);
	let versionsToday = $state(0);
	let loading = $state(true);
	let errorMsg = $state('');

	const hero = $derived(items[0]);
	const posts = $derived(items.slice(1, 7));

	$effect(() => {
		auth.requireAuth();
	});

	async function load() {
		loading = true;
		errorMsg = '';
		const sort = tab === 'Newest' ? 'latest' : 'trending';
		try {
			const [list, leaderboard, roasts, stats] = await Promise.all([
				apiFetch<PortfolioSummary[]>(`/portfolios?sort=${sort}&limit=7`),
				apiFetch<LeaderboardRow[]>('/leaderboard?timeframe=weekly&limit=3'),
				apiFetch<Roast[]>('/roasts?sort=new&limit=1'),
				apiFetch<{ versionsToday: number }>('/stats/summary')
			]);
			items = list;
			topRows = leaderboard;
			freshRoast = roasts[0] ?? null;
			versionsToday = stats.versionsToday;
		} catch (err) {
			errorMsg = err instanceof ApiError ? err.message : 'Could not load your feed.';
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		tab;
		load();
	});
</script>

<svelte:head><title>Feed — DevFolio</title></svelte:head>

<div style="width:100%; min-height:100vh; background:var(--df-bg); color:var(--df-ink); padding-left:76px;">
	<AppChrome active="feed" initials={auth.user?.initials} />

	<div class="page-container">
		<div class="feed-header">

			<div>
				<div
					style="font-family:var(--font-mono); font-size:12px; font-weight:500; letter-spacing:0.1em; color:var(--df-muted); margin-bottom:14px;"
					>YOUR FEED</div
				>
				<div
					style="font-size:clamp(26px, 3.4vw, 36px); font-weight:700; line-height:1.02; letter-spacing:-0.04em; text-wrap:pretty;"
					>Fresh versions, hot off the branch.</div
				>
			</div>
			<div style="display:flex; gap:8px; justify-content:flex-end; flex-wrap:wrap;">
				{#each tabs as label}
					<button
						type="button"
						onclick={() => (tab = label)}
						style="font-family:inherit; background:{tab === label ? ink : 'white'}; color:{tab === label ? 'white' : ink}; border:1px solid {tab === label ? ink : line}; font-size:13px; font-weight:500; padding:10px 20px; border-radius:999px; cursor:pointer; white-space:nowrap;"
						>{label}</button
					>
				{/each}
			</div>
		</div>

		{#if loading}
			<div style="padding:80px 0; text-align:center; color:var(--df-muted);">Loading your feed…</div>
		{:else if errorMsg}
			<div style="background:white; border-radius:8px; padding:40px; text-align:center; color:var(--df-red);"
				>{errorMsg}</div
			>
		{:else if !hero}
			<div style="background:white; border-radius:8px; padding:60px 24px; text-align:center; color:var(--df-muted);">
				Nobody's posted yet. <a href="/upload" style="color:var(--df-accent); font-weight:600;">Be the first.</a>
			</div>
		{:else}
			<div class="feed-grid" style="display:grid; grid-template-columns:repeat(4, minmax(0,1fr)); gap:18px; margin-bottom:18px;">
				<a
					href={`/post/${hero.id}`}
					style="grid-column:span 2; grid-row:span 2; background:white; border-radius:8px; overflow:hidden; display:flex; flex-direction:column; box-shadow:var(--df-shadow-1);"
				>
					<div style="position:relative;">
						<Screenshot
							src={hero.latestVersion.screenshotUrl}
							alt="Featured portfolio screenshot"
							shape="rect"
							style="width:100%; height:240px; display:block;"
						/>
						<div
							style="position:absolute; top:16px; left:16px; background:var(--df-ink); color:white; font-family:var(--font-mono); font-size:11px; font-weight:500; letter-spacing:0.06em; padding:7px 14px; border-radius:999px;"
							>TODAY'S TOP VERSION</div
						>
					</div>
					<div style="padding:22px 24px 24px 24px; display:flex; flex-direction:column; flex:1;">
						<div style="display:flex; align-items:center; gap:12px; margin-bottom:14px;">
							<Avatar name={hero.user.name} size={42} />
							<div style="flex:1; min-width:0;">
								<div style="font-size:15px; font-weight:600; letter-spacing:-0.015em;">{hero.user.name}</div>
								<div style="font-size:12.5px; color:var(--df-muted);"
									>{hero.user.role} · {timeAgo(hero.latestVersion.createdAt)} ago</div
								>
							</div>
							<div
								style="background:var(--df-ink-soft); font-family:var(--font-mono); font-size:12px; font-weight:500; padding:7px 13px; border-radius:999px;"
								>{hero.latestVersion.label}</div
							>
						</div>
						<div style="font-size:20px; font-weight:700; letter-spacing:-0.025em; margin-bottom:8px;"
							>{hero.title}</div
						>
						<div
							style="font-size:14px; line-height:1.6; color:var(--df-muted); margin-bottom:20px;"
							>{hero.latestVersion.note}</div
						>
						<div style="display:flex; align-items:center; gap:10px; margin-top:auto;">
							<div style="flex:1; background:var(--df-bg); border-radius:10px; padding:11px 0; text-align:center;">
								<div style="font-size:17px; font-weight:700;">{ratingLabel(hero.latestVersion.uiRating)}</div>
								<div
									style="font-family:var(--font-mono); font-size:10.5px; letter-spacing:0.06em; color:var(--df-muted); margin-top:2px;"
									>UI</div
								>
							</div>
							<div style="flex:1; background:var(--df-bg); border-radius:10px; padding:11px 0; text-align:center;">
								<div style="font-size:17px; font-weight:700;">{ratingLabel(hero.latestVersion.uxRating)}</div>
								<div
									style="font-family:var(--font-mono); font-size:10.5px; letter-spacing:0.06em; color:var(--df-muted); margin-top:2px;"
									>UX</div
								>
							</div>
							<div style="flex:1; background:var(--df-bg); border-radius:10px; padding:11px 0; text-align:center;">
								<div style="font-size:17px; font-weight:700;">{ratingLabel(hero.latestVersion.codeRating)}</div>
								<div
									style="font-family:var(--font-mono); font-size:10.5px; letter-spacing:0.06em; color:var(--df-muted); margin-top:2px;"
									>CODE</div
								>
							</div>
							<div style="flex:1; background:var(--df-ink); color:white; border-radius:10px; padding:11px 0; text-align:center;">
								<div style="font-size:17px; font-weight:700;">{hero.likeCount}</div>
								<div
									style="font-family:var(--font-mono); font-size:10.5px; letter-spacing:0.06em; opacity:0.7; margin-top:2px;"
									>LIKES</div
								>
							</div>
						</div>
					</div>
				</a>

				<div
					style="grid-column:span 1; background:var(--df-ink); color:white; border-radius:8px; padding:22px; display:flex; flex-direction:column; justify-content:space-between;"
				>
					<div style="font-family:var(--font-mono); font-size:11px; letter-spacing:0.08em; opacity:0.6;"
						>SHIPPED TODAY</div
					>
					<div>
						<div style="font-size:44px; font-weight:700; letter-spacing:-0.04em; line-height:1;">{versionsToday}</div>
						<div style="font-size:13px; opacity:0.75; margin-top:6px;"
							>new versions across the community</div
						>
					</div>
				</div>

				<a
					href="/leaderboard"
					style="grid-column:span 1; background:white; border-radius:8px; padding:20px; display:flex; flex-direction:column; box-shadow:var(--df-shadow-1);"
				>
					<div style="display:flex; align-items:center; gap:8px; margin-bottom:16px;">
						<TrophyIcon size={15} color="currentColor" weight="regular" />
						<span
							style="font-family:var(--font-mono); font-size:11px; letter-spacing:0.08em; color:var(--df-muted);"
							>THIS WEEK</span
						>
					</div>
					{#each topRows as t}
						<div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
							<span
								style="font-family:var(--font-mono); font-size:11.5px; color:var(--df-muted); width:12px; flex-shrink:0;"
								>{t.rank}</span
							>
							<Avatar name={t.user.name} size={26} />
							<span
								style="font-size:12.5px; font-weight:500; flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;"
								>{t.user.name}</span
							>
							<span style="font-size:12px; font-weight:600; color:var(--df-muted);">{t.totalLikes}</span>
						</div>
					{:else}
						<div style="font-size:12.5px; color:var(--df-muted); margin-bottom:12px;">No likes yet this week.</div>
					{/each}
					<div
						style="font-size:12.5px; font-weight:500; color:var(--df-accent); margin-top:auto;"
						>Full leaderboard →</div
					>
				</a>

				<a
					href="/roasts"
					style="grid-column:span 2; align-self:start; background:white; border-radius:8px; padding:22px 24px; display:flex; flex-direction:column; box-shadow:var(--df-shadow-1);"
				>
					<div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
						<span
							style="font-family:var(--font-mono); font-size:11px; letter-spacing:0.08em; color:var(--df-muted);"
							>FRESH ROAST</span
						>
					</div>
					{#if freshRoast}
						<div
							style="font-size:15px; line-height:1.6; font-weight:500; margin-bottom:14px; text-wrap:pretty;"
							>"{freshRoast.body}"</div
						>
						<div
							style="border-top:1px solid var(--df-ink-soft); padding-top:14px; display:flex; align-items:center; gap:10px;"
						>
							<span style="font-size:12.5px; color:var(--df-muted);"
								>on {freshRoast.portfolio.title}</span
							>
							<span
								style="font-size:12.5px; font-weight:500; color:var(--df-accent); margin-left:auto;"
								>More roasts →</span
							>
						</div>
					{:else}
						<div style="font-size:14px; color:var(--df-muted);">No roasts posted yet — be the first to leave one.</div>
					{/if}
				</a>

				{#each posts as post}
					<a
						href={`/post/${post.id}`}
						style="grid-column:span 1; background:white; border-radius:8px; overflow:hidden; display:flex; flex-direction:column; box-shadow:var(--df-shadow-1);"
					>
						<div style="position:relative;">
							<Screenshot
								src={post.latestVersion.screenshotUrl}
								alt="Screenshot"
								shape="rect"
								style="width:100%; height:170px; display:block;"
							/>
							<div
								style="position:absolute; top:12px; right:12px; background:rgba(255,255,255,0.94); font-family:var(--font-mono); font-size:11px; font-weight:500; padding:5px 11px; border-radius:999px;"
								>{post.latestVersion.label}</div
							>
						</div>
						<div style="padding:16px 18px 16px 18px; display:flex; flex-direction:column; flex:1;">
							<div
								style="font-size:14.5px; font-weight:600; letter-spacing:-0.02em; margin-bottom:3px;"
								>{post.title}</div
							>
							<div style="font-size:12.5px; color:var(--df-muted); margin-bottom:14px;"
								>{post.user.name} · {timeAgo(post.latestVersion.createdAt)}</div
							>
							<div
								style="display:flex; align-items:center; gap:14px; margin-top:auto; color:var(--df-muted);"
							>
								<div style="display:flex; align-items:center; gap:5px;">
									<HeartIcon size={14} color="currentColor" weight="regular" />
									<span style="font-size:12.5px; font-weight:500;">{post.likeCount}</span>
								</div>
								<div style="display:flex; align-items:center; gap:5px;">
									<ChatTextIcon size={14} color="currentColor" weight="regular" />
									<span style="font-size:12.5px; font-weight:500;">{post.commentCount}</span>
								</div>
								<div
									style="margin-left:auto; font-family:var(--font-mono); font-size:11.5px; font-weight:500;"
									>{ratingLabel(post.latestVersion.uiRating)}</div
								>
							</div>
						</div>
					</a>
				{/each}

				<a
					href="/ai-studio"
					style="grid-column:span 2; background:var(--df-ink); color:white; border-radius:8px; padding:24px; display:flex; align-items:center; gap:22px;"
				>
					<div style="flex:1; min-width:0;">
						<div style="font-size:17px; font-weight:700; letter-spacing:-0.02em; margin-bottom:5px;"
							>Run your portfolio through AI Studio</div
						>
						<div style="font-size:13.5px; line-height:1.55; opacity:0.75;"
							>Roast, feedback or suggestions in seconds, before the community sees it.</div
						>
					</div>
					<div
						style="width:38px; height:38px; border-radius:50%; background:white; color:var(--df-ink); display:flex; align-items:center; justify-content:center; flex-shrink:0;"
					>
						<ArrowRightIcon size={15} color="currentColor" weight="bold" />
					</div>
				</a>
			</div>
		{/if}
	</div>
</div>

<style>
	.page-container {
		max-width: 1320px;
		margin: 0 auto;
		padding: 56px 48px 64px 48px;
	}
	.feed-header {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 0.52fr);
		gap: 48px;
		align-items: end;
		margin-bottom: 30px;
	}
	@media (max-width: 900px) {
		.page-container {
			padding: 32px 24px 48px 24px;
		}
		.feed-header {
			grid-template-columns: 1fr;
			align-items: start;
			gap: 16px;
		}
	}
	@media (max-width: 640px) {
		.page-container {
			padding: 24px 16px 40px 16px;
		}
	}
	@media (max-width: 720px) {
		.feed-grid {
			grid-template-columns: 1fr !important;
		}
		.feed-grid > :global(*) {
			grid-column: span 1 !important;
			grid-row: span 1 !important;
		}
	}
	@media (min-width: 721px) and (max-width: 1080px) {
		.feed-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
		}
	}
</style>

