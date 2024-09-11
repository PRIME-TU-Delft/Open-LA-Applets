<script>
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import { Vector3 } from 'three';
  import Scene from './Scene.svelte';
  import { Controls } from '$lib/controls/Controls';
  import { PrimeColor } from '$lib/utils/PrimeColors';

  const controls = Controls.addToggle(false, 'Sorted', PrimeColor.darkGreen);
</script>

<Canvas3D {controls} cameraPosition={new Vector3(0, 0, -10)} cameraZoom={50}>
  <Scene sorted={controls[0]} />

  <Axis3D />
</Canvas3D>
