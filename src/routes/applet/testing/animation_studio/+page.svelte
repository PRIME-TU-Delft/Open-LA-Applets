<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import type { SlideShowSteps } from '$lib/controls/SlideShow.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { get } from 'svelte/store';
  import { _ } from 'svelte-i18n';

  const state = {
    position: new Vector2(1, 1),
    zoom: 1,
    showSecondVector: false,
    fadeInThridVector: 0.1
  };

  /**
   * Define 3 keyframes for the animation
   * 1. Zoom from (1) to (2)
   * 2. position from (1,1) to (-3,2) and zoom from (2) -> (3)
   * 3. Show the second vector when t > 0.5 otherwise hide it and fade in the third vector
   */
  const transitionSteps: SlideShowSteps<typeof state> = [
    (t, state) => {
      // Zoom from (1) to (2)
      state.zoom = state.zoom + t;
      return {
        state,
        labelNext: get(_)('applets.testing.animation_studio.extended_length'),
        labelPrev: get(_)('applets.common.original_state')
      };
    },
    (t, state) => {
      // position from (1,1) to (-3,2)
      const deltaPos = new Vector2(-4, 1).multiplyScalar(t);
      state.position = state.position.add(deltaPos);

      // From (2) -> (3)
      state.zoom = state.zoom + 2 * t;

      return {
        state,
        labelNext: get(_)('applets.testing.animation_studio.translated'),
        labelPrev: get(_)('applets.testing.animation_studio.translated')
      };
    },
    (t, state) => {
      // Show the second vector when t > 0.5 otherwise hide it
      state.showSecondVector = t > 0.5;

      // Fade in the third vector
      state.fadeInThridVector = state.fadeInThridVector + 0.9 * t;

      return {
        state,
        labelNext: get(_)('applets.testing.animation_studio.show_2nd_and_fade_3rd_next'),
        labelPrev: get(_)('applets.testing.animation_studio.show_2nd_and_fade_3rd_prev')
      };
    }
  ];

  let controls = Controls.addSlideShow(state, transitionSteps);
</script>

<Canvas2D {controls}>
  <Vector2D
    direction={controls[0].position}
    length={controls[0].zoom}
    color={PrimeColor.raspberry}
  />

  {#if controls[0].showSecondVector}
    <Vector2D direction={new Vector2(1, 3)} length={3} color={PrimeColor.blue} />
  {/if}

  <Vector2D
    direction={controls[0].position.clone().add(new Vector2(-2, 0))}
    length={3}
    color={PrimeColor.darkGreen + PrimeColor.opacity(controls[0].fadeInThridVector)}
  />
</Canvas2D>
