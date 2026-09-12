<script lang="ts">
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { MathVector3 } from '$lib/utils/MathVector';
  import { Controls } from '$lib/controls/Controls';
  import { toLatexText } from '$lib/utils/FormatString';
  import Surface3D from '$lib/threlte/Surface3D.svelte';
  import Surface3DParametricDomain from '$lib/threlte/Surface3DParametricDomain.svelte';
  import { Vector2 } from 'three';
  import Curve3D from '$lib/threlte/Curve3D.svelte';
  import Point3D from '$lib/threlte/Point3D.svelte';
  import { LegendItem } from '$lib/utils/Legend';

  const controls = Controls.addSlider(1, -10, 10, 0.1, PrimeColor.pink, {
    label: toLatexText('Plane tilt$=$'),
    valueFn: (v: number) => toLatexText(v.toFixed(1).replace(/\.?0+$/, ''))
  }).addSlider(2, -9.9, 9.9, 0.1, PrimeColor.green, {
    label: toLatexText('Plane heigth$=$'),
    valueFn: (v: number) => toLatexText(v.toFixed(1).replace(/\.?0+$/, ''))
  });

  const Radius = 5;
  const Slope = 2;
  const PlaneZ = $derived(controls[1]);
  const PlaneOrigin = $derived(new MathVector3(0, 0, PlaneZ));
  const PlaneNormal = $derived(new MathVector3(0, controls[0], 1));
  const PlaneD = $derived(PlaneOrigin.dot(PlaneNormal));
  const PlaneA = $derived(PlaneNormal.mathX);
  const PlaneB = $derived(PlaneNormal.mathY);
  const PlaneC = $derived(PlaneNormal.mathZ);
  function PlaneFunction(x: number, y: number): number {
    return (PlaneD - (PlaneA * x + PlaneB * y)) / PlaneC;
  }
  const MaxZ = Radius * Slope;
  const Y1 = $derived(PlaneB === 0 ? Radius : (PlaneD - PlaneC * MaxZ) / PlaneB);
  const Y2 = $derived(PlaneB === 0 ? -Radius : (PlaneD + PlaneC * MaxZ) / PlaneB);
  const YA = $derived(Math.max(Y1, Y2));
  const YB = $derived(Math.min(Y1, Y2));
  const MaxY = $derived(Math.min(Radius, Math.max(-Radius, YA)));
  const MinY = $derived(Math.min(Radius, Math.max(-Radius, YB)));
  const MaxX = Radius;

  function TypeOfCurve(): string {
    // Determine which cases we have
    // If the origin is part of the plane, we have a degenerate case
    if (PlaneOrigin.mathX === 0 && PlaneOrigin.mathY === 0 && PlaneOrigin.mathZ === 0) {
      // if the slope of the plane is less than the slope of the cone
      // only a point intersection
      // if the slope of the plane is more than the slope of the cone
      // two straight lines that cross
      // otherwise one line
      if (Math.abs(PlaneB) < Slope) {
        return 'Point';
      } else if (Math.abs(PlaneB) > Slope) {
        return 'Cross';
      } else {
        return 'Line';
      }
    } else {
      // if the slope of the plane is less than the slope of the cone
      // an ellipse
      // if the slope of the plane is more than the slope of the cone
      // a hyperbola
      // otherwise parabola
      if (Math.abs(PlaneB) < Slope) {
        return 'Ellipse';
      } else if (Math.abs(PlaneB) > Slope) {
        return 'Hyperbola';
      } else {
        return 'Parabola';
      }
    }
  }

  const Type = $derived(TypeOfCurve());

  function ConeTop(x: number, y: number): number {
    return Slope * Math.sqrt(x ** 2 + y ** 2);
  }
  function ConeBottom(x: number, y: number): number {
    return -ConeTop(x, y);
  }
  function CloseTop(_x: number, _y: number): number {
    return Radius * Slope;
  }
  function CloseBottom(x: number, y: number): number {
    return -CloseTop(x, y);
  }

  // Set viewbox information
  const viewBoxSize: [number, number, number] = [2 * Radius, 2 * Radius, 2 * Radius * Slope];
  const viewBoxCenter = new MathVector3(0, 0, 0);
  const azimuth = (60 / 180) * Math.PI;
  const elevation = (15 / 180) * Math.PI;
</script>

<Canvas3D
  {controls}
  {viewBoxSize}
  {viewBoxCenter}
  {azimuth}
  {elevation}
  legendItems={[
    new LegendItem(toLatexText('Cone'), PrimeColor.blue, 'triangle'),
    new LegendItem(toLatexText('Plane'), PrimeColor.yellow + PrimeColor.opacity(0.4), 'square'),
    new LegendItem(toLatexText(Type), PrimeColor.red)
  ]}
>
  <Surface3DParametricDomain
    func={ConeTop}
    xFunc={(t: number) => Radius * Math.cos(t * Math.PI)}
    yFunc={(t: number) => Radius * Math.sin(t * Math.PI)}
    tRange={[0, 2]}
    internalPoints={[new Vector2(0, 0)]}
    resolution={100}
    opacity={0.9}
  />
  <Surface3DParametricDomain
    func={ConeBottom}
    xFunc={(t: number) => Radius * Math.cos(t * Math.PI)}
    yFunc={(t: number) => Radius * Math.sin(t * Math.PI)}
    tRange={[0, 2]}
    internalPoints={[new Vector2(0, 0)]}
    resolution={100}
    opacity={0.9}
  />
  <Surface3DParametricDomain
    func={CloseTop}
    xFunc={(t: number) => Radius * Math.cos(t * Math.PI)}
    yFunc={(t: number) => Radius * Math.sin(t * Math.PI)}
    tRange={[0, 2]}
    internalPoints={[new Vector2(0, 0)]}
    resolution={100}
    opacity={0.9}
  />
  <Surface3DParametricDomain
    func={CloseBottom}
    xFunc={(t: number) => Radius * Math.cos(t * Math.PI)}
    yFunc={(t: number) => Radius * Math.sin(t * Math.PI)}
    tRange={[0, 2]}
    internalPoints={[new Vector2(0, 0)]}
    resolution={100}
    opacity={0.9}
  />
  <Surface3D
    func={PlaneFunction}
    xRange={[-MaxX, MaxX]}
    yRange={[MinY, MaxY]}
    resolution={1}
    opacity={0.4}
    wireColor={PrimeColor.darkBlue}
    color={PrimeColor.yellow}
  />
  {#if Type === 'Point'}
    <Point3D position={PlaneOrigin} color={PrimeColor.red} alwaysOnTop={false} />
  {/if}
  {#if Type === 'Cross'}
    <Curve3D
      xFunc={(t: number) => t * Math.sqrt(PlaneB ** 2 - 4)}
      yFunc={(t: number) => t * 2}
      zFunc={(t: number) => t * (-2 * PlaneB)}
      tRange={[MaxZ / 2 / PlaneB, -MaxZ / 2 / PlaneB]}
      color={PrimeColor.red}
      radius={3}
    />
    <Curve3D
      xFunc={(t: number) => -t * Math.sqrt(PlaneB ** 2 - 4)}
      yFunc={(t: number) => t * 2}
      zFunc={(t: number) => t * (-2 * PlaneB)}
      tRange={[MaxZ / 2 / PlaneB, -MaxZ / 2 / PlaneB]}
      color={PrimeColor.red}
      radius={3}
    />
  {/if}
  {#if Type === 'Line'}
    <Curve3D
      xFunc={(t: number) => t * 0}
      yFunc={(t: number) => t * PlaneC}
      zFunc={(t: number) => t * -2}
      tRange={[MaxZ / 2, -MaxZ / 2]}
      color={PrimeColor.red}
      radius={3}
    />
  {/if}
  {#if Type === 'Ellipse'}
    <Curve3D
      xFunc={(t: number) => (PlaneD * Math.cos(t)) / (2 + PlaneB * Math.sin(t))}
      yFunc={(t: number) => (PlaneD * Math.sin(t)) / (2 + PlaneB * Math.sin(t))}
      zFunc={(t: number) => (2 * PlaneD) / (2 + PlaneB * Math.sin(t))}
      tRange={[0, 2 * Math.PI]}
      color={PrimeColor.red}
      radius={3}
      zRange={[-MaxZ, MaxZ]}
    />
  {/if}
  {#if Type === 'Hyperbola'}
    {@const A = PlaneB ** 2 - 4}
    {@const a = (2 * Math.abs(PlaneD)) / A}
    {@const c = PlaneD / Math.sqrt(A)}
    {@const y0 = (PlaneB * PlaneD) / A}
    <Curve3D
      xFunc={(t: number) => c * Math.sinh(t)}
      yFunc={(t: number) => y0 + a * Math.cosh(t)}
      zFunc={(t: number) => PlaneD - PlaneB * (y0 + a * Math.cosh(t))}
      tRange={[-5, 5]}
      resolution={1000}
      color={PrimeColor.red}
      radius={3}
      zRange={[-MaxZ, MaxZ]}
    />
    <Curve3D
      xFunc={(t: number) => c * Math.sinh(t)}
      yFunc={(t: number) => y0 - a * Math.cosh(t)}
      zFunc={(t: number) => PlaneD - PlaneB * (y0 - a * Math.cosh(t))}
      tRange={[-5, 5]}
      resolution={1000}
      color={PrimeColor.red}
      radius={3}
      zRange={[-MaxZ, MaxZ]}
    />
  {/if}
  {#if Type === 'Parabola'}
    <Curve3D
      xFunc={(t: number) => t}
      yFunc={(t: number) => PlaneD / 4 - t ** 2 / PlaneD}
      zFunc={(t: number) => PlaneD / 2 + (2 * t ** 2) / PlaneD}
      tRange={[-MaxX, MaxZ]}
      resolution={1000}
      color={PrimeColor.red}
      radius={3}
      zRange={[-MaxZ, MaxZ]}
    />
  {/if}
</Canvas3D>
