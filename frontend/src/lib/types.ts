// Mirrors the JSON shapes returned by the FolioHub API (backend/internals/handlers).

export type UserPublic = {
	id: number;
	username: string;
	name: string;
	role: string;
	initials: string;
	bio?: string;
	location?: string;
	githubUrl?: string;
	linkedinUrl?: string;
	twitterUrl?: string;
	websiteUrl?: string;
};

export type UserStats = {
	portfolioCount: number;
	totalLikes: number;
	rank: number;
};

export type Version = {
	id: number;
	number: number;
	label: string;
	note: string;
	screenshotUrl: string;
	projectUrl?: string;
	uiRating: number;
	uxRating: number;
	codeRating: number;
	createdAt: string;
};

export type PortfolioSummary = {
	id: number;
	title: string;
	tags: string[];
	createdAt: string;
	updatedAt: string;
	user: UserPublic;
	latestVersion: Version;
	versionCount: number;
	likeCount: number;
	commentCount: number;
	likedByMe: boolean;
};

export type PortfolioDetail = PortfolioSummary & {
	versions: Version[];
};

export type Comment = {
	id: number;
	text: string;
	createdAt: string;
	user: UserPublic;
};

export type Roast = {
	id: number;
	title: string;
	body: string;
	stars: number;
	helpful: number;
	aiGenerated: boolean;
	createdAt: string;
	user: UserPublic;
	portfolio: { id: number; title: string; screenshotUrl: string };
};

export type LeaderboardRow = {
	rank: number;
	user: UserPublic;
	totalLikes: number;
	versionCount: number;
	recentScreenshots: string[];
	morePortfolios: number;
	topPortfolioId: number;
};

export type Notification = {
	id: number;
	kind: 'like' | 'comment' | 'roast' | 'rank' | 'system';
	message: string;
	read: boolean;
	createdAt: string;
	actor?: UserPublic;
	portfolio?: { id: number; title: string };
};
