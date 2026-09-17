<script lang="ts">
	import {
		HouseIcon,
		CompassIcon,
		TrophyIcon,
		LightningIcon,
		ChatCircleIcon,
		UserIcon,
		BellIcon
	} from 'phosphor-svelte';

	import { apiFetch, getToken } from '$lib/api';
	import type { Notification } from '$lib/types';
	import { resolve } from '$app/paths';

	let {
		active = 'feed',
		initials = '··'
	}: {
		active?:
			| 'feed'
			| 'explore'
			| 'leaderboard'
			| 'aistudio'
			| 'roasts'
			| 'profile'
			| 'upload'
			| 'notifications';
		initials?: string;
	} = $props();

	let unread = $state(0);

	$effect(() => {
		if (!getToken()) return;
		let cancelled = false;
		apiFetch<Notification[]>('/notifications')
			.then((items) => {
				if (!cancelled) unread = items.filter((n) => !n.read).length;
			})
			.catch(() => {});
		return () => {
			cancelled = true;
		};
	});

	const railColor = 'var(--df-muted)';
	const railActiveBg = 'var(--df-accent-soft)';
	const railActiveColor = 'var(--df-accent-deep)';

	const items = [
		{ key: 'feed', href: '/feed', label: 'Feed', Icon: HouseIcon },
		{ key: 'explore', href: '/explore', label: 'Explore', Icon: CompassIcon },
		{ key: 'leaderboard', href: '/leaderboard', label: 'Leaderboard', Icon: TrophyIcon },
		{ key: 'aistudio', href: '/ai-studio', label: 'AI Studio', Icon: LightningIcon },
		{ key: 'roasts', href: '/roasts', label: 'Community Roasts', Icon: ChatCircleIcon }
	] as const;
</script>

<a
	href={resolve('/feed')}
	style="position:fixed; top:24px; left:28px; z-index:20; display:flex; align-items:center; gap:8px;"
>
	<div
		style="width:30px; height:30px; border-radius:8px; background:var(--df-accent); display:flex; align-items:center; justify-content:center; color:white; font-weight:800; font-size:14px;"
	>
		D
	</div>
	<span
		style="font-family:var(--font-mono); font-weight:500; font-size:15px; letter-spacing:-0.01em;"
		>/DEVFOLIO</span
	>
</a>

<div
	style="position:fixed; top:24px; right:28px; z-index:20; display:flex; align-items:center; gap:10px; background:white; border-radius:999px; padding:6px 6px 6px 14px; box-shadow:var(--df-shadow-pill);"
>
	<a
		href={resolve('/notifications')}
		style="position:relative; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center;"
	>
		<BellIcon size={16} color="var(--df-muted)" weight="regular" />
		{#if unread > 0}
			<span
				style="position:absolute; top:1px; right:2px; background:var(--df-red); color:white; font-size:9px; font-weight:700; min-width:13px; height:13px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white; padding:0 2px;"
				>{unread > 99 ? '99+' : unread}</span
			>
		{/if}
	</a>
	<a
		href={resolve('/upload')}
		style="background:var(--df-warm); color:white; padding:8px 16px; border-radius:999px; font-weight:600; font-size:13px; white-space:nowrap;"
	>
		+ New Post
	</a>
	<a href={resolve('/profile')}>
		<div
			style="width:34px; height:34px; border-radius:50%; background:var(--df-ink); color:white; display:flex; align-items:center; justify-content:center; font-size:12.5px; font-weight:600; letter-spacing:0.01em;"
		>
			{initials}
		</div>
	</a>
</div>

<div
	style="position:fixed; left:28px; top:50%; transform:translateY(-50%); z-index:20; display:flex; flex-direction:column; align-items:center; gap:6px; background:white; border-radius:12px; padding:10px 8px; box-shadow:var(--df-shadow-rail);"
>
	{#each items as { key, href, label, Icon } (key)}
		<a
			href={resolve(href)}
			title={label}
			style="width:40px; height:40px; border-radius:8px; display:flex; align-items:center; justify-content:center; background:{key ===
			active
				? railActiveBg
				: 'transparent'}; color:{key === active ? railActiveColor : railColor};"
		>
			<Icon size={18} weight="regular" />
		</a>
	{/each}
	<div style="width:26px; height:1px; background:var(--df-line); margin:4px 0;"></div>
	<a
		href={resolve('/profile')}
		title="Profile"
		style="width:40px; height:40px; border-radius:8px; display:flex; align-items:center; justify-content:center; background:{active ===
		'profile'
			? railActiveBg
			: 'transparent'}; color:{active === 'profile' ? railActiveColor : railColor};"
	>
		<UserIcon size={18} weight="regular" />
	</a>
</div>
