<script lang="ts">
  // For ease of creating the template applets
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { ViewBox } from '$lib/d3/ViewBox';
  import type { AxisProps } from '$lib/d3/Axis.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import Line2D from '$lib/d3/Line2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';

  let initialViewBox: ViewBox | undefined;
  let xAxisLabel: string | undefined;
  let yAxisLabel: string | undefined;
  let axis: AxisProps | undefined;

  // ########################
  // TUTORIAL / DOCUMENTATION
  // ########################
  // https://docs.openla.ewi.tudelft.nl/?path=/docs/tutorials-tutorial-template--docs
  // on this page you can find documentation for the template objects and a tutorial on using them

  // ###############
  // CAMERA SETTINGS
  // ###############
  // choose one or none of the options below - if both are specified, view box will be used

  // (remove if unnecessary)
  initialViewBox = new ViewBox(
    new Vector2(-3, -4), // bottom-left
    new Vector2(4, 4), // top-right
    0.5 // margin
  );

  // ####
  // AXIS
  // ####
  // here are the default settings for axis, you can change them

  // (remove if unnecessary)
  axis = {
    showOrigin: true,
    showAxisNumbersX: true,
    showAxisNumbersY: true,
    logarithmicX: false,
    logarithmicY: false,
    skipX: 0,
    skipY: 0
  };

  // #####
  // SCALE
  // #####
  // All child components (functions, points, lines, etc.) will auto-scale accordingly.
  // Example: scaleX={2} means 1 unit in world space = 2 display units on the x-axis.
  // Formulas and positions should be written in display (mathematical) space.
  let scaleX = 1;
  let scaleY = 1;

  // ###########
  // AXIS LABELS
  // ###########

  // (remove if unnecessary)
  xAxisLabel = '\\operatorname{Re}';
  yAxisLabel = '\\operatorname{Im}';

  function SnapToGrid(position: Vector2): Vector2 {
    const snappedX = Number(position.x.toFixed(1));
    const snappedY = Number(position.y.toFixed(1));
    return new Vector2(snappedX, snappedY);
  }
  const Rez = 3;
  const Imz = 1;
  const Rew = -2;
  const Imw = -2;
  const draggablePoint = [
    new Draggable(new Vector2(Rez, Imz), PrimeColor.green, undefined, SnapToGrid),
    new Draggable(new Vector2(Rew, Imw), PrimeColor.purple, undefined, SnapToGrid)
  ];
  const ConjugateZ = $derived(
    new Vector2(draggablePoint[0].position.x, -draggablePoint[0].position.y)
  );
  const ConjugateW = $derived(
    new Vector2(draggablePoint[1].position.x, -draggablePoint[1].position.y)
  );
  function getStr(position: Vector2): string {
    const Re = position.x;
    let str = '';
    if (Re !== 0) {
      str += '\\$1';
    }
    const Im = position.y;
    if (Im > 0) {
      if (Re !== 0) {
        str += '+';
      }
      if (Im !== 1) {
        str += '\\$2i';
      } else {
        str += 'i';
      }
    }
    if (Im < 0) {
      if (Im !== -1) {
        str += '\\$2i';
      } else {
        str += '-i';
      }
    }
    return str;
  }
  const formulas = $derived.by(() => {
    return [
      new Formula('z=' + getStr(draggablePoint[0].position))
        .addAutoParam(draggablePoint[0].position.x.toFixed(1).replace('.0', ''), PrimeColor.orange)
        .addAutoParam(draggablePoint[0].position.y.toFixed(1).replace('.0', ''), PrimeColor.blue),
      new Formula('\\overline{z}=' + getStr(ConjugateZ))
        .addAutoParam(ConjugateZ.x.toFixed(1).replace('.0', ''), PrimeColor.orange)
        .addAutoParam(ConjugateZ.y.toFixed(1).replace('.0', ''), PrimeColor.cyan),

      new Formula('w=' + getStr(draggablePoint[1].position))
        .addAutoParam(
          draggablePoint[1].position.x.toFixed(1).replace('.0', ''),
          PrimeColor.darkGreen
        )
        .addAutoParam(draggablePoint[1].position.y.toFixed(1).replace('.0', ''), PrimeColor.red),
      new Formula('\\overline{w}=' + getStr(ConjugateW))
        .addAutoParam(ConjugateW.x.toFixed(1).replace('.0', ''), PrimeColor.darkGreen)
        .addAutoParam(ConjugateW.y.toFixed(1).replace('.0', ''), PrimeColor.raspberry)
    ];
  });
</script>

<Canvas2D
  draggables={draggablePoint}
  {initialViewBox}
  labels={{ xLabel: xAxisLabel ?? undefined, yLabel: yAxisLabel ?? undefined }}
  {axis}
  {scaleX}
  {scaleY}
>
  <Latex2D
    latex={formulas[0].latex}
    position={draggablePoint[0].position}
    color={PrimeColor.black}
    alignX={draggablePoint[0].position.x < 0 ? 'right' : 'left'}
    alignY={draggablePoint[0].position.y < 0 ? 'top' : 'bottom'}
    offset={new Vector2(
      draggablePoint[0].position.x < 0 ? -0.1 : 0.1,
      draggablePoint[0].position.y < 0 ? -0.1 : 0.1
    )}
    background={PrimeColor.green + PrimeColor.opacity(0.4)}
    padding="1em"
  />
  <Latex2D
    latex={formulas[1].latex}
    position={ConjugateZ}
    color={PrimeColor.black}
    alignX={ConjugateZ.x < 0 ? 'right' : 'left'}
    alignY={ConjugateZ.y < 0 ? 'top' : 'bottom'}
    offset={new Vector2(ConjugateZ.x < 0 ? -0.1 : 0.1, ConjugateZ.y < 0 ? -0.1 : 0.1)}
    background={PrimeColor.yellow + PrimeColor.opacity(0.4)}
    padding="1em"
  />
  <Line2D
    start={draggablePoint[0].position}
    end={new Vector2(draggablePoint[0].position.x, 0)}
    color={PrimeColor.orange}
    isDashed={true}
    width={0.05}
  />
  <Line2D
    start={ConjugateZ}
    end={new Vector2(ConjugateZ.x, 0)}
    color={PrimeColor.orange}
    isDashed={true}
    width={0.05}
  />
  <Point2D
    position={new Vector2(draggablePoint[0].position.x, 0)}
    color={PrimeColor.orange}
    radius={0.08}
  />
  <Latex2D
    latex={draggablePoint[0].position.x.toFixed(1).replace('.0', '')}
    color={PrimeColor.white}
    position={new Vector2(draggablePoint[0].position.x, 0)}
    alignX="center"
    alignY={draggablePoint[0].position.y < 0 ? 'bottom' : 'top'}
    offset={new Vector2(
      draggablePoint[0].position.x < 0 ? -0.15 : 0,
      draggablePoint[0].position.y < 0 ? 0.15 : -0.15
    )}
    background={PrimeColor.orange}
  />
  <Line2D
    start={draggablePoint[0].position}
    end={new Vector2(0, draggablePoint[0].position.y)}
    color={PrimeColor.blue}
    isDashed={true}
    width={0.05}
  />
  <Line2D
    start={ConjugateZ}
    end={new Vector2(0, ConjugateZ.y)}
    color={PrimeColor.cyan}
    isDashed={true}
    width={0.05}
  />
  <Point2D
    position={new Vector2(0, draggablePoint[0].position.y)}
    color={PrimeColor.blue}
    radius={0.08}
  />
  <Point2D position={new Vector2(0, ConjugateZ.y)} color={PrimeColor.cyan} radius={0.08} />
  <Point2D position={ConjugateZ} color={PrimeColor.yellow} radius={0.08} />
  <Latex2D
    latex={draggablePoint[0].position.y.toFixed(1).replace('.0', '')}
    color={PrimeColor.white}
    position={new Vector2(0, draggablePoint[0].position.y)}
    alignX={draggablePoint[0].position.x < 0 ? 'left' : 'right'}
    alignY="center"
    offset={new Vector2(draggablePoint[0].position.x < 0 ? 0.15 : -0.15, 0)}
    background={PrimeColor.blue}
  />
  <Latex2D
    latex={ConjugateZ.y.toFixed(1).replace('.0', '')}
    color={PrimeColor.white}
    position={new Vector2(0, ConjugateZ.y)}
    alignX={ConjugateZ.x < 0 ? 'left' : 'right'}
    alignY="center"
    offset={new Vector2(ConjugateZ.x < 0 ? 0.15 : -0.15, 0)}
    background={PrimeColor.cyan}
  />
  // w
  <Latex2D
    latex={formulas[2].latex}
    position={draggablePoint[1].position}
    color={PrimeColor.black}
    alignX={draggablePoint[1].position.x < 0 ? 'right' : 'left'}
    alignY={draggablePoint[1].position.y < 0 ? 'top' : 'bottom'}
    offset={new Vector2(
      draggablePoint[1].position.x < 0 ? -0.1 : 0.1,
      draggablePoint[1].position.y < 0 ? -0.1 : 0.1
    )}
    background={PrimeColor.purple + PrimeColor.opacity(0.4)}
    padding="1em"
  />
  <Latex2D
    latex={formulas[3].latex}
    position={ConjugateW}
    color={PrimeColor.black}
    alignX={ConjugateW.x < 0 ? 'right' : 'left'}
    alignY={ConjugateW.y < 0 ? 'top' : 'bottom'}
    offset={new Vector2(ConjugateW.x < 0 ? -0.1 : 0.1, ConjugateW.y < 0 ? -0.1 : 0.1)}
    background={PrimeColor.pink + PrimeColor.opacity(0.4)}
    padding="1em"
  />
  <Line2D
    start={draggablePoint[1].position}
    end={new Vector2(draggablePoint[1].position.x, 0)}
    color={PrimeColor.darkGreen}
    isDashed={true}
    width={0.05}
  />
  <Line2D
    start={ConjugateW}
    end={new Vector2(ConjugateW.x, 0)}
    color={PrimeColor.darkGreen}
    isDashed={true}
    width={0.05}
  />
  <Point2D
    position={new Vector2(draggablePoint[1].position.x, 0)}
    color={PrimeColor.darkGreen}
    radius={0.08}
  />
  <Latex2D
    latex={draggablePoint[1].position.x.toFixed(1).replace('.0', '')}
    color={PrimeColor.white}
    position={new Vector2(draggablePoint[1].position.x, 0)}
    alignX="center"
    alignY={draggablePoint[1].position.y < 0 ? 'bottom' : 'top'}
    offset={new Vector2(
      draggablePoint[1].position.x < 0 ? -0.15 : 0,
      draggablePoint[1].position.y < 0 ? 0.15 : -0.15
    )}
    background={PrimeColor.darkGreen}
  />
  <Line2D
    start={draggablePoint[1].position}
    end={new Vector2(0, draggablePoint[1].position.y)}
    color={PrimeColor.red}
    isDashed={true}
    width={0.05}
  />
  <Line2D
    start={ConjugateW}
    end={new Vector2(0, ConjugateW.y)}
    color={PrimeColor.raspberry}
    isDashed={true}
    width={0.05}
  />
  <Point2D
    position={new Vector2(0, draggablePoint[1].position.y)}
    color={PrimeColor.red}
    radius={0.08}
  />
  <Point2D position={new Vector2(0, ConjugateW.y)} color={PrimeColor.raspberry} radius={0.08} />
  <Point2D position={ConjugateW} color={PrimeColor.pink} radius={0.08} />
  <Latex2D
    latex={draggablePoint[1].position.y.toFixed(1).replace('.0', '')}
    color={PrimeColor.white}
    position={new Vector2(0, draggablePoint[1].position.y)}
    alignX={draggablePoint[1].position.x < 0 ? 'left' : 'right'}
    alignY="center"
    offset={new Vector2(draggablePoint[1].position.x < 0 ? 0.15 : -0.15, 0)}
    background={PrimeColor.red}
  />
  <Latex2D
    latex={ConjugateW.y.toFixed(1).replace('.0', '')}
    color={PrimeColor.white}
    position={new Vector2(0, ConjugateW.y)}
    alignX={ConjugateW.x < 0 ? 'left' : 'right'}
    alignY="center"
    offset={new Vector2(ConjugateW.x < 0 ? 0.15 : -0.15, 0)}
    background={PrimeColor.raspberry}
  />
</Canvas2D>
