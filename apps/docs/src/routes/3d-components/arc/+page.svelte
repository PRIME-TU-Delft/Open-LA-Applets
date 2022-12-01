<script lang="ts">
	import Vector3D from 'visuals-3d/components/Vector3D.svelte';
	import { Story } from 'ui';
	import { Axis3D, Canvas3D } from 'visuals-3d';
  
	import Docs from './docs.md';
	import Code from './code.md';
	import { PrimeColor } from 'utils/primeColors';
	import { Vector3 } from 'three';
    import Arc3D from 'visuals-3d/components/Arc3D.svelte';

	let axisLength = 12;

	let t = Math.PI ;

    let vtemp= new Vector3(1, 1, 0);

	let unitX = new Vector3(1, 0, 0);
	let unitY = new Vector3(0, 1, 0);

	$: v2 = unitX.clone().multiplyScalar(Math.cos(t)).add(vtemp.clone().multiplyScalar(Math.sin(t)));


	
  </script>
  
  <Story>
	<input type="range" min={Math.PI * -3} max={Math.PI * 3}  step={Math.PI / 10} bind:value={t} />

	<Canvas3D>
		
		<!-- 90 degrees -->
		<Vector3D direction={unitX} length={1} origin={unitX} color={PrimeColor.green}/>
		<Vector3D direction={unitY} length={1} origin={unitX} color={PrimeColor.green}/>

		<Arc3D points={[unitX, unitY]} origin={unitX} color={PrimeColor.green}/>


		<!-- 180 degrees -->

		<Vector3D direction={unitX} length={1} color={PrimeColor.ultramarine} origin={unitX.clone().multiplyScalar(-2)}/>
		<Vector3D direction={v2} length={1} color={PrimeColor.ultramarine} origin={unitX.clone().multiplyScalar(-2)}/>

		<Arc3D points={[unitX, v2]} color={'black'} u={new Vector3(0,1,0)} origin={unitX.clone().multiplyScalar(-2)} />



		<Axis3D {axisLength} hideNumbers={true} hideTicks={true}/>

	</Canvas3D>
  
	<div slot="docs">
	  <Docs />
	</div>
  
	<div slot="code">
	  <Code />
	</div>
  </Story>
  

