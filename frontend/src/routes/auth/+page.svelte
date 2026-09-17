<script lang="ts">
	import authRight from '$lib/assets/auth_right.jpg';
	import { auth } from '$lib/auth.svelte';
	import { goto } from '$app/navigation';

	let authMode = $state<'signup' | 'signin'>('signup');
	let remember = $state(true);
	let username = $state('');
	let name = $state('');
	let email = $state('');
	let password = $state('');
	let submitting = $state(false);
	let usernameFocused = $state(false);
	let nameFocused = $state(false);
	let emailFocused = $state(false);
	let passwordFocused = $state(false);
	let passwordVisible = $state(false);

	const isSignup = $derived(authMode === 'signup');
	const ink = 'var(--df-ink)';
	const line = 'var(--df-line)';

	$effect(() => {
		if (!auth.loading && auth.isAuthenticated) goto('/feed');
	});

	async function submit() {
		if (submitting) return;
		submitting = true;
		const ok = isSignup
			? await auth.register(username.trim(), email.trim(), password, name.trim())
			: await auth.login(email.trim(), password);
		submitting = false;
		if (ok) goto('/feed');
	}
</script>

<svelte:head><title>DevFolio — Sign Up / Login</title></svelte:head>

<div
	style="width:100%; min-height:100vh; background:var(--df-bg); font-family:var(--font-sans); color:var(--df-ink); display:flex; align-items:center; justify-content:center; padding:48px 24px; box-sizing:border-box;"
>
	<div class="auth-card" style="width:100%; max-width:1000px; background:white; border-radius:8px; border:1px solid var(--df-line); overflow:hidden; display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); ">
		<form
			onsubmit={(e) => {
				e.preventDefault();
				submit();
			}}
			class="auth-form"
			style="padding:52px 56px; display:flex; flex-direction:column;"
		>
			<div style="text-align:center; margin-bottom:30px;">
				<a
					href="/"
					style="font-family:var(--font-mono); font-weight:500; font-size:24px; letter-spacing:-0.01em; display:block; margin-bottom:6px; color:var(--df-ink);"
					>/DEVFOLIO</a
				>
				<div style="font-size:14px; color:var(--df-muted);">Post your portfolio. Get honest feedback.</div>
			</div>

			<div style="display:flex; gap:10px; margin-bottom:26px;">
				<button
					type="button"
					onclick={() => (authMode = 'signup')}
					style="font-family:inherit; flex:1; text-align:center; padding:11px 0; border-radius:999px; font-size:14px; font-weight:600; cursor:pointer; background:{isSignup ? ink : 'white'}; color:{isSignup ? 'white' : ink}; border:1px solid {isSignup ? ink : line};"
					>Sign Up</button
				>
				<button
					type="button"
					onclick={() => (authMode = 'signin')}
					style="font-family:inherit; flex:1; text-align:center; padding:11px 0; border-radius:999px; font-size:14px; font-weight:600; cursor:pointer; background:{isSignup ? 'white' : ink}; color:{isSignup ? ink : 'white'}; border:1px solid {isSignup ? line : ink};"
					>Login</button
				>
			</div>

			<div style="font-size:13px; color:var(--df-muted); margin-bottom:18px;"
				>{isSignup ? 'Create your account' : 'Welcome back'} and sign in with your DevFolio
				credentials.</div
			>

			<div style="display:flex; flex-direction:column; gap:16px; margin-bottom:20px;">
				{#if isSignup}
					<div class:active={usernameFocused || username.length > 0} class="auth-field">
						<label for="username">Username</label>
						<input
							id="username"
							bind:value={username}
							onfocus={() => (usernameFocused = true)}
							onblur={() => (usernameFocused = false)}
							required
							minlength="3"
							placeholder={usernameFocused ? 'yourhandle' : 'Username'}
							style="width:100%; box-sizing:border-box; padding:14px; border-radius:8px; border:1px solid var(--df-line); font-size:14px; outline:none; background:white;"
						/>
					</div>
					<div class:active={nameFocused || name.length > 0} class="auth-field">
						<label for="name">Name</label>
						<input
							id="name"
							bind:value={name}
							onfocus={() => (nameFocused = true)}
							onblur={() => (nameFocused = false)}
							placeholder={nameFocused ? 'Your name' : 'Name'}
							style="width:100%; box-sizing:border-box; padding:14px; border-radius:8px; border:1px solid var(--df-line); font-size:14px; outline:none; background:white;"
						/>
					</div>
				{/if}
				<div class:active={emailFocused || email.length > 0} class="auth-field">
					<label for="email">Email</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						onfocus={() => (emailFocused = true)}
						onblur={() => (emailFocused = false)}
						required
						placeholder={emailFocused ? 'you@email.com' : 'Email'}
						style="width:100%; box-sizing:border-box; padding:14px; border-radius:8px; border:1px solid var(--df-line); font-size:14px; outline:none; background:white;"
					/>
				</div>
				<div class:active={passwordFocused || password.length > 0} class="auth-field">
					<label for="password">Password</label>
					<input
						id="password"
						type={passwordVisible ? 'text' : 'password'}
						bind:value={password}
						onfocus={() => (passwordFocused = true)}
						onblur={() => (passwordFocused = false)}
						required
						minlength="8"
						placeholder={passwordFocused ? '••••••••••••' : 'Password'}
						style="width:100%; box-sizing:border-box; padding:14px 46px 14px 14px; border-radius:8px; border:1px solid var(--df-line); font-size:14px; outline:none; background:white;"
					/>
					<button
						type="button"
						class="password-toggle"
						onclick={() => (passwordVisible = !passwordVisible)}
						aria-label={passwordVisible ? 'Hide password' : 'Show password'}
						aria-pressed={passwordVisible}
					>
						{#if passwordVisible}
							<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 4.2A10.8 10.8 0 0 1 12 4c5.5 0 9.5 5.1 9.5 8s-1.3 3.5-3.1 5M6.2 6.2C3.9 7.9 2.5 10.3 2.5 12c0 2.9 4 8 9.5 8 1.5 0 2.8-.4 4-1" /></svg>
						{:else}
							<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6.5 4 12 4s9.5 8 9.5 8-4 8-9.5 8-9.5-8-9.5-8Z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /></svg>
						{/if}
					</button>
				</div>
			</div>

			{#if auth.error}
				<div
					style="background:oklch(0.9959 0.0058 27.0455 / 40%); border:1px solid var(--df-red); color:var(--df-red); border-radius:8px; padding:10px 14px; font-size:13px; margin-bottom:18px;"
				>
					{auth.error}
				</div>
			{/if}

			<button
				type="button"
				onclick={() => (remember = !remember)}
				style="font-family:inherit; display:flex; align-items:center; gap:10px; margin-bottom:24px; cursor:pointer; background:transparent; border:none; padding:0; text-align:left; color:var(--df-ink);"
			>
				<div
					style="width:18px; height:18px; border-radius:4px; flex-shrink:0; display:flex; align-items:center; justify-content:center; background:{remember ? ink : 'white'}; border:1.5px solid {remember ? ink : line};"
				>
					<svg
						width="11"
						height="11"
						viewBox="0 0 24 24"
						fill="none"
						stroke="white"
						stroke-width="3.4"
						style="opacity:{remember ? 1 : 0};"
					><path d="M20 6L9 17l-5-5"></path></svg>
				</div>
				<span style="font-size:13.5px;">Remember me</span>
			</button>

			<button
				type="submit"
				disabled={submitting}
				style="display:block; text-align:center; background:var(--df-ink); color:white; padding:14px 0; border-radius:999px; font-weight:600; font-size:14.5px; margin-bottom:16px; border:none; cursor:pointer; opacity:{submitting ? 0.7 : 1};"
				>{submitting ? 'Please wait…' : isSignup ? 'Create Account' : 'Login'}</button
			>

			<div style="text-align:center; font-size:12px; color:var(--df-muted); line-height:1.5;"
				>By continuing you agree to the Terms &amp; Community Guidelines.</div
			>
		</form>

		<div class="auth-visual" style="position:relative; background:var(--df-ink-soft); min-height:620px;">
			<img
				src={authRight}
				alt="Auth visual"
				style="width:100%; height:100%; position:absolute; inset:0; object-fit:cover;"
			/>
		</div>
	</div>
</div>

<style>
	.auth-field {
		position: relative;
	}

	.auth-field label {
		position: absolute;
		z-index: 1;
		top: 14px;
		left: 14px;
		padding: 0 4px;
		background: white;
		font-size: 14px;
		color: var(--df-muted);
		pointer-events: none;
		transition: top 150ms ease, font-size 150ms ease, color 150ms ease;
	}

	.auth-field.active label {
		top: -7px;
		left: 12px;
		font-size: 11.5px;
	}

	.auth-field input::placeholder {
		color: transparent;
	}

	.auth-field.active input::placeholder {
		color: var(--df-muted);
	}

	.password-toggle {
		position: absolute;
		top: 50%;
		right: 12px;
		z-index: 2;
		display: grid;
		width: 28px;
		height: 28px;
		padding: 0;
		place-items: center;
		transform: translateY(-50%);
		border: 0;
		border-radius: 4px;
		background: transparent;
		color: var(--df-muted);
		cursor: pointer;
	}

	.password-toggle:hover,
	.password-toggle:focus-visible {
		color: var(--df-ink);
		background: var(--df-bg);
		outline: none;
	}

	.password-toggle svg {
		width: 18px;
		height: 18px;
		fill: none;
		stroke: currentColor;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 1.8;
	}

	@media (max-width: 820px) {
		.auth-card {
			grid-template-columns: 1fr !important;
			max-width: 480px !important;
		}
		.auth-visual {
			display: none;
		}
		.auth-form {
			padding: 40px 28px !important;
		}
	}
</style>
