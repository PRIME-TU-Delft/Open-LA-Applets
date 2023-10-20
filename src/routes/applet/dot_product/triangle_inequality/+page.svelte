<script lang="ts">
  import LatexUI from '$lib/components/Latex.svelte';
  import { Canvas2D, Latex2D, Vector2D, Draggable2D } from '$lib/d3-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  let w = new Vector2(1, 3);
  let v = new Vector2(3, 0);

  $: vPlusW = w.clone().add(v);
  $: lengths = [Math.abs(v.length()), Math.abs(w.length()), Math.abs(vPlusW.length())];
</script>

<Canvas2D>
  <Draggable2D snap id="w" bind:position={w} color={PrimeColor.ultramarine} />
  <Draggable2D snap id="v" bind:position={v} color={PrimeColor.ultramarine} />

  <!-- Bases -->
  <Vector2D direction={v} length={v.length()} color={PrimeColor.ultramarine} let:endPoint>
    <Latex2D position={endPoint} latex={'\\mathbf{v}'} offset={new Vector2(-0.2, 0.2)} />
  </Vector2D>
  <Vector2D direction={w} length={w.length()} color={PrimeColor.green} let:endPoint>
    <Latex2D position={endPoint} latex={'\\mathbf{w}'} offset={new Vector2(-0.2, 0.2)} />
  </Vector2D>

  <!-- v+w -->
  <Vector2D direction={vPlusW} length={vPlusW.length()} color={PrimeColor.red} let:endPoint>
    <Latex2D
      position={endPoint}
      latex={'\\mathbf{v} + \\mathbf{w}'}
      offset={new Vector2(0.2, 0.2)}
    />
  </Vector2D>

  <!-- Helper lins -->
  <Vector2D
    origin={v}
    direction={w}
    length={w.length()}
    color={PrimeColor.black}
    isDashed
    hideHead
  />

  <div slot="formulas">
    <LatexUI
      params={lengths}
      colors={[PrimeColor.red, PrimeColor.yellow, PrimeColor.pink]}
      latex={'\\begin{aligned} ||v|| = \\$0 \\\\ ||w|| = \\$1 \\\\ || v + w || = \\$2  \\end{aligned}'}
    />
  </div>
</Canvas2D>
