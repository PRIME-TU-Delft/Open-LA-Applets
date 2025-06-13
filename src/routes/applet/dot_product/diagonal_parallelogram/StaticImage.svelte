<script lang="ts">
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import RightAngle2D from '$lib/d3/RightAngle2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  let w_static = new Vector2(1.5, 3);
  let v_static = new Vector2(2, -1);

  let vPlusW_static = v_static.clone().add(w_static);
  let vMinusW_static = v_static.clone().sub(w_static);
</script>

<!-- Static part of image -->

<!-- static Bases -->
<Vector2D direction={v_static} length={v_static.length()} color={PrimeColor.cyan}>
  {#snippet children(endPoint)}
    <Latex2D
      position={endPoint}
      latex={'\\mathbf{v}'}
      offset={new Vector2(-0.4, 0.5)}
      color={PrimeColor.cyan}
    />
  {/snippet}
</Vector2D>
<Vector2D direction={w_static} length={w_static.length()} color={PrimeColor.darkGreen}>
  {#snippet children(endPoint)}
    <Latex2D
      position={endPoint}
      latex={'\\mathbf{w}'}
      offset={new Vector2(-0.2, 0.2)}
      color={PrimeColor.darkGreen}
    />
  {/snippet}
</Vector2D>

<!-- static v+w -->
<Vector2D direction={vPlusW_static} length={vPlusW_static.length()} color={PrimeColor.raspberry}>
  {#snippet children(endPoint)}
    <Latex2D
      position={endPoint}
      latex={'\\mathbf{v + w}'}
      offset={new Vector2(0.2, 0.2)}
      color={PrimeColor.raspberry}
    />
  {/snippet}
</Vector2D>

<!-- static v-w -->
<Vector2D
  origin={w_static.clone()}
  direction={vMinusW_static}
  length={vMinusW_static.length()}
  color={PrimeColor.orange}
>
  {#snippet children(endPoint)}
    <Latex2D
      position={endPoint}
      latex={'\\mathbf{v - w}'}
      offset={new Vector2(-0.2, -0.2)}
      color={PrimeColor.orange}
    />
  {/snippet}
</Vector2D>

<!-- Static Helper lines -->
<Vector2D
  origin={w_static.clone()}
  direction={v_static}
  length={v_static.length()}
  color={PrimeColor.black}
  isDashed
  hideHead
/>
<Vector2D
  origin={v_static.clone()}
  direction={w_static}
  length={w_static.length()}
  color={PrimeColor.black}
  isDashed
  hideHead
/>

<RightAngle2D vs={[v_static, w_static]} />
