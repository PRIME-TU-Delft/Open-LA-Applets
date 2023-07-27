<script lang="ts">
  import { page } from '$app/stores';
  import { mdiClose, mdiContentCopy, mdiOpenInNew } from '@mdi/js';
  import Icon from '$lib/components/Icon.svelte';
  import type { OrthographicCamera } from 'three';
  import type { Sliders } from '$lib/utils/Slider';
  import cameraStore from '../threlte-components/stores/cameraStore';

  export let sliders: Sliders;

  let showCopyToClipboard = false;
  let includeState = true; // If true, the url will include the current state of the applet  (camera position, etc...)

  let urlInput: HTMLTextAreaElement;

  $: state = sliders.sliders && getState($cameraStore);
  $: url = $page.url?.origin + $page.url?.pathname;
  $: refUrl = $page.url?.pathname.replace('/applet/', '');
  $: lastUrl = refUrl?.split('/')?.slice(-1)[0]; // Last part of the url

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

<div class="drawer-side z-50">
  <label for="my-drawer" class="drawer-overlay" />
  <ul
    class="menu p-0 max-w-xs sm:max-w-sm md:max-w-2xl bg-base-200 container h-full overflow-y-auto"
  >
    <div>
      <div class="prose sticky top-0 z-20 bg-base-300/90 flex justify-between items-top p-2">
        <h1 class="mb-0">Share and Embed</h1>
        <label for="my-drawer" class="btn btn-outline">
          <Icon path={mdiClose} />
        </label>
      </div>

      <div class="prose">
        <!-- class="menu prose p-4 w-80 h-full bg-base-200 text-base-content relative overflow-hidden overflow-y-auto" -->

        <h3>About</h3>
        <p>
          This applet was created for the
          <a href="https://dbalague.pages.ewi.tudelft.nl/openlabook">
            TU Delft Open Linear Algebra book</a
          >.
        </p>

        <h3>Embed</h3>
        <div class="form-control">
          <label class="cursor-pointer label">
            <span class="label-text">Include current state</span>
            <input type="checkbox" class="toggle toggle-accent" bind:checked={includeState} />
          </label>

          <label class="label" for="url-state">
            <span class="label-text">Url to this applet</span>
          </label>
          <div class="relative w-full form-control">
            <textarea
              id="url-state"
              class="textarea textarea-bordered h-24"
              bind:this={urlInput}
              style="overflow-wrap: normal;"
              readonly
              value={url + (includeState ? state : '')}
            />
            <button
              class="absolute btn btn-sm btn-square btn-primary right-1 top-1"
              on:click={copyToClipboard}
            >
              <Icon path={mdiContentCopy} />
            </button>
          </div>
          <label class="label" for="url-state">
            <span
              class="label-text-alt text-green-400 opacity-0"
              class:opacity-100={showCopyToClipboard}>Copied url to clipboard</span
            >
          </label>
        </div>

        <h3>Applet Id</h3>
        <input class="w-full rounded p-2" type="text" readonly value={refUrl} />

        <li>
          <a
            class="w-full flex justify-between"
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/PRIME-TU-Delft/turborepo-visuals/issues?q=is%3Aissue+%28{lastUrl}+OR+{lastUrl?.replaceAll(
              '_',
              ''
            )}%29"
          >
            <span>Go this applet's github page here</span> <Icon path={mdiOpenInNew} /></a
          >
        </li>

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

      <div class="bg-slate-300/70 w-full rounded p-2 my-4">
        <img
          class="h-24 w-full object-contain"
          alt="prime-tudelft"
          src="{$page.url?.origin || ''}/logo-black.png"
        />
      </div>
    </div>
  </ul>
</div>

<style lang="postcss">
  h3 {
    @apply sticky top-10 z-10 bg-base-300 p-2;
  }
</style>
