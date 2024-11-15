<script lang="ts" module>
  export type Latex3DProps = {
    latex: string;
    fontSize?: number;
    position?: Vector3;
    offset?: Vector3;
    extend?: number;
    color?: string;
    hasBackground?: boolean;
  };
</script>

<script lang="ts">
  import Latex from '$lib/components/Latex.svelte';
  import { cn } from '$lib/utils/shadcn-utils';
  import { HTML } from '@threlte/extras';
  import { Vector3 } from 'three';

  let {
    latex,
    fontSize = 1,
    position = new Vector3(0, 0, 0),
    offset = new Vector3(0, 0, 0),
    color = 'black',
    extend = 0,
    hasBackground = false
  }: Latex3DProps = $props();

  const pos = $derived.by(() => {
    const posOffset = position.clone().add(offset);

    // If extend is 0, return the position with the offset
    if (extend == 0) return posOffset;

    // If position is the origin, return the offset with the extend vector
    // This is to avoid the 0 vector
    if (position.length() == 0) {
      return posOffset.add(new Vector3(1, 1, 1).normalize().multiplyScalar(extend));
    }

    return posOffset.add(position.clone().normalize().multiplyScalar(extend));
  });

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
  <Latex class={classes} {latex} {fontSize} {color} />
</HTML>
