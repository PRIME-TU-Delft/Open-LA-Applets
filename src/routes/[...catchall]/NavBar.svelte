<script lang="ts">
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import CommandPrompt from './CommandPrompt.svelte';

  export let fileUrls: string[];
</script>

<nav
  class="sticky top-0 z-50 flex w-full justify-between bg-gradient-to-br from-blue-900/95 to-blue-600/50 p-4 backdrop-blur"
>
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="https://www.tudelft.nl/" class="link">TU Delft</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link
          href="https://www.tudelft.nl/ewi/over-de-faculteit/afdelingen/applied-mathematics"
          class="link flex gap-1"
        >
          DIAM
        </Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link
          href="https://www.tudelft.nl/ewi/over-de-faculteit/afdelingen/applied-mathematics/studeren/prime"
          class="link"
        >
          PRIME
        </Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link
          href="https://prime.pages.ewi.tudelft.nl/openlabook-published/index.html"
          class="link"
        >
          Open LA book
        </Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Page class="text-blue-100">Interactive Applets</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>

  <CommandPrompt {fileUrls} />
</nav>

<style>
  :global(li[role='presentation'] svg) {
    fill: #bfdbfe;
  }

  nav :global(.link) {
    scale: 1;
    color: #dbeafe;
    transition: scale 0.2s;

    &:hover {
      scale: 1.1;
      color: #bfdbfe;
      text-decoration: underline;
    }
  }
</style>
