<script>
  import { AutoPlane, PlaneFromNormal, Vector3D } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { T } from '@threlte/core';
  import { Grid, OrbitControls, Sky, Stars } from '@threlte/extras';
  import { Vector3 } from 'three';

  import { Vector2 } from 'three';
  import { useThrelte } from '@threlte/core';
  import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
  import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass';

  const { renderer, scene, camera } = useThrelte();

  export let elevation = 0;
  export let azimuth = 250;
  export let grid = true;

  let position = new Vector3(10, 10, 7);
  let zoom = 40;
</script>

<!-- <Pass pass={new UnrealBloomPass(new Vector2(256, 256), 0.5, 0.5, 0.75)} /> -->
<!-- <Pass pass={new RenderPixelatedPass(5, scene, $camera)} /> -->

<Sky {elevation} {azimuth} setEnvironment={true} />

<Stars opacity={1} />

{#if grid}
  <Grid
    position.y={-0.001}
    cellColor="#fff"
    sectionColor="#777"
    fadeDistance={50}
    cellSize={2}
    infiniteGrid
  />
{/if}

<AutoPlane values={[1, 3, 8]} let:value let:planeSegment let:color>
  <PlaneFromNormal normal={new Vector3(value, 1, 1)} {planeSegment} {color} />
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
    nearest={0.1}
    enableZoom
    maxZoom={zoom * 10}
    minZoom={Math.max(zoom - 10, 1)}
    maxPolarAngle={Math.PI * 0.6}
  />
</T.OrthographicCamera>
