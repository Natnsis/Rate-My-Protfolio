<script lang="ts">
	interface Props {
		src?: string | null;
		alt?: string;
		placeholder?: string;
		shape?: 'rect' | 'rounded' | 'circle' | 'pill';
		radius?: number;
		style?: string;
		class?: string;
	}

	let {
		src = null,
		alt = '',
		placeholder = 'Drop an image',
		shape = 'rounded',
		radius = 12,
		style = '',
		class: klass = ''
	}: Props = $props();

	const corner =
		shape === 'circle'
			? '50%'
			: shape === 'pill'
				? '999px'
				: shape === 'rounded'
					? `${radius}px`
					: '0';
</script>

{#if src}
	<img
		src={src}
		alt={alt}
		class={klass}
		style="border-radius:{corner}; object-fit:cover; display:block; {style}"
		draggable="false"
	/>
{:else}
	<div
		class={klass}
		style="border-radius:{corner}; display:flex; align-items:center; justify-content:center; background:
          linear-gradient(135deg, var(--df-ink-soft) 25%, transparent 25%) -12px 0 / 24px 24px,
          linear-gradient(225deg, var(--df-ink-soft) 25%, transparent 25%) -12px 0 / 24px 24px,
          linear-gradient(45deg, var(--df-ink-soft) 25%, transparent 25%) 0 0 / 24px 24px,
          linear-gradient(315deg, var(--df-ink-soft) 25%, transparent 25%) 0 0 / 24px 24px,
          #f2f4f6;
        background-blend-mode: overlay; color: var(--df-muted); font-size: 13px; font-weight: 500; text-align:center; overflow:hidden; {style}"
	>
		<span style="padding:0 12px; text-align:center;">{placeholder}</span>
	</div>
{/if}