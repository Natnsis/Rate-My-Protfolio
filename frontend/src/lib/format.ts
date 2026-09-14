/** Formats an ISO timestamp as a short relative time ("2h", "3d", "just now"). */
export function timeAgo(iso: string): string {
	const diffMs = Date.now() - new Date(iso).getTime();
	const minutes = Math.floor(diffMs / 60000);
	if (minutes < 1) return 'just now';
	if (minutes < 60) return `${minutes}m`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h`;
	const days = Math.floor(hours / 24);
	if (days < 7) return `${days}d`;
	const weeks = Math.floor(days / 7);
	if (weeks < 5) return `${weeks}w`;
	const months = Math.floor(days / 30);
	return `${months}mo`;
}

/** Compact like/count formatting: 1200 -> "1.2k". */
export function compactCount(n: number): string {
	if (n < 1000) return String(n);
	if (n < 1_000_000) return `${(n / 1000).toFixed(n % 1000 >= 100 ? 1 : 0)}k`;
	return `${(n / 1_000_000).toFixed(1)}M`;
}

/** Rounds a rating to one decimal, or "—" when unrated (0). */
export function ratingLabel(n: number): string {
	return n > 0 ? n.toFixed(1) : '—';
}
