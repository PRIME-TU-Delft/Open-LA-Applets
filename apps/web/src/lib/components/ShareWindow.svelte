<script lang="ts">
  import { page } from '$app/stores';
  import { mdiClose, mdiContentCopy, mdiShare } from '@mdi/js';
  import { Icon } from 'mdi-svelte-ts';
  import { fly } from 'svelte/transition';
  import type { OrthographicCamera } from 'three';
  import cameraStore from '../threlte-components/stores/cameraStore';
  import { RoundButton } from 'ui';
  import { Sliders } from 'utils/Slider';

  export let sliders: Sliders;

  let showShareWindow = false;
  let showCopyToClipboard = false;
  let includeState = true; // If true, the url will include the current state of the applet  (camera position, etc...)

  let urlInput: HTMLTextAreaElement;

  $: state = sliders.sliders && getState($cameraStore);
  $: url = $page.url.origin + $page.url.pathname;
  $: refUrl = $page.url.pathname.replace('/applet/', '');

  /**
   * Returns a string with the current state of the camera
   * @param camera
   */
  function getState(camera: OrthographicCamera): string {
    if (!camera) return '';

    let states: string[] = [];

    const { position, zoom } = camera;

    states.push(
      `position=${position.x.toFixed(2)},${position.y.toFixed(2)},${position.z.toFixed(2)}`
    );
    states.push(`zoom=${zoom.toFixed(2)}`);

    const slidersUrl = sliders.getURL();
    if (slidersUrl && sliders.hasSliders()) {
      states.push(slidersUrl);
    }

    return '?' + states.join('&');
  }

  /**
   * Copies the url to the clipboard
   */
  function copyToClipboard() {
    urlInput.focus();

    if (includeState) {
      navigator.clipboard.writeText(url + state);
    } else {
      navigator.clipboard.writeText(url);
    }

    showCopyToClipboard = true;

    setTimeout(() => {
      showCopyToClipboard = false;
    }, 3000);
  }
</script>

{#if showShareWindow}
  <div class="absolute left-0 top-0 z-[100] h-full max-w-full p-4" transition:fly={{ x: -100 }}>
    <div
      class="prose prose-sm h-full w-full overflow-hidden overflow-y-auto rounded bg-slate-300 p-4 pt-0 opacity-90"
      style="max-width: 30rem;"
    >
      <div class="sticky top-0 z-20 flex w-full justify-between bg-slate-300/90 pt-4">
        <h1>Share and Embed</h1>
        <RoundButton on:click={() => (showShareWindow = false)} icon={mdiClose} />
      </div>

      <h3>About</h3>
      <p>
        This was created for the
        <a href="https://dbalague.pages.ewi.tudelft.nl/openlabook">
          TU Delft Open Linear Algebra book
        </a>
      </p>

      <h3>Embed</h3>
      <label class="flex items-center gap-2">
        <input class="h-4 w-4" type="checkbox" bind:checked={includeState} />
        <span>Include current state</span>
      </label>

      <label>
        <div class="relative">
          {#key includeState && sliders.sliders}
            <textarea
              bind:this={urlInput}
              style="overflow-wrap: normal;"
              class="h-24 w-full resize-none rounded p-2 pr-10"
              readonly
              value={url + (includeState ? state : '')}
            />
          {/key}
          <button
            class="absolute right-1 top-1 h-8 w-8 rounded bg-slate-800/90 p-2 text-slate-100 transition-all hover:scale-105 hover:bg-slate-900"
            on:click={copyToClipboard}><Icon path={mdiContentCopy} /></button
          >

          <div
            class="absolute -bottom-4 right-0 text-green-900 opacity-0 transition-opacity duration-300"
            class:opacity-100={showCopyToClipboard}
          >
            Copied url to clipboard
          </div>
        </div>
      </label>

      <label>
        <h3>Applet Id</h3>

        <input class="w-full rounded p-2" type="text" readonly value={refUrl} />
      </label>

      <p>
        Or go to this github page <a
          rel="noopener noreferrer"
          target="_blank"
          href="https://github.com/PRIME-TU-Delft/turborepo-visuals/issues?q=is%3Aissue+is%3Aopen+{refUrl
            .split('/')
            .slice(-1)}">here</a
        >
      </p>

      <img class="h-20" alt="prime-tudelft" src="/logo-black.png" />

      <h3>License</h3>
      <a class="not-prose" rel="license" href="http://creativecommons.org/licenses/by/4.0/"
        ><img
          alt="Creative Commons License"
          style="border-width:0"
          src="https://i.creativecommons.org/l/by/4.0/88x31.png"
        /></a
      ><br /><span>PRIME Linear Algebra applets</span>
      by
      <a
        href="https://www.tudelft.nl/ewi/over-de-faculteit/afdelingen/applied-mathematics/studeren/prime"
        property="cc:attributionName"
        rel="cc:attributionURL">PRIME, TU Delft</a
      >
      is licensed under a
      <a rel="license" href="http://creativecommons.org/licenses/by/4.0/"
        >Creative Commons Attribution 4.0 International License</a
      >.<br />Based on a work at
      <a href="https://github.com/PRIME-TU-Delft/turborepo-visuals" rel="dct:source"
        >https://github.com/PRIME-TU-Delft/turborepo-visuals</a
      >.<br />Permissions beyond the scope of this license may be available at
      <a
        href="https://github.com/PRIME-TU-Delft/turborepo-visuals/blob/main/LICENSE"
        rel="cc:morePermissions"
        >https://github.com/PRIME-TU-Delft/turborepo-visuals/blob/main/LICENSE</a
      >.
    </div>
  </div>
{:else}
  <div class="absolute -left-4 bottom-4 transition-all hover:left-0">
    <RoundButton twClass="!pl-10" on:click={() => (showShareWindow = true)} icon={mdiShare} />
  </div>
{/if}

<style lang="postcss">
  h3 {
    @apply sticky top-16 z-10 bg-slate-300 py-2;
  }
</style>
