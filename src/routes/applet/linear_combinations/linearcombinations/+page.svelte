<script lang="ts">
  import { Canvas2D, Latex2D, Vector2D, Draggable2D } from '$lib/d3-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const v1 = new Vector2(1.5, 0.5);
  const v2 = new Vector2(0.5, 2);

  let u = new Vector2(4, 5);

  $: beta = (u.x + u.y * (-v1.x / v1.y)) / (v2.x - v2.y * (v1.x / v1.y));
  $: alpha = (u.x - v2.x * beta) / v1.x;

  $: v1Extended = v1.length() * alpha;
  $: v2Extended = v2.length() * beta;
</script>

<Canvas2D cameraZoom={0.7}>
  <Draggable2D snap id="u" bind:position={u} color={PrimeColor.blue} />

  <!-- Bases -->
  <Vector2D direction={v1} length={v1.length()} color={PrimeColor.darkGreen} let:endPoint>
    <Latex2D
      position={endPoint}
      latex={'\\mathbf{v}_1'}
      offset={new Vector2(0.2, -0.1)}
      color={PrimeColor.darkGreen}
    />
  </Vector2D>
  <Vector2D direction={v2} length={v2.length()} color={PrimeColor.red} let:endPoint>
    <Latex2D
      position={endPoint}
      latex={'\\mathbf{v}_2'}
      offset={new Vector2(0.2, 0.2)}
      color={PrimeColor.red}
    />
  </Vector2D>

  <!-- u -->
  <Vector2D direction={u} length={u.length()} color={PrimeColor.blue} let:endPoint>
    <Latex2D
      position={endPoint}
      latex={'\\mathbf{u}'}
      offset={new Vector2(0.1, 0.2)}
      color={PrimeColor.blue}
    />
  </Vector2D>

  <!-- Bases extended -->
  <Vector2D
    direction={v1.clone().multiplyScalar(alpha)}
    length={Math.abs(v1Extended)}
    color={PrimeColor.darkGreen}
    isDashed
    let:endPoint
  >
    {#key alpha}
      <Latex2D
        position={endPoint.clone().add(endPoint.clone().normalize().multiplyScalar(0.3))}
        latex={`${alpha.toFixed(2)} \\mathbf{v}_1`}
      />
    {/key}
    <Vector2D
      origin={endPoint}
      direction={v2}
      length={v2Extended}
      color={PrimeColor.black}
      isDashed
      hideHead
    />
  </Vector2D>

  <Vector2D
    direction={v2.clone().multiplyScalar(beta)}
    length={Math.abs(v2Extended)}
    color={PrimeColor.red}
    isDashed
    let:endPoint
  >
    {#key beta}
      <Latex2D
        position={endPoint}
        offset={endPoint.clone().normalize().multiplyScalar(0.45).sub(new Vector2(0.4, 0))}
        latex={`${beta.toFixed(2)} \\mathbf{v}_2`}
      />
    {/key}
    <Vector2D
      origin={endPoint}
      direction={v1}
      length={v1Extended}
      color={PrimeColor.black}
      isDashed
      hideHead
    />
  </Vector2D>
</Canvas2D>
