<script context="module">
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { Vector2 } from 'three';

  const { Story } = defineMeta({
    title: 'Initialize/Canvas2D',
    component: Canvas2D,
    argTypes: {
      cameraPosition: {
        description: 'The position of the camera. Default is (0, 0).',
        control: {
          type: 'object'
        }
      },
      cameraZoom: {
        description: 'The zoom level of the camera. Default is 1.',
        control: {
          type: 'number',
          min: 0.1,
          max: 10
        }
      },
      tickLength: {
        description: 'The length of the ticks. Default is 30.',
        control: {
          type: 'number',
          min: 1,
          max: 100
        }
      },
      showAxisNumbers: {
        description: 'Whether to show the axis numbers. Default is true.',
        control: {
          type: 'boolean'
        }
      },
      enablePan: {
        description: 'Whether to enable panning. Default is true.',
        value: true,
        control: {
          type: 'boolean'
        }
      }
    }
  });
</script>

<script>
  import { onDestroy } from 'svelte';
  import { globalState } from '$lib/stores/globalState.svelte';

  setTemplate(template);

  onDestroy(() => {
    globalState.title = '';
  });
</script>

{#snippet template(args)}
  <div class="h-[300px] rounded-lg overflow-hidden">
    <Canvas2D title={'Hello this is a title'} {...args} />
  </div>
{/snippet}

<Story name="Default" />

<!-- This canvas is zoomed out 2x by specifying cameraZoom=0.5 -->
<Story name="Zoom out" args={{ cameraZoom: 0.5 }} />

<!-- This canvas is moved to x:3 and y:1 -->
<Story name="Camera position" args={{ cameraPosition: new Vector2(3, 1) }} />

<!-- This canvas is smaller than the regular canvas. This can be useful in combination with `cameraZoom` -->
<Story name="Adjust tickLength" args={{ tickLength: 5 }} />

<!-- This can be useful when you would like to show the applet at one specific location -->
<Story name="Toggle pan" args={{ enablePan: false }} />

<!-- This can be useful when you would like to hide the axis numbers and put more attension to the applet.  -->
<Story name="Toggle Axis Numbers" args={{ showAxisNumbers: false }} />
