<script lang="ts">
  import { Canvas2D, Draggable2D, Latex2D, Vector2D } from '$lib/d3-components';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  let w = new Vector2(1, 3);
  let v = new Vector2(3, 0);

  let formulas: Formula[] = [];

  $: vPlusW = w.clone().add(v);

  function setFormulas(vLen: number, wLen: number, vPlusWLen: number) {
    const f1 = new Formula('|| \\mathbf{v} || = \\$', Math.abs(vLen), PrimeColor.blue);
    const f2 = new Formula('|| \\mathbf{w} || = \\$', Math.abs(wLen), PrimeColor.darkGreen);
    const f3 = new Formula(
      '|| \\mathbf{v} + \\mathbf{w} || = \\$',
      Math.abs(vPlusWLen),
      PrimeColor.red
    );

    formulas = [f1, f2, f3];
  }

  $: setFormulas(v.length(), w.length(), vPlusW.length());
</script>

<Canvas2D {formulas}>
  <Draggable2D id="w" snap bind:position={w} color={PrimeColor.darkGreen} />
  <Draggable2D id="v" snap bind:position={v} color={PrimeColor.blue} />

  <!-- Bases -->
  <Vector2D direction={v} length={v.length()} color={PrimeColor.blue} let:endPoint>
    <Latex2D
      position={endPoint}
      latex={'\\mathbf{v}'}
      offset={new Vector2(-0.2, 0.2)}
      color={PrimeColor.blue}
    />
  </Vector2D>
  <Vector2D direction={w} length={w.length()} color={PrimeColor.darkGreen} let:endPoint>
    <Latex2D
      position={endPoint}
      latex={'\\mathbf{w}'}
      offset={new Vector2(-0.2, 0.2)}
      color={PrimeColor.darkGreen}
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
    color={PrimeColor.darkGreen}
    isDashed
    hideHead
  />
</Canvas2D>
