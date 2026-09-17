<script lang="ts">
	import AppChrome from '$lib/components/AppChrome.svelte';
	import Screenshot from '$lib/components/Screenshot.svelte';
	import {
		HeartIcon,
		ChatCircleIcon,
		StarIcon,
		CheckIcon,
		UserPlusIcon,
		TrophyIcon,
		ArrowRightIcon,
		ChartBarIcon
	} from 'phosphor-svelte';
	import { auth } from '$lib/auth.svelte';
	import { apiFetch, ApiError } from '$lib/api';
	import { timeAgo } from '$lib/format';
	import type { Notification } from '$lib/types';

	const ink = 'var(--df-ink)';
	const line = 'var(--df-line)';
	const muted = 'var(--df-muted)';
	const soft = 'var(--df-ink-soft)';
	const accent = 'var(--df-accent)';
	const accentSoft = 'var(--df-accent-soft)';

	let filter = $state('All');
	const filters = ['All', 'Unread'];

	let notifications = $state<Notification[]>([]);
	let loading = $state(true);
	let errorMsg = $state('');
	let updating = $state(false);

	$effect(() => {
		auth.requireAuth();
	});

	async function load() {
		loading = true;
		errorMsg = '';
		try {
			notifications = await apiFetch<Notification[]>('/notifications');
		} catch (err) {
			errorMsg = err instanceof ApiError ? err.message : 'Could not load notifications.';
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		if (auth.isAuthenticated) load();
	});

	const shown = $derived(filter === 'Unread' ? notifications.filter((n) => !n.read) : notifications);
	const counts = $derived(notifications.filter((n) => !n.read).length);
	const dayMs = 24 * 60 * 60 * 1000;
	const today = $derived(shown.filter((n) => Date.now() - new Date(n.createdAt).getTime() < dayMs));
	const earlier = $derived(shown.filter((n) => Date.now() - new Date(n.createdAt).getTime() >= dayMs));

	async function markAllRead() {
		if (counts === 0 || updating) return;
		const previous = notifications;
		notifications = notifications.map((n) => ({ ...n, read: true }));
		updating = true;
		try {
			await apiFetch('/notifications/read-all', { method: 'POST' });
		} catch (err) {
			notifications = previous;
			errorMsg = err instanceof ApiError ? err.message : 'Could not update notifications.';
		} finally {
			updating = false;
		}
	}

	async function openNotification(event: MouseEvent, notification: Notification) {
		event.preventDefault();
		const destination = event.currentTarget instanceof HTMLAnchorElement ? event.currentTarget.href : '/notifications';
		if (!notification.read) {
			const previous = notifications;
			notifications = notifications.map((n) => (n.id === notification.id ? { ...n, read: true } : n));
			try {
				await apiFetch(`/notifications/${notification.id}/read`, { method: 'POST' });
			} catch {
				notifications = previous;
			}
		}
		window.location.assign(destination);
	}

	const icons: Record<Notification['kind'], typeof HeartIcon> = {
		like: HeartIcon,
		comment: ChatCircleIcon,
		roast: ChatCircleIcon,
		rank: TrophyIcon,
		system: StarIcon
	};
</script>

<svelte:head><title>Notifications — DevFolio</title></svelte:head>

<div style="width:100%; min-height:100vh; background:var(--df-bg); color:var(--df-ink); padding-left:76px;">
	<AppChrome active="notifications" initials={auth.user?.initials} />

	<div class="page-container">
		<div
			class="notif-header"
			style="display:flex; align-items:end; justify-content:space-between; gap:24px; margin-bottom:16px; flex-wrap:wrap;"
		>
			<div>
				<div
					style="font-size:clamp(24px, 3.2vw, 32px); font-weight:700; line-height:1.05; letter-spacing:-0.04em; margin-bottom:8px;"
					>Notifications</div
				>
				<div style="font-size:14px; color:var(--df-muted);">{counts} unread</div>
			</div>
			<button
				type="button"
				onclick={markAllRead}
				disabled={counts === 0 || updating}
				class="mono"
				style="display:flex; align-items:center; gap:8px; border:1px solid var(--df-line); background:white; color:var(--df-ink); border-radius:999px; padding:10px 18px; font-size:12px; font-weight:500; cursor:pointer; white-space:nowrap;"
			>
				<CheckIcon size={13} color="currentColor" weight="regular" />
				{updating ? 'Marking…' : 'Mark all read'}
			</button>
		</div>

		<div style="display:flex; gap:8px; margin-bottom:26px;">
			{#each filters as f}
				<button
					type="button"
					onclick={() => (filter = f)}
					style="font-family:inherit; background:{filter === f ? ink : 'white'}; color:{filter === f ? 'white' : ink}; border:1px solid {filter === f ? ink : line}; font-size:13px; font-weight:500; padding:9px 18px; border-radius:999px; cursor:pointer;"
					>{f}</button
				>
			{/each}
		</div>

		{#if loading}
			<div style="padding:60px 0; text-align:center; color:var(--df-muted);">Loading…</div>
		{:else if errorMsg}
			<div style="background:white; border-radius:8px; padding:40px; text-align:center; color:var(--df-red);">{errorMsg}</div>
		{:else if shown.length === 0}
			<div
				style="background:white; border-radius:8px; padding:48px 24px; text-align:center; color:var(--df-muted); box-shadow:var(--df-shadow-1);"
			>
				You're all caught up.
			</div>
		{:else}
			<div>
				{#if today.length > 0}
					<div
						style="font-family:var(--font-mono); font-size:11px; letter-spacing:0.1em; color:var(--df-muted); margin-bottom:12px;"
						>TODAY</div
					>
					{#each today as n}
						{@const Icon = icons[n.kind]}
						<a
							href={n.portfolio ? `/post/${n.portfolio.id}` : '/notifications'}
							onclick={(event) => openNotification(event, n)}
							aria-label={`Open notification: ${n.message}`}
							style="color:inherit; background:white; border-radius:8px; padding:16px 18px; margin-bottom:12px; display:flex; gap:14px; align-items:center; box-shadow:var(--df-shadow-1);"
						>
							<div
								style="width:40px; height:40px; border-radius:12px; background:{n.read ? soft : accentSoft}; display:flex; align-items:center; justify-content:center; flex-shrink:0;"
							>
								<Icon size={17} color={n.read ? muted : accent} weight="regular" />
							</div>
							<div style="flex:1; min-width:0;">
								<div style="font-size:13.5px; line-height:1.5; text-wrap:pretty;">
									<strong>{n.actor?.name ?? 'DevFolio'}</strong> <span class="notif-muted">{n.message}</span>
								</div>
								{#if n.portfolio}
									<span
										style="font-size:12px; color:var(--df-accent-deep); margin-top:3px; display:inline-flex; align-items:center; gap:5px;"
										>{n.portfolio.title} <ArrowRightIcon size={10} color="currentColor" weight="bold" /></span
									>
								{/if}
							</div>
							<span class="mono" style="font-size:11px; color:var(--df-muted); flex-shrink:0;">{timeAgo(n.createdAt)}</span>
						</a>
					{/each}
				{/if}

				{#if earlier.length > 0}
					<div
						style="font-family:var(--font-mono); font-size:11px; letter-spacing:0.1em; color:var(--df-muted); margin:26px 0 12px 0;"
						>EARLIER</div
					>
					{#each earlier as n}
						{@const Icon = icons[n.kind]}
						<a
							href={n.portfolio ? `/post/${n.portfolio.id}` : '/notifications'}
							onclick={(event) => openNotification(event, n)}
							aria-label={`Open notification: ${n.message}`}
							style="color:inherit; background:white; border-radius:8px; padding:16px 18px; margin-bottom:12px; display:flex; gap:14px; align-items:center; box-shadow:var(--df-shadow-1);"
						>
							<div
								style="width:40px; height:40px; border-radius:12px; background:{n.read ? soft : accentSoft}; display:flex; align-items:center; justify-content:center; flex-shrink:0;"
							>
								<Icon size={17} color={n.read ? muted : accent} weight="regular" />
							</div>
							<div style="flex:1; min-width:0;">
								<div style="font-size:13.5px; line-height:1.5; text-wrap:pretty;">
									<strong>{n.actor?.name ?? 'DevFolio'}</strong> <span class="notif-muted">{n.message}</span>
								</div>
								{#if n.portfolio}
									<span
										style="font-size:12px; color:var(--df-accent-deep); margin-top:3px; display:inline-flex; align-items:center; gap:5px;"
										>{n.portfolio.title} <ArrowRightIcon size={10} color="currentColor" weight="bold" /></span
									>
								{/if}
							</div>
							<span class="mono" style="font-size:11px; color:var(--df-muted); flex-shrink:0;">{timeAgo(n.createdAt)}</span>
						</a>
					{/each}
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.page-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 56px 40px 64px 40px;
		--hd-offset: 76px;
	}
	.notif-header {
		position: sticky;
		top: 0;
		z-index: 6;
		background: var(--df-bg);
		padding: var(--hd-offset) 0 16px;
		margin-top: calc(-1 * (var(--hd-offset) - 20px));
		box-shadow: 0 1px 0 0 var(--df-line);
	}
	@media (max-width: 640px) {
		.page-container {
			padding: 28px 16px 40px 16px;
			--hd-offset: 56px;
		}
	}
</style>
