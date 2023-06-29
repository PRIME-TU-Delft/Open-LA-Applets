<script>
	import { Vector3 } from 'three';
	import { LatexUI } from 'ui';
	import { Angle3D, Axis3D, Canvas3D, Latex3D, Point3D, Vector3D } from '$lib/threlte-components';

	import { PrimeColor } from 'utils/PrimeColors';
	import { Sliders } from 'utils/Slider';

	let sliders = new Sliders().addSlider(4.5, 3, 6).addSlider(6, 4, 8);

	$: v_q = new Vector3(2, 0, -1).normalize().multiplyScalar(sliders.x);
	$: v_a = v_q.clone().add(new Vector3(0, 1, 0).multiplyScalar(sliders.y));
	$: v_p = v_q.clone().projectOnVector(new Vector3(1, 0, 0));

	$: v_len = Math.sqrt(sliders.x * sliders.x + sliders.y * sliders.y);
</script>

<Canvas3D bind:sliders>
	<!-- Vector q [Red] -->
	<Vector3D direction={v_q} color={PrimeColor.red} length={sliders.x} />
	<Latex3D latex={'Q'} position={v_q} />

	<!-- Vector a [Yellow] -->
	<Vector3D
		origin={v_q}
		direction={new Vector3(0, 1, 0)}
		color={PrimeColor.yellow}
		length={sliders.y}
	/>
	<Latex3D latex={'A'} position={v_a} />

	<!-- Vector v [Blue] -->
	<Vector3D direction={v_a} color={PrimeColor.ultramarine} length={v_len} />
	<Latex3D latex={'\\vec{v}'} position={v_a.clone().multiplyScalar(0.5)} />

	<!-- Helper green lines -->
	<Vector3D color={PrimeColor.green} direction={v_p} length={v_p.length()} />
	<Vector3D
		direction={new Vector3(0, 0, -1)}
		origin={v_p}
		color={PrimeColor.green}
		length={-v_q.z}
	/>

	<!-- Angle green lines -->
	<Angle3D vs={[new Vector3(0, 0, -1), v_p]} origin={v_p} />

	<!-- Angle Red and Yellow -->
	<Angle3D vs={[v_q, new Vector3(0, 1, 0)]} origin={v_q} />

	<!-- Helper striped lines -->
	<Vector3D
		direction={v_q}
		origin={new Vector3(0, sliders.y, 0)}
		color={'black'}
		striped
		length={sliders.x}
	/>
	<Vector3D striped origin={new Vector3(0, 0, v_a.z)} color="black" length={v_p.x} />

	<!--  P, a_1 -->
	<Latex3D latex={'P, a_1'} position={v_p} offset={0.5} />
	<Point3D position={v_p} color={PrimeColor.green} />

	<!-- a_2 -->
	<Latex3D latex={'a_2'} position={new Vector3(0, 0, v_a.z)} offset={0.5} />
	<Point3D position={new Vector3(0, 0, v_a.z)} color={PrimeColor.black} />

	<Latex3D latex={'a_3'} position={new Vector3(0, sliders.y, 0)} offset={0.5} />
	<Point3D position={new Vector3(0, sliders.y, 0)} color={PrimeColor.black} />

	<div slot="formulas">
		<LatexUI
			params={[sliders.x, sliders.y]}
			colors={[PrimeColor.red, PrimeColor.yellow]}
			latex={'\\begin{aligned} OQ = \\$0 \\\\ QA = \\$1  \\end{aligned}'}
		/>

		<LatexUI
			params={[v_len, sliders.x, sliders.y]}
			colors={[PrimeColor.ultramarine, PrimeColor.red, PrimeColor.yellow]}
			latex={'\\begin{aligned} OA = || \\vec{v} || = \\sqrt{\\$1^2 + \\$2^2} \\\\ = \\$0  \\end{aligned}'}
		/>
	</div>

	<Axis3D showNumbers floor />
</Canvas3D>
