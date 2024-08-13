<script>
  import { page } from '$app/stores';
  import { cameraState } from '$lib/stores/camera.svelte';
  import { Checkbox } from './ui/checkbox';
  import { Label } from './ui/label';
  import Textarea from './ui/textarea/textarea.svelte';

  let includeState = $state(false); // If true, the url will include the current state of the applet  (camera position, etc...)

  const stateUrl = $derived.by(() => {
    const url = new URL($page.url.host + $page.url.pathname);

    if (!includeState) {
      return url.toString();
    }

    if (cameraState.camera3D) {
      url.searchParams.set('position3D', cameraState.camera3D.positionString(2));
      url.searchParams.set('zoom3D', cameraState.camera3D.zoomString(2));
    }

    if (cameraState.camera2D) {
      url.searchParams.set('position2D', cameraState.camera2D.positionString(2));
      url.searchParams.set('zoom2D', cameraState.camera2D.zoomString(2));
    }

    if (cameraState.splitCamera3D) {
      url.searchParams.set('split-position3D', cameraState.splitCamera3D.positionString(2));
      url.searchParams.set('split-zoom3D', cameraState.splitCamera3D.zoomString(2));
    }

    if (cameraState.splitCamera2D) {
      url.searchParams.set('split-position2D', cameraState.splitCamera2D.positionString(2));
      url.searchParams.set('split-zoom2D', cameraState.splitCamera2D.zoomString(2));
    }

    return url.toString();
  });
</script>

<div class="flex items-center gap-2 mb-4">
  <Checkbox id="include-state" bind:checked={includeState} />
  <Label
    for="include-state"
    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    <span>Include current state in url</span>
  </Label>
</div>

<Label
  for="url-state"
  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
>
  Url to this applet:
</Label>

<Textarea readonly value={stateUrl}>
  hello{stateUrl}
</Textarea>
