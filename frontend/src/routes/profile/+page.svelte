<script lang="ts">
	import AppChrome from '$lib/components/AppChrome.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import Screenshot from '$lib/components/Screenshot.svelte';
	import {
		MapPinIcon,
		GithubLogoIcon,
		LinkedinLogoIcon,
		XLogoIcon,
		LinkSimpleIcon,
		MagnifyingGlassIcon,
		FunnelIcon,
		CaretDownIcon,
		HeartIcon,
		ChatTextIcon,
		ArrowRightIcon,
		SquaresFourIcon,
		SignOutIcon
	} from 'phosphor-svelte';
	import { auth } from '$lib/auth.svelte';
	import { apiFetch, ApiError } from '$lib/api';
	import type { PortfolioSummary, Roast, UserPublic, UserStats } from '$lib/types';

	const ink = 'var(--df-ink)';
	const line = 'var(--df-line)';
	const muted = 'var(--df-muted)';
	const soft = 'var(--df-ink-soft)';

	let tab = $state('Portfolios');
	let sortIndex = $state(0);
	let search = $state('');

	const tabs = [
		{ label: 'Portfolios', title: 'Your Portfolios', sub: "Every portfolio you've posted, with its full version history." },
		{ label: 'Feedback', title: 'Feedback Received', sub: 'What other developers said about your work.' },
		{ label: 'Settings', title: 'Settings', sub: 'Profile, links and notification preferences.' }
	];
	const sorts = ['Recently posted', 'Most liked', 'Most versions'];

	let profile = $state<UserPublic | null>(null);
	let stats = $state<UserStats | null>(null);
	let myProjects = $state<PortfolioSummary[]>([]);
	let myRoasts = $state<Roast[]>([]);
	let loading = $state(true);
	let errorMsg = $state('');

	// Settings form
	let form = $state({ name: '', bio: '', location: '', role: '', githubUrl: '', linkedinUrl: '', twitterUrl: '', websiteUrl: '' });
	let saving = $state(false);
	let saveMessage = $state('');

	const activeTab = $derived(tabs.find((t) => t.label === tab) ?? tabs[0]);
	const sortLabel = $derived(sorts[sortIndex]);
	const visibleProjects = $derived(
		[...myProjects]
			.filter((p) => !search.trim() || p.title.toLowerCase().includes(search.trim().toLowerCase()))
			.sort((a, b) => {
				if (sortIndex === 1) return b.likeCount - a.likeCount;
				if (sortIndex === 2) return b.versionCount - a.versionCount;
				return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
			})
	);

	$effect(() => {
		auth.requireAuth();
	});

	async function load() {
		loading = true;
		errorMsg = '';
		try {
			const [me, projects] = await Promise.all([
				apiFetch<{ user: UserPublic; stats: UserStats }>('/users/me'),
				apiFetch<PortfolioSummary[]>('/portfolios?mine=true&limit=100')
			]);
			profile = me.user;
			stats = me.stats;
			form = {
				name: me.user.name ?? '',
				bio: me.user.bio ?? '',
				location: me.user.location ?? '',
				role: me.user.role ?? '',
				githubUrl: me.user.githubUrl ?? '',
				linkedinUrl: me.user.linkedinUrl ?? '',
				twitterUrl: me.user.twitterUrl ?? '',
				websiteUrl: me.user.websiteUrl ?? ''
			};
			myProjects = projects;

			const myIds = new Set(projects.map((p) => p.id));
			const roasts = await apiFetch<Roast[]>('/roasts?sort=new&limit=100');
			myRoasts = roasts.filter((r) => myIds.has(r.portfolio.id));
		} catch (err) {
			errorMsg = err instanceof ApiError ? err.message : 'Could not load your profile.';
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		if (auth.isAuthenticated) load();
	});

	async function saveSettings() {
		saving = true;
		saveMessage = '';
		try {
			const updated = await apiFetch<UserPublic>('/users/me', { method: 'PATCH', body: form });
			profile = updated;
			if (auth.user) auth.user = updated;
			saveMessage = 'Saved.';
			setTimeout(() => (saveMessage = ''), 2400);
		} catch (err) {
			saveMessage = err instanceof ApiError ? err.message : 'Could not save changes.';
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head><title>Profile — DevFolio</title></svelte:head>

<div style="width:100%; min-height:100vh; background:var(--df-bg); color:var(--df-ink); padding-left:76px;">
	<AppChrome active="profile" initials={auth.user?.initials} />

	<div class="page-container">
		{#if loading && !profile}
			<div style="padding:80px 0; text-align:center; color:var(--df-muted);">Loading your profile…</div>
		{:else if errorMsg && !profile}
			<div style="background:white; border-radius:8px; padding:40px; text-align:center; color:var(--df-red);">{errorMsg}</div>
		{:else if profile && stats}
			<div
				class="profile-card"
				style="background:white; border-radius:8px; border:1px solid var(--df-line); padding:30px 32px; margin-bottom:22px; display:grid; grid-template-columns:minmax(0,1fr) 400px; gap:40px; align-items:start; "
			>
				<div style="display:flex; gap:26px; min-width:0;">
					<Avatar name={profile.name} size={88} style="flex-shrink:0;" />
					<div style="min-width:0;">
						<div style="font-size:28px; font-weight:700; letter-spacing:-0.035em; line-height:1.1;"
							>{profile.name}</div
						>
						<div style="font-size:14px; color:var(--df-muted); margin-bottom:12px;">@{profile.username}</div>
						{#if profile.bio}
							<div
								style="font-size:14.5px; line-height:1.6; margin-bottom:14px; max-width:420px; text-wrap:pretty;"
								>{profile.bio}</div
							>
						{/if}
						{#if profile.location}
							<div
								style="display:flex; align-items:center; gap:7px; font-size:13px; color:var(--df-muted); margin-bottom:16px;"
							>
								<MapPinIcon size={14} color="currentColor" weight="regular" />
								{profile.location}
							</div>
						{/if}
						<div style="display:flex; gap:10px;">
							{#if profile.githubUrl}
								<a href={profile.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub" style="width:34px; height:34px; border-radius:10px; border:1px solid var(--df-line); display:flex; align-items:center; justify-content:center; color:var(--df-ink);"><GithubLogoIcon size={15} /></a>
							{/if}
							{#if profile.linkedinUrl}
								<a href={profile.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn" style="width:34px; height:34px; border-radius:10px; border:1px solid var(--df-line); display:flex; align-items:center; justify-content:center; color:var(--df-ink);"><LinkedinLogoIcon size={15} /></a>
							{/if}
							{#if profile.twitterUrl}
								<a href={profile.twitterUrl} target="_blank" rel="noreferrer" aria-label="Twitter / X" style="width:34px; height:34px; border-radius:10px; border:1px solid var(--df-line); display:flex; align-items:center; justify-content:center; color:var(--df-ink);"><XLogoIcon size={14} /></a>
							{/if}
							{#if profile.websiteUrl}
								<a href={profile.websiteUrl} target="_blank" rel="noreferrer" aria-label="Website" style="width:34px; height:34px; border-radius:10px; border:1px solid var(--df-line); display:flex; align-items:center; justify-content:center; color:var(--df-ink);"><LinkSimpleIcon size={15} /></a>
							{/if}
						</div>
					</div>
				</div>

				<div>
					<div
						style="display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); border:1px solid var(--df-line); border-radius:8px; overflow:hidden; margin-bottom:16px;"
					>
						<div style="padding:18px 16px; border-right:1px solid var(--df-line);">
							<div style="font-size:24px; font-weight:700; letter-spacing:-0.03em;">{stats.portfolioCount}</div>
							<div style="font-size:11.5px; color:var(--df-muted); margin-top:3px;">Portfolios</div>
						</div>
						<div style="padding:18px 16px; border-right:1px solid var(--df-line);">
							<div style="font-size:24px; font-weight:700; letter-spacing:-0.03em;">{stats.totalLikes}</div>
							<div style="font-size:11.5px; color:var(--df-muted); margin-top:3px;">Total likes</div>
						</div>
						<div style="padding:18px 16px;">
							<div style="font-size:24px; font-weight:700; letter-spacing:-0.03em;">{stats.rank > 0 ? `#${stats.rank}` : '—'}</div>
							<div style="font-size:11.5px; color:var(--df-muted); margin-top:3px;">Rank</div>
						</div>
					</div>
					<a
						href="/upload"
						style="display:flex; align-items:center; gap:14px; background:var(--df-accent-soft); border-radius:8px; padding:16px 18px; color:var(--df-accent-deep);"
					>
						<div style="flex:1; min-width:0;">
							<div style="font-size:13.5px; font-weight:600; margin-bottom:2px;">Keep shipping.</div>
							<div style="font-size:12.5px; line-height:1.5;">Post a new version and climb the board.</div>
						</div>
						<ArrowRightIcon size={15} color="currentColor" style="flex-shrink:0;" />
					</a>
				</div>
			</div>

			<div style="display:flex; gap:8px; margin-bottom:28px; border-bottom:1px solid var(--df-line); padding-bottom:18px;">
				{#each tabs as t}
					<button
						type="button"
						onclick={() => (tab = t.label)}
						style="font-family:inherit; display:flex; align-items:center; gap:9px; background:{tab === t.label ? ink : 'white'}; color:{tab === t.label ? 'white' : ink}; border:1px solid {tab === t.label ? ink : line}; font-size:13px; font-weight:500; padding:10px 20px; border-radius:999px; cursor:pointer; white-space:nowrap;"
					>
						{t.label}
					</button>
				{/each}
			</div>

			{#if tab === 'Settings'}
				<div style="max-width:640px; background:white; border-radius:8px; padding:28px 30px; box-shadow:var(--df-shadow-1);">
					<div style="font-size:20px; font-weight:700; margin-bottom:4px;">{activeTab.title}</div>
					<div style="font-size:13px; color:var(--df-muted); margin-bottom:24px;">{activeTab.sub}</div>

					<div class="settings-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
						<label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color:var(--df-muted); font-weight:600;">
							Name
							<input bind:value={form.name} style="padding:11px 12px; border-radius:8px; border:1px solid var(--df-line); font-size:13.5px; outline:none;" />
						</label>
						<label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color:var(--df-muted); font-weight:600;">
							Role
							<input bind:value={form.role} placeholder="Frontend Developer" style="padding:11px 12px; border-radius:8px; border:1px solid var(--df-line); font-size:13.5px; outline:none;" />
						</label>
					</div>
					<label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color:var(--df-muted); font-weight:600; margin-bottom:16px;">
						Bio
						<textarea bind:value={form.bio} rows={3} style="padding:11px 12px; border-radius:8px; border:1px solid var(--df-line); font-size:13.5px; outline:none; resize:vertical; font-family:inherit;"></textarea>
					</label>
					<label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color:var(--df-muted); font-weight:600; margin-bottom:16px;">
						Location
						<input bind:value={form.location} style="padding:11px 12px; border-radius:8px; border:1px solid var(--df-line); font-size:13.5px; outline:none;" />
					</label>
					<div class="settings-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px;">
						<label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color:var(--df-muted); font-weight:600;">
							GitHub URL
							<input bind:value={form.githubUrl} style="padding:11px 12px; border-radius:8px; border:1px solid var(--df-line); font-size:13.5px; outline:none;" />
						</label>
						<label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color:var(--df-muted); font-weight:600;">
							LinkedIn URL
							<input bind:value={form.linkedinUrl} style="padding:11px 12px; border-radius:8px; border:1px solid var(--df-line); font-size:13.5px; outline:none;" />
						</label>
						<label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color:var(--df-muted); font-weight:600;">
							Twitter / X URL
							<input bind:value={form.twitterUrl} style="padding:11px 12px; border-radius:8px; border:1px solid var(--df-line); font-size:13.5px; outline:none;" />
						</label>
						<label style="display:flex; flex-direction:column; gap:6px; font-size:12px; color:var(--df-muted); font-weight:600;">
							Website URL
							<input bind:value={form.websiteUrl} style="padding:11px 12px; border-radius:8px; border:1px solid var(--df-line); font-size:13.5px; outline:none;" />
						</label>
					</div>

					<div style="display:flex; align-items:center; gap:14px;">
						<button
							type="button"
							onclick={saveSettings}
							disabled={saving}
							style="font-family:inherit; background:var(--df-ink); color:white; border:none; border-radius:999px; padding:12px 24px; font-size:13.5px; font-weight:600; cursor:pointer; opacity:{saving ? 0.6 : 1};"
							>{saving ? 'Saving…' : 'Save changes'}</button
						>
						{#if saveMessage}<span style="font-size:12.5px; color:var(--df-muted);">{saveMessage}</span>{/if}
					</div>

					<div style="border-top:1px solid var(--df-line); margin-top:26px; padding-top:20px;">
						<button
							type="button"
							onclick={() => auth.logout()}
							style="font-family:inherit; display:flex; align-items:center; gap:9px; background:white; color:var(--df-red); border:1px solid var(--df-line); border-radius:999px; padding:11px 20px; font-size:13px; font-weight:600; cursor:pointer;"
						>
							<SignOutIcon size={15} color="currentColor" weight="regular" />
							Log out
						</button>
					</div>
				</div>
			{:else if tab === 'Feedback'}
				<div style="max-width:760px; display:flex; flex-direction:column; gap:14px;">
					{#if myRoasts.length === 0}
						<div style="background:white; border-radius:8px; padding:48px 24px; text-align:center; color:var(--df-muted); box-shadow:var(--df-shadow-1);">
							No feedback yet — post a portfolio and share it around.
						</div>
					{:else}
						{#each myRoasts as r}
							<a href={`/post/${r.portfolio.id}`} style="display:block; color:inherit; background:white; border-radius:8px; padding:18px 20px; box-shadow:var(--df-shadow-1);">
								<div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
									<Avatar name={r.user.name} size={30} />
									<span style="font-size:13px; font-weight:600;">{r.user.name}</span>
									<span style="font-size:12px; color:var(--df-muted);">on {r.portfolio.title}</span>
								</div>
								<div style="font-size:13.5px; line-height:1.55; color:var(--df-muted);">{r.body}</div>
							</a>
						{/each}
					{/if}
				</div>
			{:else}
				<div class="profile-layout" style="display:grid; grid-template-columns:minmax(0,1fr) 250px; gap:26px; align-items:start;">
					<div>
						<div
							style="display:flex; align-items:end; justify-content:space-between; gap:24px; margin-bottom:22px; flex-wrap:wrap;"
						>
							<div>
								<div style="font-size:26px; font-weight:700; letter-spacing:-0.035em; margin-bottom:4px;"
									>{activeTab.title}</div
								>
								<div style="font-size:13.5px; color:var(--df-muted);">{activeTab.sub}</div>
							</div>
							<div style="display:flex; gap:10px;">
								<div
									style="display:flex; align-items:center; gap:10px; background:white; border:1px solid var(--df-line); border-radius:999px; padding:11px 18px;"
								>
									<MagnifyingGlassIcon size={15} color="var(--df-muted)" style="flex-shrink:0;" />
									<input
										bind:value={search}
										placeholder="Search your portfolios..."
										style="width:170px; border:none; outline:none; background:transparent; font-size:13px; color:inherit;"
									/>
								</div>
								<button
									type="button"
									onclick={() => (sortIndex = (sortIndex + 1) % sorts.length)}
									style="font-family:inherit; display:flex; align-items:center; gap:10px; background:white; border:1px solid var(--df-line); border-radius:999px; padding:11px 18px; cursor:pointer; white-space:nowrap; color:var(--df-ink);"
								>
									<FunnelIcon size={15} color="var(--df-muted)" />
									<span style="font-size:13px; font-weight:500;">{sortLabel}</span>
									<CaretDownIcon size={13} color="var(--df-muted)" />
								</button>
							</div>
						</div>

						{#if visibleProjects.length === 0}
							<div style="background:white; border-radius:8px; padding:48px 24px; text-align:center; color:var(--df-muted); box-shadow:var(--df-shadow-1);">
								{myProjects.length === 0 ? "You haven't posted a portfolio yet." : 'Nothing matches that search.'}
								{#if myProjects.length === 0}
									<div style="margin-top:10px;"><a href="/upload" style="color:var(--df-accent); font-weight:600;">Post your first one →</a></div>
								{/if}
							</div>
						{:else}
							<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:20px;">
								{#each visibleProjects as mp}
									<div style="background:white; border-radius:8px; overflow:hidden; box-shadow:var(--df-shadow-1);">
										<a href={`/post/${mp.id}`} style="position:relative; display:block; color:var(--df-ink);">
											<Screenshot
												src={mp.latestVersion.screenshotUrl}
												alt="Screenshot"
												shape="rect"
												style="width:100%; height:150px; display:block;"
											/>
											<div
												style="position:absolute; top:12px; right:12px; background:rgba(255,255,255,0.94); font-family:var(--font-mono); font-size:11px; font-weight:500; padding:5px 11px; border-radius:999px;"
												>{mp.latestVersion.label}</div
											>
										</a>
										<div style="padding:14px 16px;">
											<div
												style="font-size:14px; font-weight:600; letter-spacing:-0.02em; margin-bottom:12px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;"
												>{mp.title}</div
											>
											<div style="display:flex; align-items:center; gap:16px; color:var(--df-muted);">
												<div style="display:flex; align-items:center; gap:6px;">
													<HeartIcon size={14} color="currentColor" weight="regular" />
													<span style="font-size:12.5px; font-weight:500;">{mp.likeCount}</span>
												</div>
												<div style="display:flex; align-items:center; gap:6px;">
													<ChatTextIcon size={14} color="currentColor" weight="regular" />
													<span style="font-size:12.5px; font-weight:500;">{mp.commentCount}</span>
												</div>
												<a href={`/upload?portfolioId=${mp.id}`} class="mono" style="margin-left:auto; font-size:11px; font-weight:500; color:var(--df-accent);">+ version</a>
											</div>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>

					<div style="display:flex; flex-direction:column; gap:16px;">
						<div style="background:white; border-radius:8px; padding:16px; box-shadow:var(--df-shadow-1);">
							<div style="display:flex; align-items:center; gap:8px; padding:4px 8px 14px 8px;">
								<SquaresFourIcon size={15} color="currentColor" weight="regular" />
								<span style="font-size:13.5px; font-weight:600;">Quick links</span>
							</div>
							<a href="/upload" style="display:flex; align-items:center; gap:12px; padding:11px 12px; border-radius:11px; color:var(--df-ink);"><span style="font-size:13px; font-weight:500;">Post a portfolio</span></a>
							<a href="/roasts" style="display:flex; align-items:center; gap:12px; padding:11px 12px; border-radius:11px; color:var(--df-ink);"><span style="font-size:13px; font-weight:500;">Community feedback</span></a>
							<a href="/ai-studio" style="display:flex; align-items:center; gap:12px; padding:11px 12px; border-radius:11px; color:var(--df-ink);"><span style="font-size:13px; font-weight:500;">AI Studio</span></a>
							<button type="button" onclick={() => (tab = 'Settings')} style="font-family:inherit; width:100%; text-align:left; display:flex; align-items:center; gap:12px; padding:11px 12px; border-radius:11px; color:var(--df-ink); background:{soft}; border:none; cursor:pointer;"><span style="font-size:13px; font-weight:500;">Edit profile</span></button>
						</div>

						<div
							style="background:white; border-radius:8px; padding:24px 20px; text-align:center; box-shadow:var(--df-shadow-1);"
						>
							<div style="display:flex; justify-content:center; align-items:center; margin-bottom:18px;">
								<div style="width:46px; height:60px; border-radius:10px; background:var(--df-ink-soft); transform:rotate(-8deg); margin-right:-12px;"></div>
								<div style="width:52px; height:68px; border-radius:10px; background:var(--df-ink); position:relative; z-index:1;"></div>
								<div style="width:46px; height:60px; border-radius:10px; background:var(--df-ink-soft); transform:rotate(8deg); margin-left:-12px;"></div>
							</div>
							<div style="font-size:14px; font-weight:600; margin-bottom:6px;">Ship the next version</div>
							<div style="font-size:12.5px; line-height:1.55; color:var(--df-muted); margin-bottom:18px;"
								>Every update is a new version on the same portfolio.</div
							>
							<a
								href="/upload"
								style="display:inline-flex; align-items:center; gap:9px; background:var(--df-ink); color:white; padding:11px 20px; border-radius:999px; font-size:13px; font-weight:600;"
							>
								New version
								<ArrowRightIcon size={13} color="currentColor" weight="bold" />
							</a>
						</div>
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	.page-container {
		max-width: 1240px;
		margin: 0 auto;
		padding: 56px 48px 64px 48px;
	}
	@media (max-width: 900px) {
		.page-container {
			padding: 32px 24px 48px 24px;
		}
		.profile-card {
			grid-template-columns: 1fr !important;
		}
		.profile-layout {
			grid-template-columns: 1fr !important;
		}
	}
	@media (max-width: 640px) {
		.page-container {
			padding: 24px 16px 40px 16px;
		}
	}
	@media (max-width: 560px) {
		.settings-grid {
			grid-template-columns: 1fr !important;
		}
	}
</style>

