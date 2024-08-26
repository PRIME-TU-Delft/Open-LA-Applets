<script>
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
    .addToggle(true, '\\mathbf{v_3}', PrimeColor.raspberry);

  const v1 = $derived(controls[0]);
  const v2 = $derived(controls[1]);
  const v3 = $derived(controls[2]);

  const span = $derived.by(() => {
    const pre = 'Span\\{';
    const res = controls.values
      .map((b, i) => (b ? `\\mathbf{v_${i + 1}}` : ''))
      .filter(Boolean)
      .join(', ');
    const post = '\\}';
    return pre + res + post;
  });

  const moreThanOneEnabled = $derived.by(() => controls.values.filter(Boolean).length > 1);
</script>

<Canvas2D
  {controls}
  cameraZoom={2}
  cameraPosition={new Vector2(1, 1)}
  showAxisNumbers={false}
  enablePan={false}
  splitCanvas2DProps={{
    cameraZoom: 2,
    showAxisNumbers: false,
    enablePan: false,
    cameraPosition: new Vector2(1, 1)
  }}
>
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
    <Vector2D
      direction={new Vector2(1, 1)}
      length={2 * Math.sqrt(2)}
      color={PrimeColor.darkGreen}
    />
    <Latex2D
      latex={'\\mathbf{v_2}'}
      position={new Vector2(1, 1)}
      offset={new Vector2(0, -0.1)}
      color={PrimeColor.darkGreen}
    />
  {/if}

  {#if v3}
    <Vector2D direction={new Vector2(0, 1)} length={2} color={PrimeColor.raspberry} />
    <Latex2D
      latex={'\\mathbf{v_3}'}
      position={new Vector2(0, 1)}
      offset={new Vector2(0.1, 0)}
      color={PrimeColor.raspberry}
    />
  {/if}

  <!-- SPAN -->
  <Latex2D
    latex={span}
    position={new Vector2(0.5, -0.5)}
    offset={new Vector2(-0.1, -0.1)}
    color={PrimeColor.yellow}
    fontSize={0.8}
  />
  {#if moreThanOneEnabled}
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
    <InfiniteLine2D direction={new Vector2(1, 1)} color={PrimeColor.yellow} />
  {:else if v3}
    <InfiniteLine2D direction={new Vector2(0, 1)} color={PrimeColor.yellow} />
  {:else}
    <Point2D position={new Vector2(0, 0)} color={PrimeColor.yellow} />
  {/if}

  {#snippet splitCanvas2DChildren()}
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

    {#if v3}
      <Vector2D direction={new Vector2(2, 0)} length={4} color={PrimeColor.raspberry} />
      <Latex2D
        latex={'\\mathbf{v_3}'}
        position={new Vector2(3, 0)}
        offset={new Vector2(0, -0.1)}
        color={PrimeColor.raspberry}
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
      latex={span}
      position={new Vector2(1, 1)}
      offset={new Vector2(-0.1, -0.1)}
      color={PrimeColor.yellow}
      fontSize={0.8}
    />
    {#if v2 && (v1 || v3)}
      <rect
        x={-10}
        y={-10}
        width={20}
        height={20}
        fill={PrimeColor.yellow + PrimeColor.opacity(0.25)}
      />
    {:else if v2}
      <InfiniteLine2D direction={new Vector2(0, 1)} color={PrimeColor.yellow} />
    {:else if v1 || v3}
      <InfiniteLine2D direction={new Vector2(1, 0)} color={PrimeColor.yellow} />
    {:else}
      <Point2D position={new Vector2(0, 0)} color={PrimeColor.yellow} />
    {/if}
  {/snippet}
</Canvas2D>
