<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { T } from '@threlte/core';
  import { MeshLineGeometry, MeshLineMaterial } from '@threlte/extras';
  import { BufferGeometry, Line, Mesh, Vector3 } from 'three';

  type LineProps = {
    origin: Vector3;
    endPoint: Vector3;
    color?: string;
    isDashed?: boolean;
    radius?: number;
    alwaysOnTop?: boolean;
  };

  let {
    origin = new Vector3(0, 0, 0),
    endPoint = new Vector3(0, 0, 0),
    color = PrimeColor.getRandomColor(),
    isDashed = false,
    radius = 0,
    alwaysOnTop = false
  }: LineProps = $props();

  const geometry = $derived(new BufferGeometry().setFromPoints([origin, endPoint]));

  let line = $state<Line>();
  let lineMesh = $state<Mesh>();

  $effect(() => {
    if (line && isDashed && origin && endPoint) {
      line.computeLineDistances();
    }
  });

  $effect(() => {
    if (!lineMesh) return;

    if (alwaysOnTop) lineMesh.renderOrder = 300;
  });
</script>

{#key alwaysOnTop}
  {#if radius > 0}
    <T.Mesh bind:ref={lineMesh}>
      <MeshLineGeometry points={[origin, endPoint]} />
      <MeshLineMaterial
        depthTest={!alwaysOnTop}
        width={radius / 200}
        {color}
        dashOffset={0.1}
        dashArray={0.1 * radius}
        dashRatio={isDashed ? 0.2 : 0}
        transparent={isDashed || alwaysOnTop}
      />
    </T.Mesh>
  {:else}
    <T.Line bind:ref={line} {geometry}>
      {#if isDashed}
        <T.LineDashedMaterial {color} dashSize={0.2} gapSize={0.1} />
      {:else}
        <T.LineBasicMaterial {color} />
      {/if}
    </T.Line>
  {/if}
{/key}
