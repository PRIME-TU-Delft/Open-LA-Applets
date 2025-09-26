<script lang="ts">
  import { page } from '$app/state';
  import { getScreenshotName } from '$lib/screenshots/utils';

  const applet = $derived(page.params.applet);
</script>

<div class="flex h-full w-full justify-center">
  <img src={'/screenshots/' + getScreenshotName(applet)} alt={applet} class="h-full w-auto" />
</div>
