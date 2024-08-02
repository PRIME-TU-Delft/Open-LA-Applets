<script>
	import { Controls } from '$lib/controls/Controls';
	import Canvas2D from '$lib/d3/Canvas2D.svelte';
	import Latex2D from '$lib/d3/Latex2D.svelte';
	import Polygon2D from '$lib/d3/Polygon2D.svelte';
	import Vector2D from '$lib/d3/Vector2D.svelte';
	import { PrimeColor } from '$lib/utils/PrimeColors';
	import { Vector2 } from 'three';

	let controls = Controls.addSlider(0, 0, 1.5, 0.1, PrimeColor.raspberry);

	// Primitives
	const o = new Vector2(0, 0);
	const u = new Vector2(4, 1);
	const v = new Vector2(1, 3);
	const w = new Vector2(-2, 1);

	// Derived
	const vw = v.clone().add(w);
	const uv = u.clone().add(v);
	const uvw = u.clone().add(v).add(w);

	// Intersect
	const intersect = new Vector2(3.35, 3.6);

	// Areas
	const OAIC = [o, u, intersect, v]; // OABC static
	const ABI = [u, uv, intersect]; // OABC dynamic

	const CIDE = [v, intersect, uvw, vw]; // OADE static
	const BDI = [uv, uvw, intersect]; // OADE dynamic

	const tick = $derived(controls[0]);
</script>

<Canvas2D {controls} showAxisNumbers={false}>
	<!-- MARK: Polygons -->
	<Polygon2D
		points={OAIC}
		color={tick > 0.5 ? PrimeColor.blue : PrimeColor.darkGreen}
		opacity={0.2}
	/>
	<Polygon2D
		points={CIDE}
		color={tick > 0.5 ? PrimeColor.blue : PrimeColor.raspberry}
		opacity={0.2}
	/>

	<Polygon2D
		offset={u.clone().multiplyScalar(Math.max(-1, -tick))}
		points={ABI}
		color={tick > 0.5 ? PrimeColor.blue : PrimeColor.darkGreen}
		strokeWidth={0}
		opacity={0.2}
	/>
	<Polygon2D
		offset={u.clone().multiplyScalar(Math.max(-1, -tick))}
		points={BDI}
		color={tick > 0.5 ? PrimeColor.blue : PrimeColor.raspberry}
		strokeWidth={0}
		opacity={0.2}
	/>

	<!-- MARK: U, V, W, V +W -->
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
		offset={new Vector2(0.1, -0.1)}
		color={PrimeColor.darkGreen}
	/>

	<Vector2D direction={w} length={w.length()} color={PrimeColor.raspberry} />
	<Latex2D
		latex={String.raw`\mathbf{w}`}
		position={w.clone().multiplyScalar(0.5)}
		offset={new Vector2(-0.1, -0.2)}
		color={PrimeColor.raspberry}
	/>

	<Vector2D direction={vw} length={vw.length()} color={PrimeColor.blue} />
	<Latex2D
		latex={String.raw`\mathbf{v + w}`}
		position={vw.clone().multiplyScalar(0.5)}
		offset={new Vector2(-1, 0.2)}
		color={PrimeColor.blue}
	/>

	<!-- MARK: U + V -->
	<Vector2D
		origin={u}
		direction={v}
		length={v.length()}
		color={PrimeColor.darkGreen}
		hideHead
		radius={0.04}
	/>
	<Vector2D
		origin={v}
		direction={u}
		length={u.length()}
		color={PrimeColor.orange}
		hideHead
		radius={0.04}
	/>

	<!-- CBDE -->
	<Vector2D
		origin={v}
		direction={w}
		length={w.length()}
		color={PrimeColor.raspberry}
		radius={0.04}
		hideHead
	/>

	<Vector2D
		origin={vw}
		direction={u}
		length={u.length()}
		color={PrimeColor.orange}
		radius={0.04}
		hideHead
	/>

	<Vector2D
		origin={uv}
		direction={w}
		length={w.length()}
		color={PrimeColor.raspberry}
		radius={0.04}
		hideHead
	/>
	<Vector2D
		origin={u}
		direction={vw}
		length={vw.length()}
		color={PrimeColor.blue}
		isDashed
		hideHead
		radius={0.04}
	/>

	<!-- MARK: A, B, C, D, E Labels -->
	<Latex2D latex={'A'} position={u} />
	<Latex2D latex={'B'} position={uv} offset={new Vector2(0.1, 0.2)} />
	<Latex2D latex={'C'} position={v} offset={new Vector2(0, 0.4)} />
	<Latex2D latex={'D'} position={uvw} extend={0.35} />
	<Latex2D latex={'E'} position={vw} extend={0.35} />

	{#if tick < 0.5}
		<Latex2D
			latex={'OABC'}
			position={uv.clone().multiplyScalar(0.5)}
			offset={new Vector2(-0.1, 0.2)}
		/>
		<Latex2D latex={'CBDE'} position={new Vector2(1.5, 4)} offset={new Vector2(-0.1, 0.2)} />
	{:else}
		<Latex2D
			latex={'OADE'}
			position={uvw.clone().multiplyScalar(0.5)}
			offset={new Vector2(-0.1, 0.2)}
		/>
	{/if}
</Canvas2D>
