<script lang="ts">
  import { page } from '$app/state';
  import * as Accordion from '$lib/components/ui/accordion';
  import * as Dialog from '$lib/components/ui/dialog';
  import ExternalLink from '@lucide/svelte/icons/external-link';
  import Embedding from './Embedding.svelte';
</script>

<Dialog.Content class="block sm:max-w-xl">
  <Dialog.Header>
    <Dialog.Title>Share and embed</Dialog.Title>
    <Dialog.Description>
      This applet was created for the
      <a
        class="flex items-center gap-1"
        href="https://interactivetextbooks.tudelft.nl/linear-algebra/"
      >
        TU Delft Open Linear Algebra book <ExternalLink class="h-4 w-4" /></a
      >
      For more information about these applets, please visit
      <a href="https://openla.ewi.tudelft.nl/applet">https://www.openla.ewi.tudelft.nl/applet</a>

      <Accordion.Root type="single" class="w-full">
        <!-- EMBEDING -->
        <Accordion.Item value="Embed">
          <Accordion.Trigger>Embed interactively</Accordion.Trigger>
          <Accordion.Content>
            <Embedding />
          </Accordion.Content>
        </Accordion.Item>

        <!-- STATIC IMAGE -->
        <Accordion.Item value="Static image">
          <Accordion.Trigger>Static image</Accordion.Trigger>
          <Accordion.Content>
            <Embedding staticImage={true} />
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
  <Dialog.Footer class="my-4 w-full rounded bg-slate-300/70 p-2">
    <img
      class="h-24 w-full object-contain"
      alt="prime-tudelft"
      src="{page?.url?.origin || ''}/logo-black.png"
    />
  </Dialog.Footer>
</Dialog.Content>
