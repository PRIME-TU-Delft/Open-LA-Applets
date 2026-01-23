<script lang="ts">
  import { MathVector3 } from '$lib/utils/MathVector';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import Line3D from '$lib/threlte/Line3D.svelte';
  import PlaneFromNormal from '$lib/threlte/planes/PlaneFromNormal.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const e1 = new Vector2(1, 0);
  const e2 = new Vector2(0, 1);

  const draggables = [new Draggable(new Vector2(1, 2), PrimeColor.blue, '', Draggable.snapToGrid)];

  const v = $derived(draggables[0].position);

  const te1 = new MathVector3(e1.x, e1.y, 0);
  const te2 = new MathVector3(e2.x, e2.y, 0);
  const tv = $derived(new MathVector3(v.x, v.y, 0));

  const f1 = new Formula(
    'T(\\mathbf{x})= \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\\\ 0 & 0 \\end{pmatrix} \\mathbf{x}'
  );
</script>

<Canvas2D
  formulas={[f1]}
  {draggables}
  showFormulasDefault
  cameraZoom={2}
  cameraPosition={new Vector2(1, 2)}
  splitCanvas3DProps={{ cameraZoom: 100 }}
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
  <Line2D start={e1.clone().multiplyScalar(v.x)} end={v} width={0.05} isDashed />
  <Line2D start={e2.clone().multiplyScalar(v.y)} end={v} width={0.05} isDashed />

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
    <Line3D origin={te1.clone().multiplyScalar(v.x)} endPoint={tv.clone()} color="black" isDashed />
    <Line3D origin={te2.clone().multiplyScalar(v.y)} endPoint={tv.clone()} color="black" isDashed />

    <PlaneFromNormal
      position={new MathVector3(0, 0, 0)}
      normal={new MathVector3(0, 0, 1)}
      size={10}
      color={PrimeColor.yellow}
      opacity={0.2}
    />
  {/snippet}
</Canvas2D>
