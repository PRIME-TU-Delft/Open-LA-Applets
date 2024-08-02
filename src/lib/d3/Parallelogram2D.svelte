<script lang="ts">
	import type { Vector2 } from 'three';

	type ParallelogramProps = {
		points: [Vector2, Vector2, Vector2];
		color?: string;
		strokeWidth?: number;
		opacity?: number;
	};

	let { points, color = 'black', strokeWidth = 1, opacity = 1 }: ParallelogramProps = $props();

	const [a, b, c] = $derived(points.map((p) => p.toArray().join(',')));

	const d = $derived(points[1].clone().add(points[2]).sub(points[0]).toArray().join(','));
</script>

<!-- @component
  This component is used to draw a parallelogram in 2D. It needs three points to be defined and will automatically calculate the fourth point.
 -->

<polygon
	fill={color}
	stroke="black"
	stroke-width={strokeWidth * 0.05}
	{opacity}
	points="{a} {b} {d} {c} "
/>
