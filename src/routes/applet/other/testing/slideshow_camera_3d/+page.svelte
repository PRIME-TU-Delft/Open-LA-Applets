<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import type { SlideShowSteps } from '$lib/controls/SlideShow.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import { MathVector3 } from '$lib/utils/MathVector';
  import { get } from 'svelte/store';
  import { _ } from 'svelte-i18n';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import Point3D from '$lib/threlte/Point3D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Axis3D from '$lib/threlte/Axis3D.svelte';

  const defaultState = {
    cameraZoom: 29,
    cameraPosition: new MathVector3(10, 10, 10),
    cameraTarget: new MathVector3(0, 0, 0),
    point: new MathVector3(2, 1, 3)
  };

  const steps: SlideShowSteps<typeof defaultState> = [
    (t, state) => {
      if (t >= 0.5) {
        state.cameraZoom = 70;
        state.cameraTarget = state.point.clone();
        state.cameraPosition = state.point.clone().add(new MathVector3(6, 6, 6));
      }
      return {
        state,
        labelNext: 'Zoom in on point',
        labelPrev: get(_)('ui.slideshow_original_state')
      };
    },

    (t, state) => {
      if (t >= 0.5) {
        state.cameraPosition = state.point.clone().add(new MathVector3(-8, 4, 6));
      }
      return { state, labelNext: 'Orbit', labelPrev: 'Zoom in on point' };
    },

    (t, state) => {
      if (t >= 0.5) {
        state.cameraZoom = 29;
        state.cameraTarget = new MathVector3(0, 0, 0);
        state.cameraPosition = new MathVector3(10, 10, 10);
      }
      return { state, labelNext: 'Reset camera', labelPrev: 'Orbit' };
    }
  ];

  const controls = Controls.addSlideShow(defaultState, steps);
  const state = $derived(controls[0]);
</script>

<Canvas3D
  cameraZoom={state.cameraZoom}
  cameraPosition={state.cameraPosition}
  cameraTarget={state.cameraTarget}
  {controls}
>
  <Vector3D direction={state.point} length={state.point.length()} color={PrimeColor.blue} />
  <Point3D position={state.point} />
  <Axis3D />
</Canvas3D>
