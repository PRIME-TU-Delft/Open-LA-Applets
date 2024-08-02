<script lang="ts">
	import * as Button from '$lib/components/ui/button';
	import { cn } from '$lib/utils/shadcn-utils';
	import type { Snippet } from 'svelte';

	type SideButtonProps = {
		tooltip: string;
		translate?: string;
		class?: string;
		onclick?: (e: MouseEvent) => void;
		children: Snippet;
	};

	let {
		tooltip = '',
		translate = 'left-1/2 -translate-x-1/2 top-5 scale-0',
		class: classes = '',
		onclick = () => {},
		children
	}: SideButtonProps = $props();

	const outerClasses = $derived(
		cn(
			'absolute top-1/2 -translate-y-1/2 z-[-1] scale-100 hover:scale-105 motion-safe:transition-all rounded-lg backdrop-blur-sm bg-blue-200/80 hover:bg-blue-300/80',
			translate
		)
	);
	const innerClasses = $derived(cn('w-16 h-8 flex gap-0.5 text-blue-900', classes));
</script>

<div class={outerClasses}>
	<Button.Action onclick={(e) => onclick(e)} class={innerClasses} {tooltip} side="top">
		{@render children()}
	</Button.Action>
</div>
