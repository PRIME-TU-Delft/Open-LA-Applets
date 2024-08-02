<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { cn } from '$lib/utils/shadcn-utils.js';
	import type { Snippet } from 'svelte';

	type ButtonActionProps = {
		class?: string;
		tooltip: string;
		side?: 'top' | 'right' | 'bottom' | 'left';
		onclick?: (e: MouseEvent) => void;
		children?: Snippet;
	};

	let {
		class: className = '',
		tooltip,
		side = 'left',
		onclick,
		children
	}: ButtonActionProps = $props();
</script>

<button onclick={(e) => onclick?.(e)}>
	<Tooltip.Root openDelay={300} closeDelay={50}>
		<Tooltip.Trigger
			class={cn(
				'w-12 h-12 bg-slate-300 hover:bg-slate-400 transition-colors rounded flex justify-center items-center',
				className
			)}
			style="background: var(--bg)"
		>
			{@render children?.()}
		</Tooltip.Trigger>
		<Tooltip.Content {side} transitionConfig={{ x: 5, duration: 100 }}>
			<p>{tooltip}</p>
		</Tooltip.Content>
	</Tooltip.Root>
</button>
