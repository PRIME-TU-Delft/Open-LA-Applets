<script context="module">
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import RightAngle2D from '../RightAngle2D.svelte';

  const { Story } = defineMeta({
    title: 'D3/RightAngle2D',
    component: RightAngle2D,
    argTypes: {}
  });
</script>

<script>
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import Canvas2D from '../Canvas2D.svelte';

  setTemplate(template);
</script>

{#snippet template(args)}
  <div class="h-[300px] rounded-lg overflow-hidden">
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
