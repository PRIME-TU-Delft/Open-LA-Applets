<script lang="ts">
	import { Vector2 } from 'three';

	type TriangleProps = {
		points: Vector2[];
		color?: string;
	};

	let { points, color = 'black' }: TriangleProps = $props();
</script>

<!-- @component
@props
- points: Vector2[] - The points of the triangle.
- color: string - The color of the triangle.

@example
<Triangle points={[new Vector2(0, 0), new Vector2(1, 0), new Vector2(0, 1)]} />
-->

<polygon points={points.map((p) => p.x + ',' + p.y).join(' ')} fill={color} />
