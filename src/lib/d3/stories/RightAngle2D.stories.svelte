<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { Vector2 } from 'three';
  import RightAngle2D from '../RightAngle2D.svelte';

  const { Story } = defineMeta({
    title: 'D3/RightAngle2D',
    component: RightAngle2D,
    argTypes: {}
  });

  type RightAngle2DProps = {
    vs: [Vector2, Vector2];
    origin?: Vector2;
    size?: number;
    color?: string;
    lineWidth?: number;
  };
</script>

<script lang="ts">
  import { PrimeColor } from '$lib/utils/PrimeColors';
</script>

{#snippet template(args: RightAngle2DProps)}
  <div class="h-[300px] overflow-hidden rounded-lg">
    <svg width="100%" height="100%">
      <!-- Custom rendering for RightAngle2D, or just use the component directly -->
    </svg>
    <RightAngle2D {...args} />
  </div>
{/snippet}

<Story name="Default" {template} />

<!-- With custom color defined -->
<Story name="Custom color" args={{ color: PrimeColor.raspberry }} {template} />

<!-- With custom size defined -->
<Story name="Custom size" args={{ size: 0.5 }} {template} />

<!-- With custom stroke width defined -->
<Story name="Custom stroke width" args={{ lineWidth: 0.05 }} {template} />
