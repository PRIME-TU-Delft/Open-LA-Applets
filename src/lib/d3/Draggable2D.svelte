<script lang="ts">
	import type { Draggable } from '$lib/controls/Draggables.svelte';
	import { activityState } from '$lib/stores/activity.svelte';
	import { globalState } from '$lib/stores/globalState.svelte';
	import { INTERACTIVITY_RADIUS, POINT_SIZE } from '$lib/utils/AttributeDimensions';
	import { drag, select } from 'd3';
	import type { Snippet } from 'svelte';
	import { Vector2 } from 'three';

	type DraggableProps = {
		draggable: Draggable;
		children?: Snippet;
	};

	let { draggable, children }: DraggableProps = $props();

	let g: SVGGElement;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function dragstarted(_: DragEvent) {
		activityState.enable();
		globalState.controlsInteractive = true;
		select(g).raise();
		select(g).attr('cursor', 'grabbing');
	}

	function dragged(event: DragEvent) {
		draggable.value = new Vector2(event.x, event.y);
	}

	function dragended() {
		select(g).attr('cursor', 'grab');
		globalState.controlsInteractive = false;

		const newPoint = draggable.snapFn(draggable.value);
		draggable.value = new Vector2(newPoint.x, newPoint.y);
	}

	$effect(() => {
		// Setup the drag behavior
		select(g)
			.call(
				drag<SVGGElement, unknown>()
					.on('start', dragstarted)
					.on('drag', dragged)
					.on('end', dragended)
			)
			.raise(); // Means the drag element is lifted to the highest z-index
	});
</script>

<circle
	class="pulse"
	r={INTERACTIVITY_RADIUS}
	opacity="0.5"
	fill={draggable.color}
	role="button"
	tabindex="0"
	onmousedown={() => activityState.enable()}
	style="--x:{draggable.value.x}; --y:{draggable.value.y}"
/>
<circle cx={draggable.value.x} cy={draggable.value.y} r={POINT_SIZE} fill={draggable.color} />

{#if children}
	{@render children()}
{/if}

<g bind:this={g}>
	<circle cx={draggable.value.x} cy={draggable.value.y} r={INTERACTIVITY_RADIUS} opacity="0" />
</g>

<style>
	.pulse {
		translate: calc(var(--x) * 1px) calc(var(--y) * 1px);
		animation: pulse 3s infinite;
	}

	@keyframes pulse {
		0% {
			scale: 1;
			opacity: 0.5;
		}
		70% {
			scale: 0.5;
			opacity: 0.25;
		}
		100% {
			scale: 1;
			opacity: 0.5;
		}
	}
</style>
