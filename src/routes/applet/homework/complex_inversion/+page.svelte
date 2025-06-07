<script>
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Angle2D from '$lib/d3/Angle2D.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import PolarGrid from '$lib/d3/PolarGrid.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  let d1 = new Draggable(new Vector2(1, 1), PrimeColor.yellow);

  let v_inverse = $derived(
    new Vector2(
      d1.position.x / (Math.pow(d1.position.x, 2) + Math.pow(d1.position.y, 2)),
      -d1.position.y / (Math.pow(d1.position.x, 2) + Math.pow(d1.position.y, 2))
    )
  );

  const formulasLeft = $derived.by(() => {
    let f1 = new Formula('z = \\$1 \\$3 \\$2 i')
      .addAutoParam(d1.position.x.toFixed(2), PrimeColor.yellow)
      .addAutoParam(d1.position.y.toFixed(2), PrimeColor.yellow)
      .addAutoParam(d1.position.y > 0 ? '+' : '', PrimeColor.yellow);

    let f2 = new Formula('z^{-1} = \\$1 \\$3 \\$2 i')
      .addAutoParam(v_inverse.x.toFixed(2), PrimeColor.raspberry)
      .addAutoParam(v_inverse.y.toFixed(2), PrimeColor.raspberry)
      .addAutoParam(v_inverse.y > 0 ? '+' : '', PrimeColor.raspberry);

    return [f1, f2];
  });

  const formulasRight = $derived.by(() => {

    let angle = d1.position.angle() / Math.PI;
    if (angle > 1) {
      angle -= 2;
    }

    let f1 = new Formula('z = \\$1 \\cdot e^{\\$2 \\pi i}')
      .addAutoParam(d1.position.length().toFixed(2), PrimeColor.yellow)
      .addAutoParam((angle).toFixed(2), PrimeColor.yellow);

    let f2 = new Formula('z^{-1} = \\$1 \\cdot e^{\\$2 \\pi i}')
      .addAutoParam(v_inverse.length().toFixed(2), PrimeColor.raspberry)
      .addAutoParam((-angle).toFixed(2), PrimeColor.raspberry);

    return [f1, f2];
  });

  let z_angle = $derived.by(() => {
    let angle = d1.position.angle();
    if (angle > Math.PI) {
      angle = -(2 * Math.PI - angle);
    }

    return angle;
  });

  let zinv_angle = $derived(-z_angle);
</script>

<Canvas2D
  draggables={[d1]}
  formulas={formulasLeft}
  splitFormulas={formulasRight}
  title="Inverse of a complex number: Cartesian and Polar"
  cameraZoom={2.75}
  enablePan={false}
  splitCanvas2DProps={{
    cameraZoom: 2.75,
    enablePan: false,
    customAxis: true,
    draggables: [d1]
  }}
>
  <Vector2D
    direction={d1.position}
    length={d1.position.length()}
    color={PrimeColor.yellow}
    hideHead={true}
  />
  <Latex2D position={d1.position} latex="z" color={PrimeColor.yellow} />

  <Vector2D
    direction={v_inverse}
    length={v_inverse.length()}
    color={PrimeColor.raspberry}
    hideHead={true}
  />
  <Point2D position={v_inverse} color={PrimeColor.raspberry} />
  <Latex2D position={v_inverse} latex={'z^{-1}'} color={PrimeColor.raspberry} />

  <Angle2D
    endAngle={z_angle}
    startAngle={2 * Math.PI}
    color={PrimeColor.yellow}
    distance={Math.min(0.8, d1.position.length() * 0.5)}
  />

  <Angle2D
    endAngle={zinv_angle}
    startAngle={2 * Math.PI}
    color={PrimeColor.raspberry}
    distance={Math.min(0.8, Math.max(0.15, v_inverse.length() * 0.5))}
  />

  <Latex2D latex={'\\text{Im}'} position={new Vector2(0.1, 2.9)} />
  <Latex2D latex={'\\text{Re}'} position={new Vector2(2.1, 0.5)} />

  {#snippet splitCanvas2DChildren()}
    <PolarGrid highlightRadii={[1]} showAngleTicks={true} />

    <Vector2D
      direction={d1.position}
      length={d1.position.length()}
      color={PrimeColor.yellow}
      hideHead={true}
    />
    <Latex2D position={d1.position} latex="z" color={PrimeColor.yellow} />

    <Vector2D
      direction={v_inverse}
      length={v_inverse.length()}
      color={PrimeColor.raspberry}
      hideHead={true}
    />
    <Point2D position={v_inverse} color={PrimeColor.raspberry} />
    <Latex2D position={v_inverse} latex={'z^{-1}'} color={PrimeColor.raspberry} />

    <Angle2D
      endAngle={z_angle}
      startAngle={2 * Math.PI}
      color={PrimeColor.yellow}
      distance={Math.min(0.8, d1.position.length() * 0.5)}
    />

    <Angle2D
      endAngle={zinv_angle}
      startAngle={2 * Math.PI}
      color={PrimeColor.raspberry}
      distance={Math.min(0.8, Math.max(0.15, v_inverse.length() * 0.5))}
    />

    <Latex2D latex={'\\text{Im}'} position={new Vector2(0.1, 2.9)} />
    <Latex2D latex={'\\text{Re}'} position={new Vector2(2.1, 0.5)} />
  {/snippet}
</Canvas2D>
