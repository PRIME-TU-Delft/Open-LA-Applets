<script context="module">
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import Arc2D from '../Arc2D.svelte';

  const { Story } = defineMeta({
    title: 'D3/Arc2D',
    component: Arc2D,
    argTypes: {
      points: {
        description: 'The two vectors that define the arc. Required.',
        control: {
          type: 'object'
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
      <Arc2D points={[new Vector2(1, 0), new Vector2(0, 1)]} {...args} />
    </Canvas2D>
  </div>
{/snippet}

<!-- Dynamic snippet should be disabled for this story -->
<Story name="With color" source args={{ color: PrimeColor.raspberry }} />

<!-- An Arc with different point defined -->
<Story
  name="With points defined"
  source
  args={{ points: [new Vector2(1, 1), new Vector2(-1, -1)] }}
/>

<Story name="With origin defined" source args={{ origin: new Vector2(1, 1) }} />

<Story name="With width defined" source args={{ width: 0.1 }} />

<!-- Default is 1 but can changed with the `distance` param -->
<Story name="With distance defined" source args={{ distance: 2 }} />

<Story
  name="With arrow"
  source
  args={{ hasHead: true, points: [new Vector2(1, 1), new Vector2(-1, -1)] }}
/>

<Story
  name="With arrow reversed"
  source
  args={{ hasHead: true, points: [new Vector2(-1, -1), new Vector2(1, 1)] }}
/>
