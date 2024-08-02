<script lang="ts">
	import { Controls } from '$lib/controls/Controls';
	import Canvas2D from '$lib/d3/Canvas2D.svelte';
	import Latex2D from '$lib/d3/Latex2D.svelte';
	import Point2D from '$lib/d3/Point2D.svelte';
	import Polygon2D from '$lib/d3/Polygon2D.svelte';
	import Vector2D from '$lib/d3/Vector2D.svelte';
	import { POINT_SIZE } from '$lib/utils/AttributeDimensions';
	import { PrimeColor } from '$lib/utils/PrimeColors';
	import { Vector2 } from 'three';

	let controls = Controls.addSlider(0, 0, 3.5, 0.1, PrimeColor.raspberry);

	const clamp = (number: number, min: number, max: number) => Math.max(min, Math.min(number, max));

	// Primitives
	const o = new Vector2(0, 0);
	const u = new Vector2(4, 1);
	const v = new Vector2(1, 3);
	const w = new Vector2(2, -0.5);

	// Derived
	const vw = v.clone().add(w);
	const uw = u.clone().add(w);
	const uv = u.clone().add(v);
	const uvw = u.clone().add(v).add(w);

	// Added
	const OAFC = [o, u, uv, v]; // OAFC
	const OAFCG = [o, u, uv, v, vw]; // OAFCG
	const OGC = [o, vw, v]; // OGC
	const OAEG = [o, u, uvw, vw]; // OAEG
	const CGEF = [v, vw, uvw, uv]; // CGEF

	// Subtract
	const OBDA = [o, w, uw, u]; // OBDA / CGEF
</script>

<Canvas2D {controls} showAxisNumbers={false}>
	<!-- MARK: Polygons -->
	{#if controls[0] < 1}
		<Polygon2D
			points={OAFC}
			color={PrimeColor.darkGreen + PrimeColor.opacity(0.2)}
			strokeColor={PrimeColor.darkGreen}
			strokeWidth={0.75}
		/>
	{:else if controls[0] < 2}
		<Polygon2D
			points={OAFCG}
			color={PrimeColor.darkGreen + PrimeColor.opacity(0.2)}
			strokeColor={PrimeColor.darkGreen}
			strokeWidth={0.75}
		/>

		<Polygon2D
			points={OGC}
			offset={u.clone().multiplyScalar(clamp(controls[0] - 1, 0, 1))}
			color={PrimeColor.darkGreen + PrimeColor.opacity(0.2)}
			strokeColor={PrimeColor.darkGreen}
			strokeWidth={0.75}
		/>
	{:else}
		<Polygon2D
			points={CGEF}
			color={PrimeColor.blue + PrimeColor.opacity(0.2)}
			strokeColor={PrimeColor.blue}
			strokeWidth={0.75}
			opacity={3 - controls[0]}
		/>

		<Polygon2D
			points={OAEG}
			color={(controls[0] > 2 ? PrimeColor.blue : PrimeColor.darkGreen) + PrimeColor.opacity(0.1)}
			strokeColor={PrimeColor.blue}
			strokeWidth={0.75}
		/>
	{/if}

	<Polygon2D
		points={OBDA}
		offset={v.clone().multiplyScalar(Math.min(1, controls[0]))}
		color={PrimeColor.raspberry + PrimeColor.opacity(0.2)}
		strokeColor={PrimeColor.raspberry}
		strokeWidth={0.75}
		opacity={3 - controls[0]}
	/>

	<!-- MARK: U, V, W, V + W -->
	<Vector2D direction={u} length={u.length()} color={PrimeColor.orange} />
	<Latex2D
		latex={String.raw`\mathbf{u}`}
		position={u.clone().multiplyScalar(0.5)}
		offset={new Vector2(0, -0.1)}
		color={PrimeColor.orange}
	/>

	<Vector2D direction={v} length={v.length()} color={PrimeColor.darkGreen} />
	<Latex2D
		latex={String.raw`\mathbf{v}`}
		position={v.clone().multiplyScalar(0.5)}
		offset={new Vector2(0, -0.1)}
		color={PrimeColor.darkGreen}
	/>

	<Vector2D direction={w} length={w.length()} color={PrimeColor.raspberry} />
	<Latex2D
		latex={String.raw`\mathbf{w}`}
		position={w.clone().multiplyScalar(0.5)}
		offset={new Vector2(0, -0.1)}
		color={PrimeColor.raspberry}
	/>

	<!-- MARK: VW -->
	{#if controls[0] > 1}
		<Vector2D direction={vw} length={vw.length()} color={PrimeColor.blue} />
		<Latex2D
			latex={String.raw`\mathbf{v+w}`}
			position={vw.clone().multiplyScalar(0.5)}
			offset={new Vector2(-0.8, 0.3)}
			color={PrimeColor.blue}
		/>

		<Vector2D origin={u} direction={vw} length={vw.length()} color={PrimeColor.blue} hideHead />
	{/if}

	<!-- MARK: LABELS A-G -->
	<Point2D position={uw} />
	<Point2D position={uvw} />
	<Point2D position={vw} />
	<Point2D position={uv} radius={POINT_SIZE * 0.75} />
	<Point2D position={v} radius={POINT_SIZE * 0.75} />
	<Point2D position={w} radius={POINT_SIZE * 0.75} />
	<Point2D position={o} radius={POINT_SIZE * 0.75} />
	<Point2D position={u} radius={POINT_SIZE * 0.75} />

	<Latex2D latex={'A'} position={u} offset={new Vector2(0.15, 0.3)} />
	<Latex2D latex={'B'} position={w} offset={new Vector2(-0.1, -0.2)} />
	<Latex2D latex={'C'} position={v} offset={new Vector2(0, 0.4)} />
	<Latex2D latex={'D'} position={uw} extend={0.15} />
	<Latex2D latex={'E'} position={uvw} extend={0.15} />
	<Latex2D latex={'F'} position={uv} offset={new Vector2(0.1, 0.25)} />
	<Latex2D latex={'G'} position={vw} offset={new Vector2(0.1, 0.25)} />

	{#if controls[0] < 2}
		<Latex2D
			latex={'OAFC'}
			position={uv.clone().multiplyScalar(0.5)}
			offset={new Vector2(-0.2, -0.1)}
		/>
	{:else if controls[0] >= 2}
		<Latex2D
			latex={'OAEG'}
			position={uvw.clone().multiplyScalar(0.5)}
			offset={new Vector2(-0.2, 0.2)}
		/>
	{/if}

	{#if controls[0] < 0.25}
		<Latex2D
			latex={'OBDA'}
			position={uw.clone().multiplyScalar(0.5)}
			offset={new Vector2(-0.1, 0.2)}
			fontSize={1 - controls[0]}
		/>
	{:else if controls[0] > 0.75 && controls[0] < 2.25}
		<Latex2D
			latex={'CGEF'}
			position={new Vector2(3, 3)}
			offset={new Vector2(-0.1, 0.2)}
			fontSize={Math.min(1, controls[0])}
		/>
	{/if}
</Canvas2D>
