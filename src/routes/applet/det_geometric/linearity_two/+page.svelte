<script lang="ts">
  import { Canvas2D, Latex2D, Vector2D } from '$lib/d3-components';
  import Point from '$lib/d3-components/Point.svelte';
  import Polygon from '$lib/d3-components/Polygon.svelte';
  import { Controls } from '$lib/utils/Controls';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  let controls = Controls.addSlider(0, 0, 3.5, 0.1, PrimeColor.raspberry, 'Animation', () => '');

  const clamp = (number: number, min: number, max: number) => Math.max(min, Math.min(number, max));

  // Primitives
  const o = new Vector2(0, 0);
  const u = new Vector2(4, 1);
  const v = new Vector2(1, 3);
  const w = new Vector2(2, -0.5);

  // Derived
  const vw = v.clone().add(w);
  const uw = u.clone().add(w);
  const uv = u.clone().add(v);
  const uvw = u.clone().add(v).add(w);

  // Added
  const OAFC = [o, u, uv, v]; // OAFC
  const OAFCG = [o, u, uv, v, vw]; // OAFCG
  const OGC = [o, vw, v]; // OGC
  const OAEG = [o, u, uvw, vw]; // OAEG
  const CGEF = [v, vw, uvw, uv]; // CGEF

  // Substract
  const OBDA = [o, w, uw, u]; // OBDA / CGEF
</script>

<Canvas2D bind:controls showAxisNumbers={false}>
  <!-- Polygons -->
  {#if controls[0] < 1}
    <Polygon
      points={OAFC}
      color={PrimeColor.raspberry + PrimeColor.opacity(0.1)}
      strokeColor={PrimeColor.raspberry}
      strokeWidth={0.75}
    />
  {:else if controls[0] < 2}
    <Polygon
      points={OAFCG}
      color={PrimeColor.raspberry + PrimeColor.opacity(0.1)}
      strokeColor={PrimeColor.raspberry}
      strokeWidth={0.75}
    />

    <Polygon
      points={OGC}
      offset={u.clone().multiplyScalar(clamp(controls[0] - 1, 0, 1))}
      color={PrimeColor.raspberry + PrimeColor.opacity(0.1)}
      strokeColor={PrimeColor.raspberry}
      strokeWidth={0.75}
    />
  {:else}
    <Polygon
      points={CGEF}
      color={PrimeColor.raspberry + PrimeColor.opacity(0.1)}
      strokeColor={PrimeColor.raspberry}
      strokeWidth={0.75}
      opacity={3 - controls[0]}
    />

    <Polygon
      points={OAEG}
      color={PrimeColor.raspberry + PrimeColor.opacity(0.1)}
      strokeColor={PrimeColor.raspberry}
      strokeWidth={0.75}
    />
  {/if}

  <Polygon
    points={OBDA}
    offset={v.clone().multiplyScalar(Math.min(1, controls[0]))}
    color={PrimeColor.blue + PrimeColor.opacity(0.2)}
    strokeColor={PrimeColor.blue}
    strokeWidth={0.75}
    opacity={3 - controls[0]}
  />

  <!-- U, V, W, V +W -->
  <Vector2D direction={u} length={u.length()} color={PrimeColor.raspberry} />
  <Latex2D
    latex={String.raw`\mathbf{u}`}
    position={u.clone().multiplyScalar(0.5)}
    offset={new Vector2(0, -0.1)}
    color={PrimeColor.raspberry}
  />

  <Vector2D direction={v} length={v.length()} color={PrimeColor.raspberry} />
  <Latex2D
    latex={String.raw`\mathbf{v}`}
    position={v.clone().multiplyScalar(0.5)}
    offset={new Vector2(0, -0.1)}
    color={PrimeColor.raspberry}
  />

  <Vector2D direction={w} length={w.length()} color={PrimeColor.blue} />
  <Latex2D
    latex={String.raw`\mathbf{w}`}
    position={w.clone().multiplyScalar(0.5)}
    offset={new Vector2(0, -0.1)}
    color={PrimeColor.blue}
  />

  <!-- VW -->
  {#if controls[0] > 1}
    <Vector2D direction={vw} length={vw.length()} color={PrimeColor.darkGreen} />
    <Latex2D
      latex={String.raw`\mathbf{v+w}`}
      position={vw.clone().multiplyScalar(0.5)}
      offset={new Vector2(-0.8, 0.3)}
      color={PrimeColor.darkGreen}
    />

    <Vector2D
      origin={u}
      direction={vw}
      length={vw.length()}
      color={PrimeColor.darkGreen}
      hideHead
    />
  {/if}

  <!-- LABELS A-G -->
  <Point position={uw} />
  <Point position={uvw} />
  <Point position={vw} />

  <Latex2D latex={'A'} position={u} offset={new Vector2(0.15, 0.3)} />
  <Latex2D latex={'B'} position={w} offset={new Vector2(-0.1, -0.2)} />
  <Latex2D latex={'C'} position={v} offset={new Vector2(0, 0.4)} />
  <Latex2D latex={'D'} position={uw} extend={0.15} />
  <Latex2D latex={'E'} position={uvw} extend={0.15} />
  <Latex2D latex={'F'} position={uv} offset={new Vector2(0.1, 0.25)} />
  <Latex2D latex={'G'} position={vw} offset={new Vector2(0.1, 0.25)} />

  {#if controls[0] < 2}
    <Latex2D
      latex={'OAFC'}
      position={uv.clone().multiplyScalar(0.5)}
      offset={new Vector2(-0.2, -0.1)}
    />
  {:else if controls[0] > 2}
    <Latex2D
      latex={'OAEG'}
      position={uvw.clone().multiplyScalar(0.5)}
      offset={new Vector2(-0.2, -0.1)}
    />
  {/if}

  {#if controls[0] < 0.25}
    <Latex2D
      latex={'OBDA'}
      position={uw.clone().multiplyScalar(0.5)}
      offset={new Vector2(-0.1, 0.2)}
      textSize={13 - 13 * controls[0]}
    />
  {:else if controls[0] > 0.75 && controls[0] < 2.25}
    <Latex2D
      latex={'CGEF'}
      position={new Vector2(3, 3)}
      offset={new Vector2(-0.1, 0.2)}
      textSize={13 * Math.min(1, controls[0])}
    />
  {/if}
</Canvas2D>
