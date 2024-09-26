<script lang="ts">
  import Latex from '$lib/components/Latex.svelte';
  import { globalState } from '$lib/stores/globalState.svelte';
  import { cn } from '$lib/utils/shadcn-utils';
  import { HTML } from '@threlte/extras';
  import { Vector3 } from 'three';

  type Latex2DProps = {
    latex: string;
    fontSize?: number;
    position?: Vector3;
    offset?: Vector3;
    extend?: number;
    color?: string;
    hasBackground?: boolean;
  };

  let {
    latex,
    fontSize = 1,
    position = new Vector3(0, 0, 0),
    offset = new Vector3(0, 0, 0),
    color,
    extend = 0,
    hasBackground = false
  }: Latex2DProps = $props();

  const pos = $derived(
    position.clone().add(offset).add(position.clone().normalize().multiplyScalar(extend))
  );

  const possibleInvertColor = $derived(color ?? (globalState.dark ? 'white' : 'black'));

  const classes = $derived(
    cn(
      'absolute -translate-x-1/2 -translate-y-1/2',
      hasBackground ? 'px-1 rounded-lg bg-slate-50/30 backdrop-blur-sm' : ''
    )
  );
</script>

<HTML
  zIndexRange={[0, 0]}
  position={pos.toArray()}
  onvisibilitychange={(vis) => vis}
  pointerEvents="none"
>
  <Latex class={classes} {latex} {fontSize} color={possibleInvertColor} />
</HTML>
