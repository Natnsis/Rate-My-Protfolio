<script lang="ts">
	import { page } from '$app/state';
	import AppChrome from '$lib/components/AppChrome.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import Screenshot from '$lib/components/Screenshot.svelte';
	import { ArrowLeftIcon, HeartIcon } from 'phosphor-svelte';
	import { auth } from '$lib/auth.svelte';
	import { apiFetch, ApiError } from '$lib/api';
	import { timeAgo, ratingLabel } from '$lib/format';
	import type { PortfolioDetail, Comment } from '$lib/types';

	const accent = 'var(--df-accent)';
	const red = 'oklch(0.5237 0.1707 27.0455)';
	const green = 'oklch(0.5406 0.0773 152.7118)';
	const warm = 'oklch(0.6031 0.1107 41.8526)';
	const muted = 'var(--df-muted)';
	const soft = 'var(--df-ink-soft)';
	const ink = 'var(--df-ink)';

	const postId = $derived(page.params.id);

	let post = $state<PortfolioDetail | null>(null);
	let comments = $state<Comment[]>([]);
	let versionIndex = $state(0);
	let liked = $state(false);
	let likeCount = $state(0);
	let commentDraft = $state('');
	let loading = $state(true);
	let errorMsg = $state('');
	let posting = $state(false);

	$effect(() => {
		auth.requireAuth();
	});

	async function load(id: string) {
		loading = true;
		errorMsg = '';
		try {
			const [detail, commentList] = await Promise.all([
				apiFetch<PortfolioDetail>(`/portfolios/${id}`),
				apiFetch<Comment[]>(`/portfolios/${id}/comments`)
			]);
			post = detail;
			comments = commentList;
			versionIndex = detail.versions.length - 1;
			liked = detail.likedByMe;
			likeCount = detail.likeCount;
		} catch (err) {
			errorMsg = err instanceof ApiError ? err.message : 'Could not load this portfolio.';
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		if (postId) load(postId);
	});

	const version = $derived(post?.versions[versionIndex]);

	async function toggleLike() {
		if (!post) return;
		const wasLiked = liked;
		liked = !liked;
		likeCount += liked ? 1 : -1;
		try {
			const res = await apiFetch<{ liked: boolean; likeCount: number }>(`/portfolios/${post.id}/like`, { method: 'POST' });
			liked = res.liked;
			likeCount = res.likeCount;
		} catch {
			liked = wasLiked;
			likeCount += wasLiked ? 1 : -1;
		}
	}

	async function addComment() {
		if (!post) return;
		const draft = commentDraft.trim();
		if (!draft) return;
		posting = true;
		try {
			const created = await apiFetch<Comment>(`/portfolios/${post.id}/comments`, { method: 'POST', body: { text: draft } });
			comments = [...comments, created];
			commentDraft = '';
		} catch {
			// keep the draft so the user doesn't lose their comment
		} finally {
			posting = false;
		}
	}
</script>

<svelte:head><title>{post ? `${post.title} — DevFolio` : 'DevFolio'}</title></svelte:head>

<div style="width:100%; min-height:100vh; background:var(--df-bg); color:var(--df-ink); padding-left:76px;">
	<AppChrome active="feed" initials={auth.user?.initials} />

	<div class="page-container">
		<div>
			<a
				href="/feed"
				style="display:flex; align-items:center; gap:8px; font-size:13px; font-weight:600; color:var(--df-muted); margin-bottom:16px;"
			>
				<ArrowLeftIcon size={14} color="currentColor" weight="regular" />
				Back to feed
			</a>

			{#if loading}
				<div style="padding:80px 0; text-align:center; color:var(--df-muted);">Loading…</div>
			{:else if errorMsg || !post || !version}
				<div style="background:white; border-radius:8px; padding:60px 24px; text-align:center; color:var(--df-red);"
					>{errorMsg || 'Portfolio not found.'}</div
				>
			{:else}
				<div style="background:white; border:1px solid var(--df-line); border-radius:8px; overflow:hidden; box-shadow:var(--df-shadow-1);">
					<div style="padding:20px 22px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
						<div style="display:flex; align-items:center; gap:12px; min-width:0;">
							<Avatar name={post.user.name} size={44} />
							<div style="min-width:0;">
								<div style="font-size:15px; font-weight:700;">{post.title}</div>
								<div style="font-size:12.5px; color:var(--df-muted);"
									>by {post.user.name} · @{post.user.username}</div
								>
							</div>
						</div>
						<div style="display:flex; gap:6px; flex-wrap:wrap;">
							{#each post.versions as ver, i}
								<button
									type="button"
									onclick={() => (versionIndex = i)}
									class="mono"
									style="font-family:inherit; padding:6px 12px; border-radius:999px; font-size:12px; font-weight:700; cursor:pointer; background:{i === versionIndex ? accent : soft}; color:{i === versionIndex ? 'white' : muted};"
									>{ver.label}</button
								>
							{/each}
						</div>
					</div>

					<div style="padding:0 22px 18px 22px;">
						<Screenshot
							src={version.screenshotUrl}
							alt="Screenshot"
							shape="rounded"
							radius={14}
							style="width:100%; height:300px;"
						/>
					</div>

					{#if version.note}
						<div style="padding:0 22px 18px 22px; font-size:14.5px; line-height:1.6;">{version.note}</div>
					{/if}

					{#if post.tags.length > 0}
						<div style="padding:0 22px 18px 22px; display:flex; gap:8px; flex-wrap:wrap;">
							{#each post.tags as tag}
								<span
									class="mono"
									style="background:var(--df-ink-soft); color:var(--df-muted); font-size:12px; font-weight:600; padding:6px 12px; border-radius:999px;"
									>{tag}</span
								>
							{/each}
						</div>
					{/if}

					<div style="padding:0 22px 20px 22px; display:flex; gap:10px;">
						<div style="background:var(--df-ink-soft); border-radius:10px; padding:10px 16px; flex:1; text-align:center;">
							<div style="font-size:20px; font-weight:800; color:var(--df-accent);">{ratingLabel(version.uiRating)}</div>
							<div style="font-size:11px; color:var(--df-muted); font-weight:600;">UI</div>
						</div>
						<div style="background:var(--df-ink-soft); border-radius:10px; padding:10px 16px; flex:1; text-align:center;">
							<div style="font-size:20px; font-weight:800; color:{warm};">{ratingLabel(version.uxRating)}</div>
							<div style="font-size:11px; color:var(--df-muted); font-weight:600;">UX</div>
						</div>
						<div style="background:var(--df-ink-soft); border-radius:10px; padding:10px 16px; flex:1; text-align:center;">
							<div style="font-size:20px; font-weight:800; color:{green};">{ratingLabel(version.codeRating)}</div>
							<div style="font-size:11px; color:var(--df-muted); font-weight:600;">Code</div>
						</div>
					</div>

					<div
						style="border-top:1px solid var(--df-line); padding:14px 22px; display:flex; align-items:center; gap:24px;"
					>
						<button
							type="button"
							onclick={toggleLike}
							style="font-family:inherit; display:flex; align-items:center; gap:6px; cursor:pointer; background:none; border:none; color:{liked ? red : muted};"
						>
							<HeartIcon size={18} color="currentColor" weight={liked ? 'fill' : 'regular'} />
							<span style="font-size:13.5px; font-weight:600;">{likeCount}</span>
						</button>
						{#if version.projectUrl}
							<a href={version.projectUrl} target="_blank" rel="noreferrer" style="font-size:13.5px; font-weight:600; color:var(--df-accent);">
								Visit project ↗
							</a>
						{/if}
					</div>
				</div>

				<div style="margin-top:24px;">
					<div style="font-size:15px; font-weight:700; margin-bottom:14px;">Comments ({comments.length})</div>
					<div style="display:flex; gap:10px; margin-bottom:20px;">
						<Avatar name={auth.user?.name ?? ''} size={36} style="flex-shrink:0;" />
						<div style="flex:1; display:flex; gap:8px;">
							<input
								bind:value={commentDraft}
								onkeydown={(e) => e.key === 'Enter' && addComment()}
								placeholder="Leave feedback for this version..."
								style="flex:1; padding:11px 14px; border-radius:10px; border:1px solid var(--df-line); background:white; font-size:13.5px; outline:none; color:inherit;"
							/>
							<button
								type="button"
								onclick={addComment}
								disabled={posting}
								style="font-family:inherit; background:var(--df-accent); color:white; padding:10px 18px; border:none; border-radius:10px; font-weight:600; font-size:13px; cursor:pointer; white-space:nowrap; opacity:{posting ? 0.6 : 1};"
							>
								Post
							</button>
						</div>
					</div>
					{#each comments as c}
						<div style="display:flex; gap:10px; margin-bottom:16px;">
							<div
								style="width:36px; height:36px; border-radius:50%; background:var(--df-ink-soft); color:var(--df-ink); display:flex; align-items:center; justify-content:center; font-size:12.5px; font-weight:600; flex-shrink:0;"
								>{c.user.initials}</div
							>
							<div
								style="background:white; border:1px solid var(--df-line); border-radius:12px; padding:11px 14px; flex:1;"
							>
								<div style="display:flex; justify-content:space-between; margin-bottom:3px;">
									<span style="font-size:13px; font-weight:700;">{c.user.name}</span>
									<span style="font-size:11.5px; color:var(--df-muted);">{timeAgo(c.createdAt)}</span>
								</div>
								<div style="font-size:13.5px; line-height:1.5;">{c.text}</div>
							</div>
						</div>
					{:else}
						<div style="font-size:13px; color:var(--df-muted);">No comments yet — be the first.</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.page-container {
		max-width: 1040px;
		margin: 0 auto;
		padding: 56px 40px 64px 40px;
	}
	@media (max-width: 640px) {
		.page-container {
			padding: 28px 16px 40px 16px;
		}
	}
</style>

