<script lang="ts">
  import { page } from '$app/stores';
  import { mdiClose, mdiContentCopy, mdiShare } from '@mdi/js';
  import { Icon } from 'mdi-svelte-ts';
  import { fly } from 'svelte/transition';
  import type { OrthographicCamera } from 'three';
  import { cameraStore } from 'threlte-components';
  import { RoundButton } from '../index';
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
  <div class="absolute z-[100] h-full max-w-full p-4" transition:fly={{ x: -100 }}>
    <div class="prose h-full w-[30rem] rounded bg-slate-300 p-4 opacity-90">
      <div class="flex justify-between">
        <h1>PRIME</h1>
        <RoundButton on:click={() => (showShareWindow = false)} icon={mdiClose} />
      </div>
      <p>WHAT IS PRIME? [TODO]</p>
      <p>WHAT ARE THESE APPLETS FOR? [TODO]</p>
      <p>Licence CC-By etc... [TODO]</p>

      <label>
        <span>Url to this applet</span>
        <div class="relative">
          {#key includeState && sliders.sliders}
            <textarea
              bind:this={urlInput}
              style="overflow-wrap: normal;"
              class="overflow-wrap h-24 w-full resize-none rounded p-2 pr-10"
              readonly
              value={url + (includeState ? state : '')}
            />
          {/key}
          <button
            class="absolute top-1 right-1 h-8 w-8 rounded bg-slate-800/90 p-2 text-slate-100 transition-all hover:scale-105 hover:bg-slate-900"
            on:click={copyToClipboard}><Icon path={mdiContentCopy} /></button
          >
        </div>
      </label>

      <div
        class="w-full text-right text-green-900 opacity-0 transition-opacity duration-300"
        class:opacity-100={showCopyToClipboard}
      >
        Copied url to clipboard
      </div>

      <label class="flex items-center gap-2">
        <input class="h-4 w-4" type="checkbox" bind:checked={includeState} />
        <span>Include current state</span>
      </label>

      <label>
        <span>Reference URL</span>
        <div class="relative">
          <input class="w-full" type="text" readonly value={refUrl} />
        </div>
      </label>

      <p>
        Or go to this github page <a
          rel="noopener noreferrer"
          target="_blank"
          href="https://github.com/PRIME-TU-Delft/turborepo-visuals/issues?q=is%3Aissue+is%3Aopen+{refUrl.replace(
            '/',
            '%2F'
          )}">here</a
        >
      </p>

      <p>CREDITS</p>
    </div>
  </div>
{:else}
  <div class="absolute -left-4 bottom-4 transition-all hover:left-0">
    <RoundButton twClass="!pl-10" on:click={() => (showShareWindow = true)} icon={mdiShare} />
  </div>
{/if}
