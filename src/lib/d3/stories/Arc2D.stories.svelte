<script context="module">
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import Arc2D from '../Arc2D.svelte';

  const { Story } = defineMeta({
    title: 'D3/Arc2D',
    component: Arc2D,
    argTypes: {
      points: {
        description: 'The two vectors that define the arc. Required.',
        defaultValue: [new Vector2(1, 0), new Vector2(0, 1)],
        control: {
          type: 'object'
        }
      }
    }
  });
</script>

<script>
  import { Vector2 } from 'three';
  import Canvas2D from '../Canvas2D.svelte';

  setTemplate(template);
</script>

{#snippet template(args)}
  <div class="h-[300px] rounded-lg overflow-hidden">
    <Canvas2D>
      <Arc2D {...args} />
    </Canvas2D>
  </div>
{/snippet}

<Story
  name="Points are required"
  args={{
    points: [new Vector2(1, 0), new Vector2(0, 1)]
  }}
/>
