<script lang="ts">
  import { Canvas2D, Draggable2D, Latex2D, Vector2D } from '$lib/d3-components';
  import { Formulas } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  let w = new Vector2(1, 3);
  let v = new Vector2(3, 0);

  let formulas: Formulas[] = [];

  $: vPlusW = w.clone().add(v);

  function setFormulas(vLen: number, wLen: number, vPlusWLen: number) {
    const f1 = new Formulas('|| \\mathbf{v} || = \\$', Math.abs(vLen), PrimeColor.ultramarine);
    const f2 = new Formulas('|| \\mathbf{w} || = \\$', Math.abs(wLen), PrimeColor.green);
    const f3 = new Formulas(
      '|| \\mathbf{v} + \\mathbf{w} || = \\$',
      Math.abs(vPlusWLen),
      PrimeColor.red
    );

    formulas = [f1, f2, f3];
  }

  $: setFormulas(v.length(), w.length(), vPlusW.length());
</script>

<Canvas2D {formulas}>
  <Draggable2D id="w" snap bind:position={w} color={PrimeColor.green} />
  <Draggable2D id="v" snap bind:position={v} color={PrimeColor.ultramarine} />

  <!-- Bases -->
  <Vector2D direction={v} length={v.length()} color={PrimeColor.ultramarine} let:endPoint>
    <Latex2D
      position={endPoint}
      latex={'\\mathbf{v}'}
      offset={new Vector2(-0.2, 0.2)}
      color={PrimeColor.ultramarine}
    />
  </Vector2D>
  <Vector2D direction={w} length={w.length()} color={PrimeColor.green} let:endPoint>
    <Latex2D
      position={endPoint}
      latex={'\\mathbf{w}'}
      offset={new Vector2(-0.2, 0.2)}
      color={PrimeColor.green}
    />
  </Vector2D>

  <!-- v+w -->
  <Vector2D direction={vPlusW} length={vPlusW.length()} color={PrimeColor.red} let:endPoint>
    <Latex2D
      position={endPoint}
      latex={'\\mathbf{v} + \\mathbf{w}'}
      offset={new Vector2(0.2, 0.2)}
      color={PrimeColor.red}
    />
  </Vector2D>

  <!-- Helper lins -->
  <Vector2D
    origin={v}
    direction={w}
    length={w.length()}
    color={PrimeColor.green}
    isDashed
    hideHead
  />
</Canvas2D>
