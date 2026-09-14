<script lang="ts">
	import AppChrome from '$lib/components/AppChrome.svelte';
	import {
		FlameIcon,
		ChatCircleIcon,
		LightbulbIcon,
		CheckIcon,
		XIcon,
		CaretRightIcon
	} from 'phosphor-svelte';
	import { auth } from '$lib/auth.svelte';
	import { apiFetch, ApiError } from '$lib/api';
	import type { PortfolioSummary } from '$lib/types';

	const ink = 'var(--df-ink)';
	const line = 'var(--df-line)';
	const muted = 'var(--df-muted)';
	const accent = 'var(--df-accent)';
	const green = 'oklch(0.5406 0.0773 152.7118)';
	const red = 'var(--df-red)';
	const bg = 'var(--df-bg)';

	const modeMeta = {
		roast: { name: 'Roast', Icon: FlameIcon, accent: red, blurb: 'Brutal' },
		feedback: { name: 'Feedback', Icon: ChatCircleIcon, accent: accent, blurb: 'Balanced' },
		suggestions: { name: 'Suggestions', Icon: LightbulbIcon, accent: green, blurb: 'Actionable' }
	} as const;

	const samples = [
		{ Icon: FlameIcon, label: 'ROAST', text: '"Your hero has three competing headlines and none of them win."', dark: true },
		{ Icon: ChatCircleIcon, label: 'FEEDBACK', text: '"Strong typographic rhythm. Secondary text contrast is a touch low."', dark: false },
		{ Icon: LightbulbIcon, label: 'SUGGESTIONS', text: '"Add empty and loading states; they round out the case study."', dark: true },
		{ Icon: FlameIcon, label: 'ROAST', text: '"Local-first is cool, but your empty state is a gray box."', dark: false }
	];

	let projects = $state<PortfolioSummary[]>([]);
	let loadingProjects = $state(true);
	let aiMode = $state<keyof typeof modeMeta>('feedback');
	let aiProjectId = $state<number | null>(null);
	let prompt = $state('');
	let toast = $state<string | null>(null);
	let generating = $state(false);
	let generateError = $state('');

	type Msg = { mode: keyof typeof modeMeta; project: string; portfolioId: number; text: string; saved: boolean; shared: boolean };
	let messages = $state<Msg[]>([]);

	const selectedProject = $derived(projects.find((p) => p.id === aiProjectId) ?? null);

	$effect(() => {
		auth.requireAuth();
	});

	$effect(() => {
		if (!auth.isAuthenticated) return;
		loadingProjects = true;
		apiFetch<PortfolioSummary[]>('/portfolios?mine=true&limit=50')
			.then((list) => {
				projects = list;
				if (list.length > 0) aiProjectId = list[0].id;
			})
			.catch(() => {})
			.finally(() => (loadingProjects = false));
	});

	async function sendAi() {
		if (!selectedProject) return;
		generateError = '';
		generating = true;
		try {
			const res = await apiFetch<{ text: string }>('/ai/generate', {
				method: 'POST',
				body: { portfolioId: selectedProject.id, mode: aiMode, prompt }
			});
			messages = [
				{
					mode: aiMode,
					project: `${selectedProject.title} ${selectedProject.latestVersion.label}`,
					portfolioId: selectedProject.id,
					text: res.text,
					saved: false,
					shared: false
				},
				...messages
			];
			prompt = '';
		} catch (err) {
			generateError = err instanceof ApiError ? err.message : 'Could not reach AI Studio.';
		} finally {
			generating = false;
		}
	}

	function toggleSave(m: Msg) {
		m.saved = !m.saved;
	}

	async function share(m: Msg) {
		if (m.shared) return;
		try {
			await apiFetch('/ai/share', { method: 'POST', body: { portfolioId: m.portfolioId, mode: m.mode, text: m.text } });
			m.shared = true;
			toast = 'Shared to Community Roasts!';
			setTimeout(() => (toast = null), 2600);
		} catch (err) {
			toast = err instanceof ApiError ? err.message : 'Could not share that.';
			setTimeout(() => (toast = null), 3200);
		}
	}
</script>

<svelte:head><title>AI Studio — DevFolio</title></svelte:head>

<div style="width:100%; min-height:100vh; background:var(--df-bg); color:var(--df-ink); padding-left:76px;">
	<AppChrome active="aistudio" initials={auth.user?.initials} />

	<div class="page-container">
		<div class="studio-hero">
			<div style="min-width:0;">
				<div
					style="display:inline-flex; align-items:center; gap:8px; background:white; border:1px solid var(--df-line); border-radius:999px; padding:8px 16px; margin-bottom:22px;"
				>
					<span style="font-size:12.5px; font-weight:600; color:var(--df-accent);">AI Studio</span>
					<span
						style="background:var(--df-accent-soft); color:var(--df-accent-deep); font-size:10.5px; font-weight:600; padding:3px 8px; border-radius:999px;"
						>Beta</span
					>
				</div>
				<div
					style="font-size:clamp(26px, 3.4vw, 36px); font-weight:700; line-height:1.03; letter-spacing:-0.04em; margin-bottom:18px; text-wrap:pretty;"
					>Your portfolio.<br /><span style="color:var(--df-accent);">Reviewed in seconds.</span></div
				>
				<div
					style="font-size:16px; line-height:1.6; color:var(--df-muted);"
					>Pick a portfolio, choose how blunt you want it, and let AI critique your UI, UX and code
					before the community does.</div
				>
			</div>

			<div style="display:flex; align-items:center; justify-content:flex-end; gap:16px; min-width:0;">
				<div style="display:flex; align-items:center; flex-shrink:0;">
					<div
						style="width:70px; flex-shrink:0; height:98px; border-radius:8px; background:white; border:1px solid var(--df-line); transform:rotate(-8deg); margin-right:-20px; "
					></div>
					<div
						style="width:112px; flex-shrink:0; height:132px; border-radius:8px; background:var(--df-ink); position:relative; z-index:1; "
					>
						<div style="padding:14px; display:flex; flex-direction:column; justify-content:space-between; height:100%; box-sizing:border-box;">
							<div style="font-size:12.5px; font-weight:600; color:white; line-height:1.3;"
								>Frontend<br />Developer</div
							>
							<div
								style="width:26px; height:26px; border-radius:50%; background:rgba(255,255,255,0.16); display:flex; align-items:center; justify-content:center;"
							>
								<CaretRightIcon size={12} color="white" weight="bold" />
							</div>
						</div>
					</div>
					<div
						style="width:70px; flex-shrink:0; height:98px; border-radius:8px; background:white; border:1px solid var(--df-line); transform:rotate(8deg); margin-left:-20px; "
					></div>
				</div>
				<div
					class="mono"
					style="font-size:12px; line-height:1.7; color:var(--df-muted); width:104px; flex-shrink:0;"
					>LESS GUESSING.<br />MORE SHIPPING.</div
				>
			</div>
		</div>

		<div class="studio-layout" style="display:grid; grid-template-columns:minmax(0,1fr) 270px; gap:22px; align-items:start;">
			<div style="min-width:0;">
				<div style="background:white; border-radius:8px; overflow:hidden; box-shadow:var(--df-shadow-2);">
					<div style="padding:24px 26px 22px 26px; border-bottom:1px solid var(--df-ink-soft);">
						<div style="font-size:13.5px; font-weight:600; margin-bottom:14px;"
							>Select a portfolio</div
						>
						{#if loadingProjects}
							<div style="font-size:13px; color:var(--df-muted);">Loading your portfolios…</div>
						{:else if projects.length === 0}
							<div style="font-size:13px; color:var(--df-muted);"
								>You haven't posted a portfolio yet. <a href="/upload" style="color:var(--df-accent); font-weight:600;">Post one</a> to run it through AI Studio.</div
							>
						{:else}
							<div style="display:flex; gap:10px; flex-wrap:wrap;">
								{#each projects as p}
									<button
										type="button"
										onclick={() => (aiProjectId = p.id)}
										style="font-family:inherit; display:flex; align-items:center; gap:9px; padding:11px 18px; border-radius:999px; font-size:13px; font-weight:500; cursor:pointer; background:{aiProjectId === p.id ? ink : 'white'}; color:{aiProjectId === p.id ? 'white' : ink}; border:1px solid {aiProjectId === p.id ? ink : line}; white-space:nowrap;"
									>
										<span class="mono" style="font-size:11px; opacity:0.7;">{p.latestVersion.label}</span>
										{p.title}
									</button>
								{/each}
							</div>
						{/if}
					</div>

					<div style="padding:24px 26px 22px 26px; border-bottom:1px solid var(--df-ink-soft);">
						<div style="font-size:13.5px; font-weight:600; margin-bottom:14px;">Choose a mode</div>
						<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:12px;">
							{#each Object.entries(modeMeta) as [mode, meta]}
								<button
									type="button"
									onclick={() => (aiMode = mode as keyof typeof modeMeta)}
									style="font-family:inherit; display:flex; align-items:center; gap:12px; padding:14px 16px; border-radius:8px; cursor:pointer; background:{aiMode === mode ? bg : 'white'}; border:1.5px solid {aiMode === mode ? ink : line}; text-align:left;"
								>
									<div
										style="width:36px; height:36px; border-radius:10px; background:{meta.accent}; display:flex; align-items:center; justify-content:center; flex-shrink:0;"
									>
										<meta.Icon size={17} color="white" weight="regular" />
									</div>
									<div style="min-width:0;">
										<div style="font-size:13.5px; font-weight:600;">{meta.name}</div>
										<div style="font-size:11.5px; color:var(--df-muted); white-space:nowrap;">{meta.blurb}</div>
									</div>
								</button>
							{/each}
						</div>
					</div>

					<div style="padding:20px 22px;">
						<div
							style="display:flex; align-items:center; gap:14px; background:var(--df-bg); border-radius:8px; padding:8px 8px 8px 20px;"
						>
							<input
								bind:value={prompt}
								placeholder="Anything specific to look at? (e.g. 'focus on the mobile nav')"
								style="flex:1; min-width:0; border:none; outline:none; background:transparent; font-size:14px; color:inherit;"
							/>
							<button
								type="button"
								onclick={sendAi}
								disabled={generating || !selectedProject}
								style="font-family:inherit; display:flex; align-items:center; gap:10px; background:var(--df-ink); color:white; padding:14px 24px; border:none; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; white-space:nowrap; flex-shrink:0; opacity:{generating || !selectedProject ? 0.6 : 1};"
							>
								{generating ? 'Generating…' : 'Generate'}
								<CaretRightIcon size={15} color="currentColor" weight="bold" />
							</button>
						</div>
						{#if generateError}
							<div style="color:var(--df-red); font-size:12.5px; margin-top:12px;">{generateError}</div>
						{/if}
					</div>
				</div>

				{#each messages as m}
					{@const meta = modeMeta[m.mode]}
					<div style="background:white; border-radius:8px; padding:22px 24px; margin-top:16px; box-shadow:var(--df-shadow-1);">
						<div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
							<div style="display:flex; align-items:center; gap:10px;">
								<meta.Icon size={15} color={meta.accent} weight="regular" />
								<span style="font-size:13px; font-weight:600;">{meta.name}</span>
								<span class="mono" style="font-size:11.5px; color:var(--df-muted);">{m.project}</span>
							</div>
							<div style="display:flex; gap:14px;">
								<button
									type="button"
									onclick={() => toggleSave(m)}
									style="font-family:inherit; background:none; border:none; cursor:pointer; font-size:12.5px; font-weight:500; display:flex; align-items:center; gap:5px; color:{m.saved ? green : muted};"
								>
									{#if m.saved}<CheckIcon size={13} color="currentColor" weight="bold" />{/if}
									{m.saved ? 'Saved' : 'Save'}
								</button>
								<button
									type="button"
									onclick={() => share(m)}
									style="font-family:inherit; background:none; border:none; cursor:pointer; font-size:12.5px; font-weight:500; display:flex; align-items:center; gap:5px; color:{m.shared ? green : accent};"
								>
									{#if m.shared}<CheckIcon size={13} color="currentColor" weight="bold" />{/if}
									{m.shared ? 'Shared' : 'Share as roast'}
								</button>
							</div>
						</div>
						<div style="font-size:14.5px; line-height:1.65;">{m.text}</div>
					</div>
				{/each}

				<div style="margin-top:34px; border-top:1px solid var(--df-line); padding-top:20px;">
					<div style="font-size:14.5px; line-height:1.7; color:var(--df-muted); max-width:580px;">
						It runs in seconds, not a week of waiting for comments. Point it at one screen, one
						flow, or your whole stack, and keep the result private, save it, or post it to
						Community Roasts.
					</div>
				</div>
			</div>

			<div style="background:white; border-radius:8px; padding:18px; box-shadow:var(--df-shadow-1);">
				<a href="/roasts" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; color:var(--df-ink);">
					<span style="font-size:13.5px; font-weight:600;">See it in action</span>
					<CaretRightIcon size={14} color="var(--df-muted)" weight="regular" />
				</a>
				{#each samples as s}
					<div
						style="background:{s.dark ? ink : bg}; color:{s.dark ? 'white' : ink}; border-radius:8px; padding:14px 16px; margin-bottom:10px;"
					>
						<div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
							<s.Icon size={13} color="currentColor" weight="regular" />
							<span class="mono" style="font-size:10.5px; letter-spacing:0.06em; opacity:0.7;"
								>{s.label}</span
							>
						</div>
						<div style="font-size:12.5px; line-height:1.5;">{s.text}</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	{#if toast}
		<div
			style="position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:var(--df-ink); color:white; padding:13px 22px; border-radius:999px; font-size:13px; font-weight:500; display:flex; align-items:center; gap:14px; z-index:30;"
		>
			<span>{toast}</span>
			<button type="button" onclick={() => (toast = null)} aria-label="Dismiss" style="background:none; border:none; cursor:pointer; color:white; opacity:0.6; display:flex; align-items:center; padding:0;">
				<XIcon size={12} color="currentColor" weight="bold" />
			</button>
		</div>
	{/if}
</div>

<style>
	.page-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 56px 48px 64px 48px;
	}
	.studio-hero {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 348px;
		gap: 48px;
		align-items: center;
		margin-bottom: 34px;
	}
	@media (max-width: 900px) {
		.page-container {
			padding: 32px 24px 48px 24px;
		}
		.studio-hero {
			grid-template-columns: 1fr;
		}
		.studio-hero > :global(*:last-child) {
			justify-content: flex-start;
		}
		.studio-layout {
			grid-template-columns: 1fr !important;
		}
	}
	@media (max-width: 640px) {
		.page-container {
			padding: 24px 16px 40px 16px;
		}
	}
</style>

