<script lang="ts">
	import AppChrome from '$lib/components/AppChrome.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import landingBg from '$lib/assets/landing1.jpg';
	import {
		PaperPlaneTiltIcon,
		LinkSimpleIcon
	} from 'phosphor-svelte';
	import Screenshot from '$lib/components/Screenshot.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/auth.svelte';
	import { apiFetch, ApiError } from '$lib/api';
	import type { PortfolioSummary } from '$lib/types';

	const ink = 'var(--df-ink)';
	const line = 'var(--df-line)';
	const muted = 'var(--df-muted)';
	const accent = 'var(--df-accent)';
	const accentDeep = 'var(--df-accent-deep)';

	let url = $state('');
	let title = $state('');
	let writeup = $state('');
	let kind = $state<'New version' | 'First post'>('New version');
	let charMax = 600;
	let remaining = $derived(charMax - writeup.length);
	let urlTouched = $derived(url.length > 0);

	let myPortfolios = $state<PortfolioSummary[]>([]);
	let selectedPortfolioId = $state<number | null>(null);
	let loadingPortfolios = $state(true);
	let submitting = $state(false);
	let submitError = $state('');

	const selectedPortfolio = $derived(myPortfolios.find((p) => p.id === selectedPortfolioId) ?? null);

	$effect(() => {
		auth.requireAuth();
	});

	$effect(() => {
		if (!auth.isAuthenticated) return;
		loadingPortfolios = true;
		apiFetch<PortfolioSummary[]>('/portfolios?mine=true&limit=100')
			.then((list) => {
				myPortfolios = list;
				const requested = Number(page.url.searchParams.get('portfolioId'));
				if (requested && list.some((p) => p.id === requested)) {
					selectedPortfolioId = requested;
				} else if (list.length > 0) {
					selectedPortfolioId = list[0].id;
				} else {
					kind = 'First post';
				}
			})
			.catch(() => {})
			.finally(() => (loadingPortfolios = false));
	});

	async function submit() {
		submitError = '';
		if (kind === 'First post' && !title.trim()) {
			submitError = 'Give your project a name first.';
			return;
		}
		if (kind === 'New version' && !selectedPortfolioId) {
			submitError = 'Pick which portfolio this version belongs to.';
			return;
		}
		submitting = true;
		try {
			if (kind === 'First post') {
				const created = await apiFetch<{ id: number }>('/portfolios', {
					method: 'POST',
					body: { title: title.trim(), note: writeup.trim(), projectUrl: url.trim() }
				});
				goto(`/post/${created.id}`);
			} else {
				await apiFetch(`/portfolios/${selectedPortfolioId}/versions`, {
					method: 'POST',
					body: { note: writeup.trim(), projectUrl: url.trim() }
				});
				goto(`/post/${selectedPortfolioId}`);
			}
		} catch (err) {
			submitError = err instanceof ApiError ? err.message : 'Could not publish that post.';
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head><title>Upload — DevFolio</title></svelte:head>

<div style="width:100%; min-height:100vh; background:var(--df-bg); color:var(--df-ink); padding-left:76px;">
	<AppChrome active="upload" initials={auth.user?.initials} />

	<div class="page-container">
		<div style="display:flex; align-items:center; gap:14px; margin-bottom:8px;">
			<Avatar name={auth.user?.name ?? ''} size={44} />
			<div>
				<div style="font-size:14px; font-weight:600;">Posting as</div>
				<div class="mono" style="font-size:12px; color:var(--df-muted);">@{auth.user?.username ?? ''}</div>
			</div>
		</div>

		<div
			style="font-size:clamp(26px, 3.4vw, 36px); font-weight:700; letter-spacing:-0.04em; line-height:1.05; margin-bottom:14px;"
		>
			Share a portfolio<br />the community will love.
		</div>
		<p style="font-size:15px; line-height:1.6; color:var(--df-muted); max-width:520px; margin:0 0 30px 0; text-wrap:pretty;">
			Every post is a <strong style="color:var(--df-ink);">portfolio</strong>. New versions stay
			grouped on the same post, so a portfolio grows with you.
		</p>

		<div class="upload-layout" style="display:grid; grid-template-columns:170px minmax(0,1fr); gap:26px; align-items:start;">
			<div style="display:flex; flex-direction:column; gap:10px;">
				<button
					type="button"
					onclick={() => (kind = 'New version')}
					disabled={myPortfolios.length === 0}
					class="mono"
					style="font-family:inherit; text-align:left; background:{kind === 'New version' ? ink : 'white'}; color:{kind === 'New version' ? 'white' : ink}; border:1px solid {kind === 'New version' ? ink : line}; border-radius:999px; padding:11px 16px; font-size:11.5px; font-weight:500; cursor:pointer; opacity:{myPortfolios.length === 0 ? 0.45 : 1};"
				>New version</button>
				<button
					type="button"
					onclick={() => (kind = 'First post')}
					class="mono"
					style="font-family:inherit; text-align:left; background:{kind === 'First post' ? ink : 'white'}; color:{kind === 'First post' ? 'white' : ink}; border:1px solid {kind === 'First post' ? ink : line}; border-radius:999px; padding:11px 16px; font-size:11.5px; font-weight:500; cursor:pointer;"
				>First post</button>
			</div>

			<div>
				<div style="position:relative; border-radius:8px; border:1px solid var(--df-line); overflow:hidden; margin-bottom:24px;">
				<img
					src={landingBg}
					alt=""
					style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; pointer-events:none;"
				/>
				<div style="position:relative; z-index:1; background:rgba(255,255,255,0.82); backdrop-filter:blur(2px); padding:38px 32px; text-align:center;">
					<div style="font-size:18px; font-weight:700; margin-bottom:4px;">Link your project</div>
					<div style="font-size:13.5px; color:var(--df-muted); margin-bottom:20px; max-width:380px; margin-left:auto; margin-right:auto;"
						>Drop the live URL. Screenshot auto-capture is on our roadmap — for now we'll pair it with a placeholder cover.</div
					>
					<div style="max-width:480px; margin:0 auto; display:flex; gap:10px; align-items:center;">
						<div style="flex:1; position:relative;">
							<LinkSimpleIcon
								size={15}
								color={urlTouched ? accentDeep : muted}
								style="position:absolute; left:14px; top:50%; transform:translateY(-50%);"
							/>
							<input
								id="project-url"
								bind:value={url}
								placeholder="https://yourapp.com"
								style="width:100%; background:white; border:1px solid {urlTouched ? accent : line}; border-radius:8px; padding:13px 16px 13px 40px; font-size:14px; outline:none; color:inherit;"
							/>
						</div>
					</div>
				</div>
			</div>

				{#if kind === 'First post'}
					<div style="margin-bottom:18px;">
						<label
							class="mono"
							for="title"
							style="display:block; font-size:11px; letter-spacing:0.08em; color:var(--df-muted); margin-bottom:8px;"
							>PROJECT NAME</label
						>
						<input
							id="title"
							bind:value={title}
							placeholder="What's it called?"
							style="width:100%; box-sizing:border-box; background:white; border:1px solid var(--df-line); border-radius:12px; padding:13px 16px; font-size:14px; outline:none; color:inherit;"
						/>
					</div>
				{/if}

				<div style="margin-bottom:18px;">
					<div style="display:flex; align-items:center; justify-content:space-between;">
						<label
							class="mono"
							for="writeup"
							style="display:block; font-size:11px; letter-spacing:0.08em; color:var(--df-muted); margin-bottom:8px;"
							>WRITE-UP</label
						>
						<span
							class="mono"
							style="font-size:11px; color:{remaining < 100 ? accentDeep : muted}; margin-bottom:8px;"
							>{remaining}</span
						>
					</div>
					<textarea
						id="writeup"
						bind:value={writeup}
						maxlength={charMax}
						placeholder="What makes this version special? What did you change?"
						rows={5}
						style="width:100%; background:white; border:1px solid var(--df-line); border-radius:12px; padding:13px 16px; font-size:14px; line-height:1.6; outline:none; color:inherit; resize:vertical;"
					></textarea>
				</div>

				{#if kind === 'New version'}
					<div style="margin-bottom:22px;">
						<div
							class="mono"
							style="display:block; font-size:11px; letter-spacing:0.08em; color:var(--df-muted); margin-bottom:8px;"
							>ATTACHED TO POST</div
						>
						{#if loadingPortfolios}
							<div style="font-size:13px; color:var(--df-muted);">Loading your portfolios…</div>
						{:else if myPortfolios.length === 0}
							<div style="font-size:13px; color:var(--df-muted);">You don't have a portfolio yet — switch to "First post".</div>
						{:else}
							<div style="display:flex; align-items:center; gap:12px;">
								{#if selectedPortfolio}
									<Screenshot
										src={selectedPortfolio.latestVersion.screenshotUrl}
										alt=""
										shape="rounded"
										radius={9}
										style="width:60px; height:46px; flex-shrink:0;"
									/>
								{/if}
								<select
									bind:value={selectedPortfolioId}
									style="flex:1; min-width:0; background:white; border:1px solid var(--df-line); border-radius:10px; padding:11px 14px; font-size:13.5px; outline:none; color:inherit;"
								>
									{#each myPortfolios as p}
										<option value={p.id}>{p.title} · {p.latestVersion.label} · {p.versionCount} version{p.versionCount === 1 ? '' : 's'}</option>
									{/each}
								</select>
							</div>
						{/if}
					</div>
				{/if}

				{#if submitError}
					<div style="color:var(--df-red); font-size:13px; margin-bottom:16px;">{submitError}</div>
				{/if}

				<div style="display:flex; gap:12px; flex-wrap:wrap;">
					<button
						type="button"
						onclick={submit}
						disabled={submitting}
						style="font-family:inherit; display:flex; align-items:center; gap:10px; background:var(--df-ink); color:white; border:none; border-radius:999px; padding:13px 26px; font-size:14px; font-weight:600; cursor:pointer; opacity:{submitting ? 0.6 : 1};"
					>
						{submitting ? 'Publishing…' : 'Publish post'}
						<PaperPlaneTiltIcon size={14} color="currentColor" weight="regular" />
					</button>
				</div>

				<div
					class="mono"
					style="margin-top:16px; font-size:11px; color:var(--df-muted); line-height:1.7;"
					>PEER REVIEW FIRST.<br />THEN IMPROVE.</div
				>
			</div>
		</div>
	</div>
</div>

<style>
	.page-container {
		max-width: 900px;
		margin: 0 auto;
		padding: 56px 40px 64px 40px;
	}
	@media (max-width: 720px) {
		.page-container {
			padding: 32px 20px 48px 20px;
		}
		.upload-layout {
			grid-template-columns: 1fr !important;
		}
		.upload-layout > :global(:first-child) {
			flex-direction: row !important;
		}
	}
</style>

