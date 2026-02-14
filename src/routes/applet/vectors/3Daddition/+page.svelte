<script lang="ts">
  import { MathVector3 } from '$lib/utils/MathVector';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import VectorDeconstruction3D from '$lib/threlte/VectorDeconstruction3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { _ } from 'svelte-i18n';

  // Vectors
  const v1 = new MathVector3(2, -1, 1); //green vector
  const v2 = new MathVector3(1, 3, 3); //blue vector
  const v3 = new MathVector3(3, 2, 4); //red vector

  const labelOffset = 0.5;
</script>

<Canvas3D
  cameraPosition={new MathVector3(13.8, 3.59, 1.83)}
  cameraZoom={60}
  title={$_('applets.vectors.3Daddition.title')}
>
  <!-- lower green vector -->
  <Vector3D direction={v1} color={PrimeColor.darkGreen} length={v1.length()} />
  <Latex3D
    position={v1}
    extend={labelOffset}
    color={PrimeColor.darkGreen}
    latex={'\\begin{bmatrix} ' +
      v1.mathX +
      ' \\\\ ' +
      v1.mathY +
      ' \\\\ ' +
      v1.mathZ +
      ' \\end{bmatrix}'}
  />
  <VectorDeconstruction3D p={v1} color={PrimeColor.darkGreen} showAxisPoints />

  <!-- upper green vector -->
  <Vector3D direction={v1} origin={v2} color={PrimeColor.darkGreen} length={v1.length()} />

  <!-- blue vector -->
  <Vector3D direction={v2} color={PrimeColor.blue} length={v2.length()} />
  <Latex3D
    position={v2}
    extend={labelOffset}
    color={PrimeColor.blue}
    latex={'\\begin{bmatrix} ' +
      v2.mathX +
      ' \\\\ ' +
      v2.mathY +
      ' \\\\ ' +
      v2.mathZ +
      ' \\end{bmatrix}'}
  />
  <VectorDeconstruction3D p={v2} color={PrimeColor.blue} showAxisPoints />

  <!-- red vector -->
  <Vector3D direction={v3} color={PrimeColor.raspberry} length={v3.length()} />
  <Latex3D
    position={v3}
    extend={labelOffset}
    color={PrimeColor.raspberry}
    latex={'\\begin{bmatrix} ' +
      v3.mathX +
      ' \\\\ ' +
      v3.mathY +
      ' \\\\ ' +
      v3.mathZ +
      ' \\end{bmatrix}'}
  />
  <VectorDeconstruction3D p={v3} color={PrimeColor.raspberry} showAxisPoints />

  <Axis3D showNumbers axisLength={10} floor />
</Canvas3D>
