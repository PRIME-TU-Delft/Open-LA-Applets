<script module>
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Initialize/Canvas3D',
    component: Canvas3D,
    argTypes: {
      cameraPosition: {
        description: 'The position of the camera. Default is (10, 10, 10).',
        control: {
          type: 'object'
        }
      },
      cameraZoom: {
        description: 'The zoom level of the camera. Default is 29. Zoom level is logarithmic scale',
        control: {
          type: 'number',
          min: 0.1,
          max: 100
        }
      },
      enablePan: {
        description: 'Whether to enable panning. Default is false.',
        control: {
          type: 'boolean'
        }
      }
    }
  });
</script>

<script lang="ts">
  import { globalState } from '$lib/stores/globalState.svelte';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import type { CanvasProps } from '$lib/threlte/Canvas3D.svelte';
  import { onDestroy, type Snippet } from 'svelte';
  import { Vector3 } from 'three';

  setTemplate(template as Snippet<[Partial<CanvasProps>]>);

  onDestroy(() => {
    globalState.title = '';
  });
</script>

{#snippet template(args: Omit<CanvasProps, 'children'>)}
  <div class="h-[300px] w-full overflow-hidden rounded-lg">
    <Canvas3D {...args}>
      <Axis3D />
    </Canvas3D>
  </div>
{/snippet}

<Story name="Default" />

<!-- This canvas is zoomed in. The default is 29. Zoom with 3D is on a logarithmic scale -->
<Story name="Zoom in" args={{ cameraZoom: 100 }} />

<!-- This canvas is zoomed out. The default is 29. Zoom with 3D is on a logarithmic scale -->
<Story name="Zoom out" args={{ cameraZoom: 10 }} />

<!-- For this camvas, the camera is located on the x axis  -->
<Story name="Camera on x axis" args={{ cameraPosition: new Vector3(0, 0, 10) }} />

<!-- Canvas with pan enabled. On desktop, you can pan by dragging with 
right mouse button pressed. On Mobile, the interaction is dragging with
two fingers pressed to the screen. 

> Warning: This interaction is not explicitly communicated to users and can lead to unexpected behavior.  -->
<Story name="Pan enabled" args={{ enablePan: true }} />
