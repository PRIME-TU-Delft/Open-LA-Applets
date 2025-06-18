<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import Line3D from '$lib/threlte/Line3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import NumberFlow from '@number-flow/svelte';
  import { Vector3 } from 'three';

  const vDir = new Vector3(3, 2, -3);
  const lineDir = vDir.clone().normalize().multiplyScalar(10);
  const controls = Controls.addSlider(vDir.length(), -9, 9, 0.5, PrimeColor.raspberry, {
    label: 'length',
    labelFormat
  });

  // Do not allow the vector to be zero, otherwise the direction is not defined
  const vLength = $derived(Math.abs(controls[0]) <= 0.0001 ? 0.5 : controls[0]);

  const v = $derived(vDir.clone().normalize().multiplyScalar(vLength)); // Direction of vector v
</script>

{#snippet labelFormat(value: number)}
  <NumberFlow {value} />
{/snippet}

<Canvas3D {controls} title="Span of a vector">
  <Vector3D alwaysOnTop direction={v} length={v.length()} color={PrimeColor.raspberry}>
    {#snippet children(endPoint)}
      <Latex3D
        latex={'\\mathbf{v}'}
        position={endPoint}
        extend={0.5}
        color={PrimeColor.raspberry}
      />
    {/snippet}
  </Vector3D>

  <Line3D
    origin={lineDir.clone().multiplyScalar(-1)}
    endPoint={lineDir}
    color={PrimeColor.darkGreen}
  />
  <Latex3D
    latex={'Span\\{\\mathbf{v}\\}'}
    position={lineDir.clone().add(new Vector3(0, 0.4, 0))}
    color={PrimeColor.darkGreen}
  />
  <Axis3D />
</Canvas3D>
