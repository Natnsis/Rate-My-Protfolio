<script lang="ts">
	import { StackIcon, ChartBarIcon, LightningIcon, TrophyIcon, FlameIcon, ChatCircleIcon, LightbulbIcon } from 'phosphor-svelte';
	import Screenshot from '$lib/components/Screenshot.svelte';

	const features = [
		{
			Icon: StackIcon,
			title: 'Version History',
			text: 'Every redesign becomes a new version on the same portfolio, not a separate post lost in the feed.'
		},
		{
			Icon: ChartBarIcon,
			title: 'Structured Ratings',
			text: 'Separate scores for UI, UX and code, so feedback tells you exactly what to fix next.'
		},
		{
			Icon: LightningIcon,
			title: 'AI Studio',
			text: 'Roast, feedback or suggestions on demand. Save the good ones or share them publicly.'
		},
		{
			Icon: TrophyIcon,
			title: 'Leaderboard',
			text: 'Every like counts toward your rank. Weekly and all-time boards keep the best work visible.'
		}
	];
</script>

<div
	style="width:100%; background:white; font-family:var(--font-sans); color:var(--df-ink);"
>
	<div style="border-bottom:1px solid var(--df-line); background:white; position:sticky; top:0; z-index:20;">
		<div
			style="max-width:1080px; margin:0 auto; padding:0 36px; height:64px; display:flex; align-items:center; justify-content:space-between; gap:24px;"
		>
			<a
				href="/"
				style="font-family:var(--font-mono); font-weight:500; font-size:15px; letter-spacing:-0.01em; white-space:nowrap;"
				>/DEVFOLIO</a
			>
			<div style="display:flex; align-items:center; gap:30px;">
				<a href="#why" style="font-size:14px; font-weight:500; white-space:nowrap;">Why us</a>
				<a href="#how" style="font-size:14px; font-weight:500; white-space:nowrap;">How it works</a>
				<a href="#ai" style="font-size:14px; font-weight:500; white-space:nowrap;">AI Studio</a>
			</div>
			<div style="display:flex; align-items:center; gap:10px;">
				<a
					href="/auth"
					style="background:var(--df-ink); color:white; padding:11px 22px; border-radius:999px; font-weight:600; font-size:13.5px; white-space:nowrap;"
					>Get started</a
				>
				<a
					href="/auth"
					style="border:1px solid var(--df-line); padding:10px 22px; border-radius:999px; font-weight:600; font-size:13.5px; white-space:nowrap;"
					>Sign In</a
				>
			</div>
		</div>
	</div>

	<div style="max-width:1080px; margin:0 auto; padding:54px 36px 0 36px;">
		<div
			style="display:grid; grid-template-columns:minmax(0,1.45fr) minmax(0,0.55fr); gap:44px; align-items:start; margin-bottom:40px;"
		>
			<div style="font-size:clamp(32px, 4.2vw, 52px); font-weight:700; line-height:1.03; letter-spacing:-0.035em; text-wrap:pretty;"
				>Let's Get Your Portfolio Rated</div
			>
			<div style="padding-top:8px;">
				<div
					style="font-size:14.5px; line-height:1.6; color:var(--df-muted); margin-bottom:22px; max-width:300px;"
					>Post every version you ship. Real developers score your UI, UX and code. No vanity metrics,
					just feedback you can act on.</div
				>
				<a
					href="/auth"
					style="display:inline-block; background:var(--df-ink); color:white; padding:14px 28px; border-radius:999px; font-weight:600; font-size:14.5px;"
					>Post your first version</a
				>
			</div>
		</div>
		<Screenshot
			src="/screenshots/shot-08.png"
			alt="Hero portfolio feed screenshot"
			shape="rect"
			style="width:100%; height:340px; display:block;"
		/>
	</div>

	<div id="why" style="background:var(--df-bg); padding:64px 0;">
		<div style="max-width:1080px; margin:0 auto; padding:0 36px;">
			<div
				style="font-family:var(--font-mono); font-size:12.5px; font-weight:500; letter-spacing:0.04em; color:var(--df-muted); margin-bottom:26px;"
				>/WHY DEVS POST HERE</div
			>
			<div
				style="display:grid; grid-template-columns:minmax(0,1.45fr) minmax(0,0.55fr); gap:60px; align-items:start; margin-bottom:60px;"
			>
				<div
					style="font-size:clamp(28px, 3.5vw, 44px); font-weight:700; line-height:1.12; letter-spacing:-0.03em; text-wrap:pretty;"
					>Honest feedback, tracked across every version you ship</div
				>
				<div
					style="font-size:15px; line-height:1.65; color:var(--df-muted); padding-top:8px;"
					>Whether it's your first portfolio or your fifth redesign, DevFolio keeps the whole history
					visible, so progress is something you can see and others can rate.</div
				>
			</div>

			<div style="border-top:1px solid var(--df-line);">
				{#each features as f}
					<div
						style="display:grid; grid-template-columns:260px minmax(0,1fr); gap:24px; align-items:start; padding:20px 0; border-bottom:1px solid var(--df-line);"
					>
						<div style="display:flex; align-items:center; gap:12px;">
							<f.Icon size={19} color="var(--df-ink)" weight="regular" />
							<div style="font-size:15px; font-weight:700; letter-spacing:-0.015em;">{f.title}</div>
						</div>
						<div style="font-size:13.5px; line-height:1.6; color:var(--df-muted); max-width:520px;"
							>{f.text}</div
						>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div id="how" style="max-width:1080px; margin:0 auto; padding:64px 36px;">
		<div style="display:flex; align-items:end; justify-content:space-between; gap:40px; margin-bottom:30px;">
			<div>
				<div
					style="font-family:var(--font-mono); font-size:12.5px; font-weight:500; letter-spacing:0.04em; color:var(--df-muted); margin-bottom:20px;"
					>/HOW IT WORKS</div
				>
				<div
					style="font-size:clamp(28px, 3.5vw, 44px); font-weight:700; line-height:1.1; letter-spacing:-0.03em; max-width:620px; text-wrap:pretty;"
					>Four steps from shipped to rated</div
				>
			</div>
			<a
				href="/auth"
				style="background:var(--df-ink); color:white; padding:12px 24px; border-radius:999px; font-weight:600; font-size:13.5px; white-space:nowrap;"
				>Start posting</a
			>
		</div>

		<div style="display:grid; grid-template-columns:repeat(4, minmax(0,1fr)); grid-auto-rows:230px; gap:16px;">
			<div
				style="grid-column:span 2; border-radius:4px; overflow:hidden; background:var(--df-ink); display:flex; flex-direction:column;"
			>
				<Screenshot
					src="/screenshots/shot-04.png"
					alt="Upload flow screenshot"
					shape="rect"
					style="width:100%; flex:1; min-height:0;"
				/>
				<div style="padding:16px 20px 18px 20px; color:white;">
					<div style="font-family:var(--font-mono); font-size:11.5px; color:rgba(255,255,255,0.6); margin-bottom:6px;"
						>01</div
					>
					<div style="font-size:17px; font-weight:700; margin-bottom:4px; letter-spacing:-0.02em;"
						>Drop your portfolio URL</div
					>
					<div style="font-size:13px; line-height:1.5; color:rgba(255,255,255,0.75);"
						>We grab the screenshot automatically, or you upload your own.</div
					>
				</div>
			</div>
			<div
				style="grid-column:span 1; position:relative; border-radius:4px; overflow:hidden; background:var(--df-ink); padding:22px; display:flex; flex-direction:column; justify-content:space-between; color:white;"
			>
				<div style="font-family:var(--font-mono); font-size:11.5px; opacity:0.6;">02</div>
				<div>
					<div style="font-size:17px; font-weight:700; margin-bottom:5px; letter-spacing:-0.02em;"
						>Devs rate it</div
					>
					<div style="font-size:13px; line-height:1.55; opacity:0.8;"
						>UI, UX and code scored separately by real developers.</div
					>
				</div>
			</div>
			<div style="grid-column:span 1; position:relative; border-radius:4px; overflow:hidden;">
				<Screenshot
					src="/screenshots/shot-05.png"
					alt="Ratings screenshot"
					shape="rect"
					style="width:100%; height:100%; position:absolute; inset:0;"
				/>
			</div>

			<div style="grid-column:span 1; position:relative; border-radius:4px; overflow:hidden;">
				<Screenshot
					src="/screenshots/shot-06.png"
					alt="Version timeline screenshot"
					shape="rect"
					style="width:100%; height:100%; position:absolute; inset:0;"
				/>
			</div>
			<div
				style="grid-column:span 1; border-radius:4px; background:var(--df-bg); padding:22px; display:flex; flex-direction:column; justify-content:space-between;"
			>
				<div style="font-family:var(--font-mono); font-size:11.5px; color:var(--df-muted);">03</div>
				<div>
					<div style="font-size:17px; font-weight:700; margin-bottom:5px; letter-spacing:-0.02em;"
						>Ship a new version</div
					>
					<div style="font-size:13px; line-height:1.55; color:var(--df-muted);"
						>v1, v2, v3; the timeline stays on one portfolio.</div
					>
				</div>
			</div>
			<div
				style="grid-column:span 2; border-radius:4px; overflow:hidden; background:var(--df-ink); display:flex; flex-direction:column;"
			>
				<Screenshot
					src="/screenshots/shot-07.png"
					alt="Leaderboard screenshot"
					shape="rect"
					style="width:100%; flex:1; min-height:0;"
				/>
				<div style="padding:16px 20px 18px 20px; color:white;">
					<div style="font-family:var(--font-mono); font-size:11.5px; color:rgba(255,255,255,0.6); margin-bottom:6px;"
						>04</div
					>
					<div style="font-size:17px; font-weight:700; margin-bottom:4px; letter-spacing:-0.02em;"
						>Climb the leaderboard</div
					>
					<div style="font-size:13px; line-height:1.5; color:rgba(255,255,255,0.75);"
						>Every like counts. Weekly and all-time boards keep the best portfolios visible.</div
					>
				</div>
			</div>
		</div>
	</div>

	<div id="ai" style="background:var(--df-ink); color:white; padding:64px 0;">
		<div style="max-width:1080px; margin:0 auto; padding:0 36px;">
			<div
				style="font-family:var(--font-mono); font-size:12.5px; font-weight:500; letter-spacing:0.04em; color:rgba(255,255,255,0.55); margin-bottom:26px;"
				>/AI STUDIO</div
			>
			<div
				style="display:grid; grid-template-columns:minmax(0,1.45fr) minmax(0,0.55fr); gap:60px; align-items:start; margin-bottom:44px;"
			>
				<div
					style="font-size:clamp(28px, 3.5vw, 44px); font-weight:700; line-height:1.12; letter-spacing:-0.03em; text-wrap:pretty;"
					>Get roasted before the internet does it for you</div
				>
				<div
					style="font-size:15px; line-height:1.65; color:rgba(255,255,255,0.75); padding-top:8px;"
					>Pick a portfolio, choose a mode, and get an instant critique. Keep it private, save it to
					your profile, or share it to Community Roasts.</div
				>
			</div>
			<div style="display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:16px;">
				<div
					style="border:1px solid rgba(255,255,255,0.18); border-radius:4px; padding:24px;"
				>
					<div style="display:flex; align-items:center; gap:8px; font-size:16px; font-weight:700; margin-bottom:10px; letter-spacing:-0.015em;">
						<FlameIcon size={17} color="var(--df-warm)" weight="regular" />
						Roast
					</div>
					<div style="font-size:13.5px; line-height:1.6; color:rgba(255,255,255,0.7);"
						>"Six competing accent colors and a CTA that whispers. Pick one brand color and mean it."</div
					>
				</div>
				<div
					style="border:1px solid rgba(255,255,255,0.18); border-radius:4px; padding:24px;"
				>
					<div style="display:flex; align-items:center; gap:8px; font-size:16px; font-weight:700; margin-bottom:10px; letter-spacing:-0.015em;">
						<ChatCircleIcon size={17} color="white" weight="regular" />
						Feedback
					</div>
					<div style="font-size:13.5px; line-height:1.6; color:rgba(255,255,255,0.7);"
						>"Strong hierarchy and consistent spacing. Secondary text contrast is a touch low in dark
						mode."</div
					>
				</div>
				<div
					style="border:1px solid rgba(255,255,255,0.18); border-radius:4px; padding:24px;"
				>
					<div style="display:flex; align-items:center; gap:8px; font-size:16px; font-weight:700; margin-bottom:10px; letter-spacing:-0.015em;">
						<LightbulbIcon size={17} color="white" weight="regular" />
						Suggestions
					</div>
					<div style="font-size:13.5px; line-height:1.6; color:rgba(255,255,255,0.7);"
						>"Cut your shadow scale to two levels. Add empty and loading states, they're missing."</div
					>
				</div>
			</div>
		</div>
	</div>

	<div style="max-width:1080px; margin:0 auto; padding:64px 36px;">
		<div
			style="font-family:var(--font-mono); font-size:12.5px; font-weight:500; letter-spacing:0.04em; color:var(--df-muted); margin-bottom:26px;"
			>/BY THE NUMBERS</div
		>
		<div
			style="display:grid; grid-template-columns:repeat(4, minmax(0,1fr)); gap:34px; border-top:1px solid var(--df-line); padding-top:34px;"
		>
			<div>
				<div style="font-size:34px; font-weight:700; letter-spacing:-0.04em; line-height:1;">12,400+</div>
				<div style="font-size:13.5px; color:var(--df-muted); margin-top:8px;">developers posting</div>
			</div>
			<div>
				<div style="font-size:34px; font-weight:700; letter-spacing:-0.04em; line-height:1;">38,000+</div>
				<div style="font-size:13.5px; color:var(--df-muted); margin-top:8px;">versions shipped</div>
			</div>
			<div>
				<div style="font-size:34px; font-weight:700; letter-spacing:-0.04em; line-height:1;">210,000+</div>
				<div style="font-size:13.5px; color:var(--df-muted); margin-top:8px;">ratings given</div>
			</div>
			<div>
				<div style="font-size:34px; font-weight:700; letter-spacing:-0.04em; line-height:1;">4.8/5</div>
				<div style="font-size:13.5px; color:var(--df-muted); margin-top:8px;">average dev rating</div>
			</div>
		</div>
	</div>

	<div style="background:var(--df-bg); padding:64px 0;">
		<div style="max-width:1080px; margin:0 auto; padding:0 36px;">
			<div
				style="font-family:var(--font-mono); font-size:12.5px; font-weight:500; letter-spacing:0.04em; color:var(--df-muted); margin-bottom:26px;"
				>/WHAT DEVS SAY</div
			>
			<div style="border:1px dashed var(--df-line); border-radius:8px; padding:32px; color:var(--df-muted); font-size:14px;"
				>Quotes from real members go here. Replace with a genuine testimonial once the community is live.</div
			>
		</div>
	</div>

	<div style="max-width:1080px; margin:0 auto; padding:72px 36px;">
		<div style="display:grid; grid-template-columns:minmax(0,1.45fr) minmax(0,0.55fr); gap:60px; align-items:end;">
			<div
				style="font-size:clamp(26px, 3.4vw, 36px); font-weight:700; line-height:1.05; letter-spacing:-0.035em; text-wrap:pretty;"
				>Ready to see what devs really think?</div
			>
			<div>
				<div
					style="font-size:15px; line-height:1.6; color:var(--df-muted); margin-bottom:24px;"
					>Free to join. Post your first version in under two minutes.</div
				>
				<a
					href="/auth"
					style="display:inline-block; background:var(--df-ink); color:white; padding:14px 30px; border-radius:999px; font-weight:600; font-size:14.5px;"
					>Create your account</a
				>
			</div>
		</div>
	</div>

	<div style="border-top:1px solid var(--df-line); padding:28px 0;">
		<div
			style="max-width:1080px; margin:0 auto; padding:0 36px; display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap;"
		>
			<span style="font-family:var(--font-mono); font-weight:500; font-size:14px;">/DEVFOLIO</span>
			<div style="display:flex; align-items:center; gap:20px;">
				<a href="/terms" style="font-size:13px; color:var(--df-muted);">Terms</a>
				<a href="/privacy" style="font-size:13px; color:var(--df-muted);">Privacy</a>
			</div>
			<span style="font-size:13px; color:var(--df-muted);"
				>© 2026 DevFolio. Built by devs, for devs.</span
			>
		</div>
	</div>
</div>