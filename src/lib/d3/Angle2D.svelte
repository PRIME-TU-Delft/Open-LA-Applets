<script lang="ts">
	import { LINE_WIDTH } from '$lib/utils/AttributeDimensions';
	import { PrimeColor } from '$lib/utils/PrimeColors';
	import { arc, symbol, symbolTriangle } from 'd3';
	import { Vector2 } from 'three';

	type AngleProps = {
		color?: string;
		startAngle?: number;
		endAngle?: number;
		origin?: Vector2;
		width?: number;
		distance?: number;
		hasHead?: boolean;
	};

	let {
		color = PrimeColor.black,
		startAngle = 0,
		endAngle = 0,
		origin = new Vector2(0, 0),
		width = LINE_WIDTH,
		distance = 0.8,
		hasHead = false
	}: AngleProps = $props();

	let d = $derived(
		arc()({
			innerRadius: distance - width / 2,
			outerRadius: distance + width / 2,
			startAngle: startAngle + Math.PI / 2,
			endAngle: endAngle + Math.PI / 2
		})
	);

	let triangle = $derived(
		symbol()
			.type(symbolTriangle)
			.size(2 * width)()
	);
</script>

<g transform="translate({origin.x},{origin.y})">
	<path {d} fill={color} />

	{#if hasHead}
		<g
			transform="rotate({(endAngle / Math.PI) *
				180}) translate({distance}, 0) rotate(180) translate(0, {2 * Math.PI * width})"
		>
			<path transform="" d={triangle} fill={color} />
		</g>
	{/if}
</g>
