<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { forwardEventHandlers, T, useThrelte } from '@threlte/core';
  import { Color, Vector3 } from 'three';
  import { Line2 as ThreeLine2 } from 'three/examples/jsm/lines/Line2.js';
  import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
  import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';

  export let origin: Vector3 = new Vector3(0, 0, 0); // origin of vector
  export let endPoint: Vector3 = new Vector3(1, 0, 0); // direction of vector
  export let color: string = PrimeColor.getRandomColor(); // direction of vector
  export let radius = 0.05; // direction of vector
  export let striped = false; // whether the line is striped
  export let alwaysOnTop = false; // whether the line is rendered on top of everything else

  const geometry = new LineGeometry();
  let material = new LineMaterial({
    color: new Color(color).getHex(),
    linewidth: radius,
    dashed: striped,
    worldUnits: true,
    dashScale: 10
  });
  $: geometry.setPositions([origin.x, origin.y, origin.z, endPoint.x, endPoint.y, endPoint.z]);
  $: {
    material.linewidth = radius;
    material.color.setHex(new Color(color).getHex());
    material.linewidth = radius;
    material.dashed = striped;

    if (alwaysOnTop) {
      material.depthTest = false;
      material.depthWrite = false;
      material.transparent = true;
    } else {
      material.depthTest = true;
      material.depthWrite = true;
      material.transparent = false;
    }
  }

  const { invalidate } = useThrelte();

  export const ref = new ThreeLine2(geometry, material);

  const component = forwardEventHandlers();
</script>

<T
  is={ref}
  let:ref
  {...$$restProps}
  bind:this={$component}
  on:change={invalidate}
  on:create={({ ref, cleanup }) => {
    ref.computeLineDistances();
    ref.renderOrder = 305;
    cleanup(() => {
      material.dispose();
      geometry.dispose();
    });
  }}
>
  <slot {ref} />
</T>
