<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const controls = Controls.addToggle(true, '\\mathbf{v_1}', PrimeColor.blue)
    .addToggle(true, '\\mathbf{v_2}', PrimeColor.darkGreen)
    .addToggle(true, '\\mathbf{v_3}', PrimeColor.raspberry)
    .addToggle(true, '\\mathbf{v_4}', PrimeColor.orange);

  const v1 = $derived(controls[0]);
  const v2 = $derived(controls[1]);
  const v3 = $derived(controls[2]);
  const v4 = $derived(controls[3]);

  function getSpanLatex(vs: boolean[], labels?: string[]) {
    const pre = '\\mathrm{Span}\\{';
    const res = vs
      .map((b, i) => (b ? `\\mathbf{${labels ? labels[i] : 'v_' + (i + 1)}}` : ''))
      .filter(Boolean)
      .join(', ');
    const post = '\\}';
    return pre + res + post;
  }

  const pointsEnabled = $derived.by(() => controls.values.filter(Boolean).length);
</script>

<Canvas2D
  {controls}
  cameraZoom={2}
  cameraPosition={new Vector2(1, 1)}
  axis={{ showAxisNumbers: false }}
  enablePan={false}
  splitCanvas2DProps={{
    cameraZoom: 2,
    axis: { showAxisNumbers: false },
    enablePan: false,
    cameraPosition: new Vector2(1, 1)
  }}
>
  {#if (v4 && pointsEnabled > 2) || (!v4 && pointsEnabled > 1)}
    <rect
      x={-10}
      y={-10}
      width={20}
      height={20}
      fill={PrimeColor.yellow + PrimeColor.opacity(0.25)}
    />
  {:else if v1}
    <InfiniteLine2D direction={new Vector2(1, 0)} color={PrimeColor.yellow} />
  {:else if v2}
    <InfiniteLine2D direction={new Vector2(0, 1)} color={PrimeColor.yellow} />
  {:else if v3}
    <InfiniteLine2D direction={new Vector2(1, 1)} color={PrimeColor.yellow} />
  {:else}
    <Point2D position={new Vector2(0, 0)} color={PrimeColor.yellow} />
  {/if}

  <!-- Vectors -->
  {#if v1}
    <Vector2D direction={new Vector2(1, 0)} length={2} color={PrimeColor.blue} />
    <Latex2D
      latex={'\\mathbf{v_1}'}
      position={new Vector2(1, 0)}
      offset={new Vector2(0, -0.1)}
      color={PrimeColor.blue}
    />
  {/if}

  {#if v2}
    <Vector2D direction={new Vector2(0, 1)} length={2} color={PrimeColor.darkGreen} />
    <Latex2D
      latex={'\\mathbf{v_2}'}
      position={new Vector2(0, 1)}
      offset={new Vector2(0.1, 0.5)}
      color={PrimeColor.darkGreen}
    />
  {/if}

  {#if v3}
    <Vector2D
      direction={new Vector2(1, 1)}
      length={2 * Math.sqrt(2)}
      color={PrimeColor.raspberry}
    />
    <Latex2D
      latex={'\\mathbf{v_3}'}
      position={new Vector2(1, 1)}
      offset={new Vector2(0, -0.1)}
      color={PrimeColor.raspberry}
    />
  {/if}

  <!-- SPAN -->
  <Latex2D
    latex={getSpanLatex([v1, v2, v3])}
    position={new Vector2(0.5, -0.5)}
    offset={new Vector2(-0.1, -0.1)}
    color={PrimeColor.yellow}
    fontSize={0.8}
  />

  {#snippet splitCanvas2DChildren()}
    {#if v2 && (v1 || v4)}
      <rect
        x={-10}
        y={-10}
        width={20}
        height={20}
        fill={PrimeColor.yellow + PrimeColor.opacity(0.25)}
      />
    {:else if v2}
      <InfiniteLine2D direction={new Vector2(0, 1)} color={PrimeColor.yellow} />
    {:else if v1 || v4}
      <InfiniteLine2D direction={new Vector2(1, 0)} color={PrimeColor.yellow} />
    {:else}
      <Point2D position={new Vector2(0, 0)} color={PrimeColor.yellow} />
    {/if}

    <!-- Vectors -->
    {#if v2}
      <Vector2D direction={new Vector2(0, 1)} length={2} color={PrimeColor.darkGreen} />
      <Latex2D
        latex={'\\mathbf{v_2}'}
        position={new Vector2(0, 1)}
        offset={new Vector2(0.1, 0)}
        color={PrimeColor.darkGreen}
      />
    {/if}

    {#if v4}
      <Vector2D direction={new Vector2(2, 0)} length={4} color={PrimeColor.orange} />
      <Latex2D
        latex={'\\mathbf{v_4}'}
        position={new Vector2(3, 0)}
        offset={new Vector2(0, -0.1)}
        color={PrimeColor.orange}
      />
    {/if}

    {#if v1}
      <Vector2D direction={new Vector2(1, 0)} length={2} color={PrimeColor.blue} />
      <Latex2D
        latex={'\\mathbf{v_1}'}
        position={new Vector2(1, 0)}
        offset={new Vector2(0, -0.1)}
        color={PrimeColor.blue}
      />
    {/if}

    <!-- SPAN -->
    <Latex2D
      latex={getSpanLatex([v1, v2, v4], ['v_1', 'v_2', 'v_4'])}
      position={new Vector2(1, 1)}
      offset={new Vector2(-0.1, -0.1)}
      color={PrimeColor.yellow}
      fontSize={0.8}
    />
  {/snippet}
</Canvas2D>
