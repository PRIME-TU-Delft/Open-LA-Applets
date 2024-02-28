<script>
  import { AutoPlane, PlaneFromNormal, Vector3D } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { T } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';
  import { Vector3 } from 'three';
  import CustomRenderer from '$lib/threlte-components/CustomRenderer.svelte';

  export let elevation = 0;
  export let azimuth = 250;
  export let grid = true;

  let position = new Vector3(10, 10, 7);
  let zoom = 40;
</script>

<AutoPlane values={[1, 3, 8]} let:value let:planeSegment let:color>
  <PlaneFromNormal normal={new Vector3(value, 1, 1)} {planeSegment} {color} opacity={1} />
</AutoPlane>

<Vector3D
  color={PrimeColor.blue}
  length={28}
  origin={new Vector3(0, -10, 10)}
  direction={new Vector3(0, 1, -1)}
  radius={0.2}
  hideHead
/>

<T.OrthographicCamera makeDefault position={[position.x, position.y, position.z]} fov={10} {zoom}>
  <OrbitControls
    enableZoom
    maxZoom={zoom * 10}
    minZoom={Math.max(zoom - 10, 1)}
    maxPolarAngle={Math.PI * 0.6}
    autoRotate
    autoRotateSpeed={0.3}
  />
</T.OrthographicCamera>

<CustomRenderer {elevation} {azimuth} {grid} />
