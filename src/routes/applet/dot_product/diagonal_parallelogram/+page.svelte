<script lang="ts">
  import { Arc2D, Canvas2D, Latex2D, Vector2D, Draggable2D } from '$lib/d3-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  let w = new Vector2(2, 3);
  let v = new Vector2(3, -2);

  $: vPlusW = w.clone().add(v);
  $: vMinusW = v.clone().sub(w);
</script>

<Canvas2D>
  <Draggable2D snap id="b1" bind:position={w} color={PrimeColor.blue} />
  <Draggable2D snap id="b2" bind:position={v} color={PrimeColor.blue} />

  <!-- Arcs -->
  <Arc2D points={[v, w]} distance={0.75} color={PrimeColor.green} />

  <!-- Bases -->
  <Vector2D direction={v} length={v.length()} color={PrimeColor.blue} let:endPoint>
    <Latex2D position={endPoint} latex={'\\mathbf{v}'} offset={new Vector2(-0.2, 0.5)} />
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

  <!-- v-w -->
  <Vector2D
    origin={w}
    direction={vMinusW}
    length={vMinusW.length()}
    color={PrimeColor.pink}
    let:endPoint
  >
    <Latex2D
      position={endPoint}
      latex={'\\mathbf{v} - \\mathbf{w}'}
      offset={new Vector2(-0.2, -0.2)}
    />
  </Vector2D>

  <!-- Helper lins -->
  <Vector2D
    origin={w}
    direction={v}
    length={v.length()}
    color={PrimeColor.black}
    isDashed
    hideHead
  />
  <Vector2D
    origin={v}
    direction={w}
    length={w.length()}
    color={PrimeColor.black}
    isDashed
    hideHead
  />
</Canvas2D>
