<script lang="ts">
  import '../app.postcss';
  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/stores';
  import { globalStateStore } from '$lib/stores/globalStateStore';
  import { setPosition, setZoom } from '$lib/utils/parseUrl';

  afterNavigate(() => {
    const url = $page?.url;

    if (!url) return;
    const searchParams = url.searchParams;

    setPosition(searchParams);

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
