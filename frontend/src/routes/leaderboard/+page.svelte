<script lang="ts">
	import AppChrome from '$lib/components/AppChrome.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import Screenshot from '$lib/components/Screenshot.svelte';
	import { ChartLineUpIcon, StackIcon, HeartIcon, ArrowRightIcon, CodeSimpleIcon, CaretRightIcon } from 'phosphor-svelte';
	import { auth } from '$lib/auth.svelte';
	import { apiFetch, ApiError } from '$lib/api';
	import type { LeaderboardRow } from '$lib/types';

	const ink = 'var(--df-ink)';
	const line = 'var(--df-line)';
	const muted = 'var(--df-muted)';
	const soft = 'var(--df-ink-soft)';
	const accent = 'var(--df-accent)';
	const warm = 'var(--df-warm)';

	let timeframe = $state('Weekly');
	let category = $state('All');
	let rows = $state<LeaderboardRow[]>([]);
	let topStack = $state<{ stack: string; developerCount: number } | null>(null);
	let loading = $state(true);
	let errorMsg = $state('');

	const timeframes = ['Weekly', 'Monthly', 'All Time'];
	const timeframeParams: Record<string, string> = { Weekly: 'weekly', Monthly: 'monthly', 'All Time': 'alltime' };

	const categories = ['All', 'Frontend', 'Backend', 'Mobile', 'Design Systems', 'AI Tools', 'UI/UX'];

	const medals: Record<number, { bg: string; color: string }> = {
		1: { bg: 'oklch(0.7288 0.1150 84.3842)', color: 'white' },
		2: { bg: line, color: ink },
		3: { bg: warm, color: 'white' }
	};

	$effect(() => {
		auth.requireAuth();
	});

	async function load() {
		loading = true;
		errorMsg = '';
		try {
			const params = new URLSearchParams({ timeframe: timeframeParams[timeframe], limit: '20' });
			if (category !== 'All') params.set('category', category);
			const [board, stack] = await Promise.all([
				apiFetch<LeaderboardRow[]>(`/leaderboard?${params}`),
				apiFetch<{ stack: string; developerCount: number }>('/leaderboard/top-stack')
			]);
			rows = board;
			topStack = stack;
		} catch (err) {
			errorMsg = err instanceof ApiError ? err.message : 'Could not load the leaderboard.';
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		timeframe;
		category;
		load();
	});

	const topDev = $derived(rows[0]);
</script>

<svelte:head><title>Leaderboard — DevFolio</title></svelte:head>

<div style="width:100%; min-height:100vh; background:var(--df-bg); color:var(--df-ink); padding-left:76px;">
	<AppChrome active="leaderboard" initials={auth.user?.initials} />

	<div class="page-container">
		<div class="board-header">
			<div>
				<div
					style="font-family:var(--font-mono); font-size:12px; font-weight:500; letter-spacing:0.1em; color:var(--df-muted); margin-bottom:14px;"
					>TOP DEVELOPERS</div
				>
				<div
					style="font-size:clamp(26px, 3.4vw, 36px); font-weight:700; line-height:1.02; letter-spacing:-0.04em; margin-bottom:16px; text-wrap:pretty;"
					>The best. Right now.</div
				>
				<div style="font-size:15.5px; line-height:1.6; color:var(--df-muted); max-width:400px;"
					>Ranked by total likes across every version posted. Weekly, monthly, all time.</div
				>
			</div>
			<div style="display:flex; align-items:center; justify-content:flex-end; gap:20px;">
				<div
					style="width:132px; height:132px; border-radius:12px; background:var(--df-ink); display:flex; align-items:center; justify-content:center; "
				>
					<ChartLineUpIcon size={48} color="white" weight="regular" />
				</div>
				<div
					style="font-family:var(--font-mono); font-size:12.5px; line-height:1.7; color:var(--df-muted); max-width:150px;"
					>GREAT WORK<br />GETS NOTICED.</div
				>
			</div>
		</div>

		<div style="display:flex; gap:8px; margin-bottom:24px;">
			{#each timeframes as label}
				<button
					type="button"
					onclick={() => (timeframe = label)}
					style="font-family:inherit; background:{timeframe === label ? ink : 'white'}; color:{timeframe === label ? 'white' : ink}; border:1px solid {timeframe === label ? ink : line}; font-size:13.5px; font-weight:500; padding:10px 22px; border-radius:999px; cursor:pointer; white-space:nowrap;"
					>{label}</button
				>
			{/each}
		</div>

		<div class="board-layout" style="display:grid; grid-template-columns:212px minmax(0,1fr) 300px; gap:22px; align-items:start;">
			<div
				style="background:white; border-radius:8px; padding:10px; box-shadow:var(--df-shadow-1);"
			>
				{#each categories as c}
					<button
						type="button"
						onclick={() => (category = c)}
						style="font-family:inherit; width:100%; display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:8px; cursor:pointer; background:{category === c ? ink : 'transparent'}; color:{category === c ? 'white' : ink}; border:none; margin-bottom:2px; text-align:left;"
					>
						<span style="font-size:13.5px; font-weight:500; flex:1;">{c}</span>
						<CaretRightIcon
							size={13}
							color="currentColor"
							style="opacity:{category === c ? 1 : 0};"
						/>
					</button>
				{/each}
				<div style="border-top:1px solid var(--df-line); margin:10px 4px 0 4px; padding:18px 10px 10px 10px;">
					<div style="font-size:13.5px; font-weight:600; margin-bottom:4px;">Want to be here?</div>
					<div style="font-size:12px; color:var(--df-muted); margin-bottom:14px;"
						>Build. Share. Get noticed.</div
					>
					<a
						href="/upload"
						style="display:flex; align-items:center; justify-content:center; width:32px; height:32px; border-radius:50%; background:var(--df-ink); color:white;"
					>
						<ArrowRightIcon size={14} color="currentColor" weight="regular" />
					</a>
				</div>
			</div>

			<div
				class="board-rows"
				style="background:white; border-radius:8px; overflow:hidden; box-shadow:var(--df-shadow-1);"
			>
				{#if loading}
					<div style="padding:60px 0; text-align:center; color:var(--df-muted);">Loading…</div>
				{:else if errorMsg}
					<div style="padding:40px; text-align:center; color:var(--df-red);">{errorMsg}</div>
				{:else if rows.length === 0}
					<div style="padding:60px 24px; text-align:center; color:var(--df-muted);">No ranked developers yet.</div>
				{:else}
					{#each rows as r}
						<div
							class="board-row"
							style="display:flex; align-items:center; gap:16px; padding:14px 20px; border-bottom:1px solid var(--df-ink-soft);"
						>
							<div
								style="width:32px; height:32px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; background:{medals[r.rank] ? medals[r.rank].bg : soft}; color:{medals[r.rank] ? medals[r.rank].color : muted};"
								>{r.rank}</div
							>
							<Avatar name={r.user.name} size={44} />
							<div style="width:150px; flex-shrink:0;">
								<div style="font-size:14px; font-weight:600; letter-spacing:-0.015em;">{r.user.name}</div>
								<div style="font-size:12.5px; color:var(--df-muted);">{r.user.role}</div>
							</div>
							<div style="display:flex; align-items:center; gap:6px; flex:1; min-width:0;">
								{#if r.recentScreenshots[0]}
									<Screenshot
										src={r.recentScreenshots[0]}
										alt=""
										shape="rounded"
										radius={7}
										style="width:66px; height:44px; flex-shrink:0;"
									/>
								{/if}
								{#if r.recentScreenshots[1]}
									<Screenshot
										src={r.recentScreenshots[1]}
										alt=""
										shape="rounded"
										radius={7}
										style="width:44px; height:44px; flex-shrink:0;"
									/>
								{/if}
								{#if r.morePortfolios > 0}
									<div
										style="width:38px; height:44px; border-radius:7px; background:var(--df-ink); color:white; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600; flex-shrink:0;"
										>+{r.morePortfolios}</div
									>
								{/if}
							</div>
							<div style="width:76px; flex-shrink:0; text-align:center;">
								<div style="display:flex; align-items:center; justify-content:center; gap:5px;">
									<HeartIcon size={13} color="var(--df-muted)" weight="regular" />
									<span style="font-size:13px; font-weight:600;">{r.totalLikes}</span>
								</div>
								<div style="font-size:11px; color:var(--df-muted); margin-top:2px;">Total likes</div>
							</div>
							<div style="width:76px; flex-shrink:0; text-align:center;">
								<div style="display:flex; align-items:center; justify-content:center; gap:5px;">
									<StackIcon size={13} color="var(--df-muted)" weight="regular" />
									<span style="font-size:13px; font-weight:600;">{r.versionCount}</span>
								</div>
								<div style="font-size:11px; color:var(--df-muted); margin-top:2px;">Versions</div>
							</div>
							<a
								href={`/post/${r.topPortfolioId}`}
								class="mono"
								style="display:flex; align-items:center; gap:7px; border:1px solid var(--df-line); border-radius:999px; padding:8px 15px; font-size:12.5px; font-weight:500; flex-shrink:0; color:var(--df-ink);"
							>
								View
								<ArrowRightIcon size={12} color="currentColor" weight="regular" />
							</a>
						</div>
					{/each}
				{/if}
			</div>

			<div style="display:flex; flex-direction:column; gap:16px;">
				<div style="background:white; border-radius:8px; padding:20px; box-shadow:var(--df-shadow-1);">
					<div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:18px;">
						<span style="font-size:13.5px; font-weight:600;">Top Developer</span>
						<a href="/profile" style="font-size:12px; color:var(--df-muted);">View all →</a>
					</div>
					{#if topDev}
						<div style="display:flex; align-items:center; gap:12px; margin-bottom:14px;">
							<Avatar name={topDev.user.name} size={48} />
							<div>
								<div style="font-size:14.5px; font-weight:600; letter-spacing:-0.015em;">{topDev.user.name}</div>
								<div style="font-size:12.5px; color:var(--df-muted);">{topDev.user.role}</div>
							</div>
						</div>
						<div
							style="font-size:13px; line-height:1.55; color:var(--df-muted); margin-bottom:18px;"
							>{topDev.user.bio ?? ''}</div
						>
						<div style="display:flex; gap:24px; margin-bottom:18px;">
							<div>
								<div style="font-size:15px; font-weight:700;">{topDev.totalLikes}</div>
								<div style="font-size:11.5px; color:var(--df-muted);">Total likes</div>
							</div>
							<div>
								<div style="font-size:15px; font-weight:700;">{topDev.versionCount}</div>
								<div style="font-size:11.5px; color:var(--df-muted);">Versions</div>
							</div>
						</div>
						{#if topDev.recentScreenshots[0]}
							<div style="position:relative; border-radius:12px; overflow:hidden;">
								<Screenshot
									src={topDev.recentScreenshots[0]}
									alt="Latest version"
									shape="rect"
									style="width:100%; height:140px; display:block;"
								/>
								<a
									href={`/post/${topDev.topPortfolioId}`}
									style="position:absolute; bottom:12px; right:12px; display:flex; align-items:center; gap:8px; background:rgba(255,255,255,0.94); border-radius:999px; padding:7px 8px 7px 14px; font-size:12px; font-weight:600; color:var(--df-ink);"
								>
									View portfolio
									<span
										style="width:22px; height:22px; border-radius:50%; background:var(--df-ink); color:white; display:flex; align-items:center; justify-content:center;"
									>
										<ArrowRightIcon size={11} color="currentColor" weight="bold" />
									</span>
								</a>
							</div>
						{/if}
					{:else}
						<div style="font-size:13px; color:var(--df-muted);">Nobody ranked yet.</div>
					{/if}
				</div>

				{#if topStack}
					<div style="background:white; border-radius:8px; padding:20px; box-shadow:var(--df-shadow-1);">
						<div style="display:flex; align-items:center; gap:8px; margin-bottom:16px;">
							<ChartLineUpIcon size={15} color="var(--df-ink)" weight="regular" />
							<span style="font-size:13.5px; font-weight:600;">Most rated stack</span>
						</div>
						<a href="/explore" style="display:flex; align-items:center; gap:12px; color:var(--df-ink);">
							<div
								style="width:40px; height:40px; border-radius:10px; background:var(--df-ink-soft); display:flex; align-items:center; justify-content:center; flex-shrink:0;"
							>
								<CodeSimpleIcon size={18} color="var(--df-ink)" weight="regular" />
							</div>
							<div style="flex:1;">
								<div style="font-size:13.5px; font-weight:600;">{topStack.stack}</div>
								<div style="font-size:12px; color:var(--df-muted);">{topStack.developerCount} developers</div>
							</div>
							<CaretRightIcon size={14} color="var(--df-muted)" weight="regular" />
						</a>
					</div>
				{/if}

				<div style="background:white; border-radius:8px; padding:22px; box-shadow:var(--df-shadow-1);">
					<div style="font-size:13.5px; font-weight:600; margin-bottom:6px;">How the board works</div>
					<div style="font-size:13px; line-height:1.6; color:var(--df-muted);"
						>Every like on your versions counts toward your rank. Boards reset weekly; all-time
						rankings carry your full history.</div
					>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.page-container {
		max-width: 1360px;
		margin: 0 auto;
		padding: 56px 48px 64px 48px;
	}
	.board-header {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 0.62fr);
		gap: 48px;
		align-items: center;
		margin-bottom: 34px;
	}
	@media (max-width: 900px) {
		.page-container {
			padding: 32px 24px 48px 24px;
		}
		.board-header {
			grid-template-columns: 1fr;
		}
		.board-layout {
			grid-template-columns: 1fr !important;
		}
	}
	@media (max-width: 640px) {
		.page-container {
			padding: 24px 16px 40px 16px;
		}
	}
	@media (max-width: 760px) {
		.board-rows {
			overflow-x: auto;
		}
		.board-row {
			min-width: 640px;
		}
	}
</style>

