<script lang="ts">
	import Canvas2D from '$lib/d3/Canvas2D.svelte';
	import Latex2D from '$lib/d3/Latex2D.svelte';
	import Line2D from '$lib/d3/Line2D.svelte';
	import Vector2D from '$lib/d3/Vector2D.svelte';
	import Axis3D from '$lib/threlte/Axis3D.svelte';
	import Latex3D from '$lib/threlte/Latex3D.svelte';
	import Line3D from '$lib/threlte/Line3D.svelte';
	import Vector3D from '$lib/threlte/Vector3D.svelte';
	import { Formula } from '$lib/utils/Formulas';
	import { PrimeColor } from '$lib/utils/PrimeColors';
	import { Vector2, Vector3 } from 'three';

	const e1 = new Vector2(1, 0);
	const e2 = new Vector2(0, 1);

	const e1Length = 1;
	const e2Length = 2;

	const v = e1.clone().multiplyScalar(e1Length).add(e2.clone().multiplyScalar(e2Length));

	const te1 = $derived(new Vector3(e1.y, 0, e1.x));
	const te2 = $derived(new Vector3(e2.y, 0, e2.x));
	const tv = $derived(te2.clone().multiplyScalar(2).add(te1));

	const f1 = new Formula('T(x)= \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\\\ 0 & 0 \\end{bmatrix} x');
</script>

<Canvas2D
	formulas={[f1]}
	showFormulasDefault
	cameraZoom={1.5}
	cameraPosition={new Vector2(1, 2)}
	splitCanvas3DProps={{ cameraZoom: 50 }}
>
	<!-- e1 -->
	<Vector2D direction={e1} length={1} color={PrimeColor.raspberry}>
		<Latex2D latex={'\\mathbf{e_1}'} position={e1} offset={new Vector2(0, -0.2)} />
	</Vector2D>

	<!-- e2 -->
	<Vector2D direction={e2} length={1} color={PrimeColor.yellow}>
		<Latex2D latex={'\\mathbf{e_2}'} position={e2} offset={new Vector2(-0.2, 0)} />
	</Vector2D>

	<!-- v -->
	<Vector2D direction={v} length={v.length()} color={PrimeColor.blue}>
		<Latex2D
			latex={'\\mathbf{v}'}
			position={v}
			offset={new Vector2(0.1, 0.1)}
			color={PrimeColor.blue}
		/>
	</Vector2D>

	<!-- Helper lines -->
	<Line2D start={e1.clone().multiplyScalar(e1Length)} end={v} width={0.05} isDashed />
	<Line2D start={e2.clone().multiplyScalar(e2Length)} end={v} width={0.05} isDashed />

	{#snippet splitCanvas3DChildren()}
		<Axis3D />

		<!-- e1 & e2 -->
		<Vector3D direction={te1} length={1} color={PrimeColor.raspberry} />
		<Vector3D direction={te2} length={1} color={PrimeColor.yellow} />

		<Latex3D latex={'T(\\mathbf{e_1})'} position={te1} />
		<Latex3D latex={'T(\\mathbf{e_2})'} position={te2} />

		<Vector3D direction={tv} length={v.length()} color={PrimeColor.blue} />
		<Latex3D latex={'T(\\mathbf{v})'} position={tv} color={PrimeColor.blue} />

		<!-- Helper lines -->
		<Line3D
			origin={te1.clone().multiplyScalar(e1Length)}
			endPoint={tv.clone()}
			color="black"
			isDashed
		/>
		<Line3D
			origin={te2.clone().multiplyScalar(e2Length)}
			endPoint={tv.clone()}
			color="black"
			isDashed
		/>
	{/snippet}
</Canvas2D>
