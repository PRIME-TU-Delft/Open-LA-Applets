<script lang="ts">
  import { cameraStore, type CameraState } from '$lib/stores/cameraStore';
  import { page } from '$app/stores';
  import Icon from '$lib/components/Icon.svelte';
  import * as Accordion from '$lib/components/ui/accordion';
  import { Button } from '$lib/components/ui/button';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import * as Dialog from '$lib/components/ui/dialog';
  import Label from '$lib/components/ui/label/label.svelte';
  import { Textarea } from '$lib/components/ui/textarea';
  import type { Controls, Controller } from '$lib/utils/Controls';
  import { mdiOpenInNew } from '@mdi/js';

  type G = $$Generic<readonly Controller<number | boolean>[]>;

  export let controls: Controls<G> | undefined = undefined;

  let includeState = false; // If true, the url will include the current state of the applet  (camera position, etc...)

  let urlInput: HTMLTextAreaElement;

  $: state = getState($cameraStore, controls);
  $: url = $page.url?.origin + $page.url?.pathname;
  $: refUrl = $page.url?.pathname.replace('/applet/', '');
  $: lastUrl = refUrl?.split('/')?.slice(-1)[0]; // Last part of the url

  /**
   * Returns a string with the current state of the camera
   * @param cameraState
   */
  function getState(cameraState: CameraState, controls?: Controls<G>): string {
    if (!cameraState) return '';

    let stateUrlString: string[] = [];

    if ('position3D' in cameraState) {
      const position = cameraState.position3D;
      if (position)
        stateUrlString.push(
          `position3d=${position.x.toFixed(2)},${position.y.toFixed(2)},${position.z.toFixed(2)}`
        );

      const zoom = cameraState.zoom3D;
      if (zoom) stateUrlString.push(`zoom3d=${zoom.toFixed(2)}`);
    }

    if ('position2D' in cameraState) {
      const position = cameraState.position2D;
      if (position)
        stateUrlString.push(`position2d=${position.x.toFixed(2)},${position.y.toFixed(2)}`);

      const zoom = cameraState.zoom2D;
      if (zoom) stateUrlString.push(`zoom2d=${zoom?.toFixed(2)}`);
    }

    if (controls) {
      const controlsUrl = controls.toURL();
      stateUrlString.push(controlsUrl);
    }

    return '?' + stateUrlString.join('&');
  }
</script>

<Dialog.Content class="sm:max-w-xl">
  <Dialog.Header>
    <Dialog.Title>Share and embed</Dialog.Title>
    <Dialog.Description class="prose">
      This applet was created for the
      <a
        class="flex items-center gap-1"
        href="https://prime.pages.ewi.tudelft.nl/openlabook-published/index.html"
      >
        TU Delft Open Linear Algebra book <Icon path={mdiOpenInNew} /></a
      >
      For more information about these applets, please visit
      <a href="https://openla.ewi.tudelft.nl/applet">https://www.openla.ewi.tudelft.nl/applet</a>

      <Button
        class="flex gap-1 no-prose no-underline my-4"
        href="https://github.com/PRIME-TU-Delft/turborepo-visuals/issues?q=is%3Aissue+%28{lastUrl}+OR+{lastUrl?.replaceAll(
          '_',
          ''
        )}+OR+{lastUrl.split('_')[0]}%29"
      >
        <p>Go to this applet's github page here</p>
        <Icon path={mdiOpenInNew} />
      </Button>

      <Accordion.Root class="w-full">
        <!-- EMBEDING -->
        <Accordion.Item value="Embed">
          <Accordion.Trigger>Embed</Accordion.Trigger>
          <Accordion.Content>
            <Checkbox id="include-state" bind:checked={includeState} />
            <Label
              for="include-state"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Include current state in url
            </Label>

            <Label
              for="url-state"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Url to this apple
            </Label>
            <Textarea readonly bind:el={urlInput} value={url + (includeState ? state : '')} />
          </Accordion.Content>
        </Accordion.Item>

        <!-- LICENCING -->
        <Accordion.Item value="Licence">
          <Accordion.Trigger>Licence [CC-BY v4.0 / Apache v2.0]</Accordion.Trigger>
          <Accordion.Content>
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
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </Dialog.Description>
  </Dialog.Header>
  <Dialog.Footer class="bg-slate-300/70 w-full rounded p-2 my-4">
    <img
      class="h-24 w-full object-contain"
      alt="prime-tudelft"
      src="{$page.url?.origin || ''}/logo-black.png"
    />
  </Dialog.Footer>
</Dialog.Content>
