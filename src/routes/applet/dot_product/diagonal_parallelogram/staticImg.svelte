<script lang="ts">
  import { Latex2D, Vector2D } from '$lib/d3-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import RightAngle from '$lib/d3-components/RightAngle.svelte';

  //vars for static section
  let o_static = new Vector2(-1.5, 0);

  let w_static = new Vector2(1.5, 3);
  let v_static = new Vector2(2, -1);

  let vPlusW_static = v_static.clone().add(w_static);
  let vMinusW_static = v_static.clone().sub(w_static);
</script>

<!-- Static part of image -->

<!-- static Bases -->
<Vector2D
  origin={o_static}
  direction={v_static}
  length={v_static.length()}
  color={PrimeColor.cyan}
  let:endPoint
>
  <Latex2D
    position={endPoint}
    latex={'\\mathbf{v}'}
    offset={new Vector2(-0.4, 0.5)}
    color={PrimeColor.cyan}
  />
</Vector2D>
<Vector2D
  origin={o_static}
  direction={w_static}
  length={w_static.length()}
  color={PrimeColor.darkGreen}
  let:endPoint
>
  <Latex2D
    position={endPoint}
    latex={'\\mathbf{w}'}
    offset={new Vector2(-0.2, 0.2)}
    color={PrimeColor.darkGreen}
  />
</Vector2D>

<!-- static v+w -->
<Vector2D
  origin={o_static}
  direction={vPlusW_static}
  length={vPlusW_static.length()}
  color={PrimeColor.raspberry}
  let:endPoint
>
  <Latex2D
    position={endPoint}
    latex={'\\mathbf{v + w}'}
    offset={new Vector2(0.2, 0.2)}
    color={PrimeColor.raspberry}
  />
</Vector2D>

<!-- static v-w -->
<Vector2D
  origin={w_static.clone().add(o_static)}
  direction={vMinusW_static}
  length={vMinusW_static.length()}
  color={PrimeColor.orange}
  let:endPoint
>
  <Latex2D
    position={endPoint}
    latex={'\\mathbf{v - w}'}
    offset={new Vector2(-0.2, -0.2)}
    color={PrimeColor.orange}
  />
</Vector2D>

<!-- Static Helper lines -->
<Vector2D
  origin={w_static.clone().add(o_static)}
  direction={v_static}
  length={v_static.length()}
  color={PrimeColor.black}
  isDashed
  hideHead
/>
<Vector2D
  origin={v_static.clone().add(o_static)}
  direction={w_static}
  length={w_static.length()}
  color={PrimeColor.black}
  isDashed
  hideHead
/>

<RightAngle origin={o_static} vs={[v_static, w_static]} />
