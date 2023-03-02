<script lang="ts">
  export let iframe = false;
  export let enableZoom: boolean;

  let idle = true;
  $: {
    enableZoom = !(iframe && idle);
    console.log(`enableZoom=${enableZoom}`);
  }

  const TIMEOUT = 3_000;

  let timeoutId: NodeJS.Timeout;

  function extendTimer() {
    if (!iframe) return;

    console.log(`BEFORE: ${enableZoom}`);
    if (idle) idle = false;
    else clearTimeout(timeoutId);
    console.log(`AFTER: ${enableZoom}\n\n`);

    timeoutId = setTimeout(() => {
      idle = true;
    }, TIMEOUT);
  }
</script>

<svelte:window on:click={extendTimer} />
