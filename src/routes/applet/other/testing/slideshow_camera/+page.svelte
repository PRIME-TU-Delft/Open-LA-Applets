<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import type { SlideShowSteps } from '$lib/controls/SlideShow.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { get } from 'svelte/store';
  import { _ } from 'svelte-i18n';

  const defaultState = {
    cameraZoom: 1,
    cameraPosition: new Vector2(0, 0),
    target: new Vector2(2, 1)
  };

  const steps: SlideShowSteps<typeof defaultState> = [
    (t, state) => {
      // Set once per step (gated on t >= 0.5) so CanvasD3 eases to it itself.
      if (t >= 0.5) {
        state.cameraZoom = 2.5;
        state.cameraPosition = state.target.clone();
      }

      return {
        state,
        labelNext: get(_)('applets.testing.slideshow_camera.zoom_in_on_point'),
        labelPrev: get(_)('ui.slideshow_original_state')
      };
    },
    (t, state) => {
      if (t >= 0.5) {
        state.cameraZoom = 1;
        state.cameraPosition = new Vector2(0, 0);
      }

      return {
        state,
        labelNext: get(_)('applets.testing.slideshow_camera.reset_camera'),
        labelPrev: get(_)('applets.testing.slideshow_camera.zoom_in_on_point')
      };
    }
  ];

  const controls = Controls.addSlideShow(defaultState, steps);
  const state = $derived(controls[0]);
</script>

<Canvas2D cameraZoom={state.cameraZoom} cameraPosition={state.cameraPosition} {controls}>
  <Vector2D direction={state.target} length={state.target.length()} color={PrimeColor.blue} />
  <Point2D position={state.target} />
</Canvas2D>
