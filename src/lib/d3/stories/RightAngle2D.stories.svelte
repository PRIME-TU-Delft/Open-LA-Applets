<script module>
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import RightAngle2D from '../RightAngle2D.svelte';

  const { Story } = defineMeta({
    title: 'D3/RightAngle2D',
    component: RightAngle2D,
    argTypes: {}
  });
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import type { Snippet } from 'svelte';
  import { Vector2 } from 'three';
  import Canvas2D, { type CanvasProps } from '../Canvas2D.svelte';

  setTemplate(template as Snippet<[Partial<CanvasProps>]>);
</script>

{#snippet template(args: CanvasProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <Canvas2D>
      <RightAngle2D vs={[new Vector2(1, 0), new Vector2(0, 1)]} {...args} />
    </Canvas2D>
  </div>
{/snippet}

<Story name="Default" />

<!-- With custom color defined -->
<Story name="Custom color" args={{ color: PrimeColor.raspberry }} />

<!-- With custom size defined -->
<Story name="Custom size" args={{ size: 0.5 }} />

<!-- With custom stroke width defined -->
<Story name="Custom stroke width" args={{ lineWidth: 0.05 }} />
