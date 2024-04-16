<script lang="ts">
  import '../app.postcss';
  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/stores';
  import { cameraStore } from '$lib/stores/cameraStore';
  import { Vector2, Vector3 } from 'three';
  import { globalStateStore } from '$lib/stores/globalStateStore';

  $: console.log($globalStateStore);

  /**
   * Sets the position of the camera based on the provided search parameters.
   * @param {URLSearchParams} searchParams - The search parameters containing the camera position.
   */
  function setPosition(searchParams: URLSearchParams) {
    const keys = ['position3D', 'position3d', 'position', 'position2D', 'position2d'];

    for (const key of keys) {
      if (searchParams.has(key)) {
        const position = searchParams.get(key)!.split(',').map(Number);

        if (position.length === 3) {
          const position3D = new Vector3(...position);
          cameraStore.updatePartialState({ position3D });
        } else if (position.length === 2) {
          const position2D = new Vector2(...position);
          cameraStore.updatePartialState({ position2D });
        }
      }
    }
  }

  /**
   * Sets the zoom level for the camera based on the provided search parameters.
   * @param {URLSearchParams} searchParams - The search parameters containing the zoom level.
   * @param {number} dimension - The dimension of the camera (2D or 3D). Default is 3.
   * @param {string[]} keys - The keys to check for the zoom level in the search parameters. Default is ['zoom', 'zoom3D', 'zoom3d'].
   */
  function setZoom(
    searchParams: URLSearchParams,
    dimension = 3,
    keys: string[] = ['zoom', 'zoom3D', 'zoom3d']
  ) {
    for (const key of keys) {
      if (searchParams.has(key)) {
        const zoom = Number(searchParams.get(key));

        if (dimension === 2) cameraStore.updatePartialState({ zoom2D: zoom });
        else if (dimension == 3) cameraStore.updatePartialState({ zoom3D: zoom });
      }
    }
  }

  afterNavigate(() => {
    const url = $page?.url;

    if (!url) return;
    const searchParams = url.searchParams;

    setPosition(searchParams);

    console.log('layout', $cameraStore);

    // Set the zoom level for the camera
    setZoom(searchParams, 2, ['zoom2D', 'zoom2d', 'distance']);
    setZoom(searchParams);

    // Set the title of the page
    if (searchParams.has('title')) {
      const title = searchParams.get('title')!;
      globalStateStore.changeState({ title });
    }

    // Set if the scene is inside an iframe
    if (searchParams.has('iframe')) {
      const inIframe = searchParams.get('iframe')! == 'true';
      globalStateStore.changeState({ inIframe });
    }
  });
</script>

<slot />
