<script>
  import CustomRenderer from '$lib/threlte/CustomRenderer.svelte';
  import PlaneFromNormal from '$lib/threlte/planes/PlaneFromNormal.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { T } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';
  import { Vector3 } from 'three';

  let elevation = -2;
  let azimuth = 180;
  let grid = true;

  let position = new Vector3(10, 10, 7);
  let zoom = 40;
</script>

<PlaneFromNormal normal={new Vector3(1, 1, 1)} color={PrimeColor.raspberry} size={12} opacity={1} />
<PlaneFromNormal normal={new Vector3(3, 1, 1)} color={PrimeColor.yellow} size={11} opacity={1} />
<PlaneFromNormal normal={new Vector3(8, 1, 1)} color={PrimeColor.darkGreen} size={10} opacity={1} />

<Vector3D
  color={PrimeColor.blue}
  length={28}
  origin={new Vector3(0, -10, 10)}
  direction={new Vector3(0, 1, -1)}
  radius={2}
  hideHead
/>

<T.OrthographicCamera makeDefault position={[position.x, position.y, position.z]} fov={10} {zoom}>
  <OrbitControls
    enableZoom
    maxZoom={zoom * 10}
    minZoom={Math.max(zoom - 10, 1)}
    maxPolarAngle={Math.PI * 0.6}
    autoRotateSpeed={0.3}
  />
</T.OrthographicCamera>

<CustomRenderer {elevation} {azimuth} {grid} />
