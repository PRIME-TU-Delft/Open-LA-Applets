<script context="module">
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import Point2D from '../Point2D.svelte';

  const { Story } = defineMeta({
    title: 'D3/Point2D',
    component: Point2D,
    argTypes: {
      position: {
        description: 'The position of the point. Required.',
        control: {
          type: 'object'
        }
      },
      isSquare: {
        description: 'Whether the point is square or circular.',
        control: {
          type: 'boolean'
        }
      },
      radius: {
        description: 'The radius of the point.',
        control: {
          type: 'number'
        }
      },
      color: {
        description: 'The color of the point.',
        control: {
          type: 'color'
        }
      },
      pulse: {
        description: 'Whether the point should pulse or not.',
        control: {
          type: 'boolean'
        }
      },
      opacity: {
        description: 'The opacity of the point.',
        control: {
          type: 'number'
        }
      }
    }
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
      <Point2D position={new Vector2(0, 0)} {...args} />
    </Canvas2D>
  </div>
{/snippet}

<Story name="With color" source args={{ color: PrimeColor.raspberry }} />

<!-- A Point with different position defined -->
<Story name="With position defined" source args={{ position: new Vector2(1, 1) }} />

<!-- A Point with different radius defined -->
<Story name="With radius defined" source args={{ radius: 2 }} />

<!-- A Point with different shape defined -->
<Story name="With square shape" source args={{ isSquare: true }} />

<!-- A Point with pulse effect defined -->
<Story name="With pulse effect" source args={{ pulse: true }} />

<!-- A Point with opacity defined -->
<Story name="With opacity defined" source args={{ opacity: 0.5 }} />
