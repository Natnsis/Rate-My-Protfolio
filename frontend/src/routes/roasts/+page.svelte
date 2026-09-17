<script lang="ts">
	import AppChrome from '$lib/components/AppChrome.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import Screenshot from '$lib/components/Screenshot.svelte';
	import Markdown from '$lib/components/Markdown.svelte';
	import {
		FlameIcon,
		ArrowRightIcon,
		ChatCircleIcon,
		PaperPlaneTiltIcon,
		ChartBarIcon,
		ClockIcon
	} from 'phosphor-svelte';
	import { auth } from '$lib/auth.svelte';
	import { apiFetch, ApiError } from '$lib/api';
	import { timeAgo } from '$lib/format';
	import type { Roast, LeaderboardRow, PortfolioSummary } from '$lib/types';

	const ink = 'var(--df-ink)';
	const line = 'var(--df-line)';
	const muted = 'var(--df-muted)';
	const warm = 'var(--df-warm)';

	let roasts = $state<Roast[]>([]);
	let topDevs = $state<LeaderboardRow[]>([]);
	let loading = $state(true);
	let errorMsg = $state('');

	// Composer
	let myPortfolios = $state<PortfolioSummary[]>([]);
	let composerPortfolioId = $state<number | null>(null);
	let composerBody = $state('');
	let composerStars = $state(4);
	let posting = $state(false);
	let composerError = $state('');

	const tips = [
		{ title: 'Start with the top 3', body: 'Post one version at a time and improve it.' },
		{ title: 'Context matters', body: 'Explain the buttons. Nobody reads minds.' }
	];

	$effect(() => {
		auth.requireAuth();
	});

	async function load() {
		loading = true;
		errorMsg = '';
		try {
			const [list, board] = await Promise.all([
				apiFetch<Roast[]>(`/roasts?sort=top&limit=30`),
				apiFetch<LeaderboardRow[]>('/leaderboard?timeframe=alltime&limit=2')
			]);
			roasts = list;
			topDevs = board;
		} catch (err) {
			errorMsg = err instanceof ApiError ? err.message : 'Could not load Community Roasts.';
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		load();
	});

	$effect(() => {
		if (!auth.isAuthenticated) return;
		apiFetch<PortfolioSummary[]>('/portfolios?mine=true&limit=50')
			.then((list) => {
				myPortfolios = list;
				if (list.length > 0) composerPortfolioId = list[0].id;
			})
			.catch(() => {});
	});

	async function postRoast() {
		composerError = '';
		if (!composerPortfolioId) {
			composerError = 'Post a portfolio first before you can roast one.';
			return;
		}
		if (!composerBody.trim()) return;
		posting = true;
		try {
			const portfolio = myPortfolios.find((p) => p.id === composerPortfolioId);
			const created = await apiFetch<Roast>('/roasts', {
				method: 'POST',
				body: {
					portfolioId: composerPortfolioId,
					title: composerBody.trim().slice(0, 60),
					body: composerBody.trim(),
					stars: composerStars
				}
			});
			roasts = [created, ...roasts];
			composerBody = '';
		} catch (err) {
			composerError = err instanceof ApiError ? err.message : 'Could not post that roast.';
		} finally {
			posting = false;
		}
	}
</script>

<svelte:head><title>Community Roasts — DevFolio</title></svelte:head>

<div style="width:100%; min-height:100vh; background:var(--df-bg); color:var(--df-ink); padding-left:76px;">
	<AppChrome active="roasts" initials={auth.user?.initials} />

	<div class="page-container">
		<div
			class="roasts-hero"
			style="display:flex; align-items:end; justify-content:space-between; gap:32px; margin-bottom:22px; flex-wrap:wrap;"
		>
			<div>
				<div
					style="font-family:var(--font-mono); font-size:12px; font-weight:500; letter-spacing:0.1em; color:var(--df-muted); margin-bottom:12px;"
					>FEEDBACK WITHOUT EGO</div
				>
				<div
					style="font-size:clamp(26px, 3.4vw, 36px); font-weight:700; line-height:1.02; letter-spacing:-0.04em;"
					>Get roasted. Ship better.</div
				>
				<div style="font-size:15.5px; line-height:1.6; color:var(--df-muted); max-width:440px; margin-top:12px;"
					>Real developers review your portfolio like it's a PR: no filler, just signal.</div
				>
			</div>
			<a
				href="/upload"
				style="display:flex; align-items:center; gap:10px; background:var(--df-ink); color:white; padding:12px 22px; border-radius:999px; font-size:14px; font-weight:600; white-space:nowrap;"
			>
				Get feedback
				<ArrowRightIcon size={14} color="currentColor" weight="bold" />
			</a>
		</div>

		<div style="display:flex; align-items:center; gap:8px; margin-bottom:26px;">
			<ChartBarIcon size={15} color="var(--df-muted)" weight="regular" />
			<span style="font-size:13px; color:var(--df-muted);"
				>Top-liked feedback across the platform, sorted by helpful votes.</span
			>
		</div>

		<div class="roasts-layout" style="display:grid; grid-template-columns:minmax(0,1fr) 252px; gap:22px; align-items:start;">
			<div style="min-width:0;">
				<div
					style="background:white; border-radius:8px; padding:18px; margin-bottom:16px; box-shadow:var(--df-shadow-1);"
				>
					{#if myPortfolios.length > 0}
						<div style="display:flex; align-items:center; gap:10px; margin-bottom:12px; flex-wrap:wrap;">
							<select
								bind:value={composerPortfolioId}
								class="mono"
								style="background:var(--df-ink-soft); border:none; border-radius:999px; padding:8px 14px; font-size:12px; color:var(--df-ink); outline:none;"
							>
								{#each myPortfolios as p}
									<option value={p.id}>{p.title}</option>
								{/each}
							</select>
							<div style="display:flex; gap:2px;">
								{#each [1, 2, 3, 4, 5] as n}
									<button
										type="button"
										onclick={() => (composerStars = n)}
										aria-label={`${n} stars`}
										style="background:none; border:none; cursor:pointer; padding:2px; font-size:15px; color:{n <= composerStars ? warm : line};"
										>★</button
									>
								{/each}
							</div>
						</div>
					{/if}
					<div style="display:flex; gap:14px; align-items:center;">
						<div
							style="width:42px; height:42px; border-radius:12px; background:var(--df-ink-soft); display:flex; align-items:center; justify-content:center; flex-shrink:0;"
						>
							<ChatCircleIcon size={19} color="var(--df-ink)" weight="regular" />
						</div>
						<input
							bind:value={composerBody}
							onkeydown={(e) => e.key === 'Enter' && postRoast()}
							placeholder={myPortfolios.length > 0 ? 'Roast it: be honest, be kind' : 'Post a portfolio first to leave a roast'}
							disabled={myPortfolios.length === 0}
							style="flex:1; border:none; outline:none; background:transparent; font-size:14px; color:inherit;"
						/>
						<button
							type="button"
							aria-label="Send"
							onclick={postRoast}
							disabled={posting || myPortfolios.length === 0}
							style="width:38px; height:38px; border-radius:50%; background:var(--df-ink); color:white; display:flex; align-items:center; justify-content:center; border:none; cursor:pointer; flex-shrink:0; opacity:{posting ? 0.6 : 1};"
						>
							<PaperPlaneTiltIcon size={15} color="currentColor" weight="regular" />
						</button>
					</div>
					{#if composerError}
						<div style="color:var(--df-red); font-size:12.5px; margin-top:10px;">{composerError}</div>
					{/if}
				</div>

				{#if loading}
					<div style="padding:60px 0; text-align:center; color:var(--df-muted);">Loading roasts…</div>
				{:else if errorMsg}
					<div style="background:white; border-radius:8px; padding:40px; text-align:center; color:var(--df-red);"
						>{errorMsg}</div
					>
				{:else if roasts.length === 0}
					<div style="background:white; border-radius:8px; padding:60px 24px; text-align:center; color:var(--df-muted);">
						No roasts yet. Be the first to leave one.
					</div>
				{:else}
					{#each roasts as e}
						<a
							href={`/post/${e.portfolio.id}`}
							style="display:block; color:inherit; background:white; border-radius:8px; padding:18px; margin-bottom:16px; box-shadow:var(--df-shadow-1);"
						>
							<div style="display:flex; gap:12px; align-items:center; margin-bottom:14px;">
								<Avatar name={e.user.name} size={40} />
								<div style="min-width:0;">
									<div style="font-size:13.5px; font-weight:600;">{e.user.name}</div>
									<div style="font-size:12px; color:var(--df-muted);">{e.user.role}</div>
								</div>
								<div style="margin-left:auto; flex-shrink:0; display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
									{#if e.stars > 0}
										<div style="display:flex; gap:2px;">
											{#each Array(e.stars) as _}
												<span style="font-size:13px; color:var(--df-warm);">★</span>
											{/each}
										</div>
									{:else if e.aiGenerated}
										<span class="mono" style="font-size:10.5px; color:var(--df-accent); font-weight:700;">AI</span>
									{/if}
									<span class="mono" style="font-size:11px; color:var(--df-muted);">{timeAgo(e.createdAt)}</span>
								</div>
							</div>
							<div style="display:flex; gap:14px; align-items:flex-start;">
								{#if e.portfolio.screenshotUrl}
									<Screenshot
										src={e.portfolio.screenshotUrl}
										alt=""
										shape="rounded"
										radius={10}
										style="width:100px; height:72px; flex-shrink:0;"
									/>
								{/if}
								<div style="min-width:0;">
									<div style="font-size:14.5px; font-weight:600; letter-spacing:-0.015em; margin-bottom:6px;"
										>{e.title}</div
									>
									<div style="font-size:13.5px; color:var(--df-muted); margin:0 0 12px 0;">
										<Markdown text={e.body} />
									</div>
									<div style="display:flex; align-items:center; gap:16px;">
										<div style="display:flex; align-items:center; gap:5px; font-size:12.5px; color:var(--df-muted);">
											<ChartBarIcon size={14} color="currentColor" weight="regular" />
											On <strong style="color:var(--df-ink);">{e.portfolio.title}</strong>
										</div>
										<div style="display:flex; align-items:center; gap:5px; font-size:12.5px; color:var(--df-muted);">
											<ClockIcon size={14} color="currentColor" weight="regular" />
											{e.helpful} helpful
										</div>
									</div>
								</div>
							</div>
						</a>
					{/each}
				{/if}
			</div>

			<div style="display:flex; flex-direction:column; gap:16px;">
				<div style="background:white; border-radius:8px; padding:18px; box-shadow:var(--df-shadow-1);">
					<div style="display:flex; align-items:center; gap:8px; margin-bottom:14px;">
						<FlameIcon size={16} color="var(--df-warm)" weight="regular" />
						<span style="font-size:13.5px; font-weight:600;">Top devs</span>
					</div>
					{#each topDevs as d}
						<div style="display:flex; align-items:center; gap:10px; padding:8px 0;">
							<Avatar name={d.user.name} size={34} />
							<div style="flex:1; min-width:0;">
								<div style="font-size:12.5px; font-weight:600;">{d.user.name}</div>
								<div style="font-size:11.5px; color:var(--df-muted); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">{d.user.role}</div>
							</div>
							<span class="mono" style="font-size:11px; color:var(--df-muted);">{d.totalLikes} likes</span>
						</div>
					{:else}
						<div style="font-size:12.5px; color:var(--df-muted);">Nobody ranked yet.</div>
					{/each}
				</div>

				<div style="background:white; border-radius:8px; padding:18px; box-shadow:var(--df-shadow-1);">
					<div style="display:flex; align-items:center; gap:8px; margin-bottom:14px;">
						<span style="font-size:13.5px; font-weight:600;">Roast better</span>
					</div>
					{#each tips as t, i}
						<div style="padding:10px 0; border-top:1px solid var(--df-ink-soft);">
							<div style="display:flex; gap:10px; align-items:flex-start;">
								<span
									class="mono"
									style="font-size:11px; color:var(--df-muted); padding-top:2px;"
									>0{i + 1}</span
								>
								<div>
									<div style="font-size:13px; font-weight:600; margin-bottom:3px;">{t.title}</div>
									<div style="font-size:12.5px; line-height:1.5; color:var(--df-muted);">{t.body}</div>
								</div>
							</div>
						</div>
					{/each}
				</div>

				<a
					href="/profile"
					style="background:var(--df-ink); border-radius:8px; padding:20px; color:white;"
				>
					<div style="display:flex; align-items:center; gap:8px; margin-bottom:10px; color:white;">
						<ChatCircleIcon size={15} color="currentColor" weight="regular" />
						<span style="font-size:13px; font-weight:600;">Invite a friend</span>
					</div>
					<div style="font-size:12.5px; line-height:1.55; opacity:0.8; margin-bottom:14px;"
						>The best roasts come from people who know your field.</div
					>
					<span
						style="display:inline-flex; align-items:center; gap:8px; border:1px solid rgba(255,255,255,0.35); border-radius:999px; padding:9px 16px; font-size:12.5px; font-weight:500;"
					>
						Send invite
						<ArrowRightIcon size={12} color="currentColor" weight="bold" />
					</span>
				</a>
			</div>
		</div>
	</div>
</div>

<style>
	.page-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 56px 48px 64px 48px;
		--hd-offset: 76px;
	}
	.roasts-hero {
		position: sticky;
		top: 0;
		z-index: 6;
		background: var(--df-bg);
		padding: var(--hd-offset) 0 22px;
		margin-top: calc(-1 * (var(--hd-offset) - 20px));
		box-shadow: 0 1px 0 0 var(--df-line);
	}
	@media (max-width: 900px) {
		.page-container {
			padding: 32px 24px 48px 24px;
			--hd-offset: 60px;
		}
		.roasts-layout {
			grid-template-columns: 1fr !important;
		}
	}
	@media (max-width: 640px) {
		.page-container {
			padding: 24px 16px 40px 16px;
			--hd-offset: 56px;
		}
	}
</style>

