<script lang="ts">
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import CommandPrompt from './CommandPrompt.svelte';

  export let fileUrls: string[];
</script>

<nav class="sticky top-0 z-50 flex w-full justify-between bg-slate-100 p-4 backdrop-blur">
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="https://www.tudelft.nl/">TU Delft</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link
          href="https://www.tudelft.nl/ewi/over-de-faculteit/afdelingen/applied-mathematics"
        >
          DIAM
        </Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link
          href="https://www.tudelft.nl/ewi/over-de-faculteit/afdelingen/applied-mathematics/studeren/prime"
        >
          PRIME
        </Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link href="https://prime.pages.ewi.tudelft.nl/openlabook-published/index.html">
          Open LA book
        </Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Page>Interactive Applets</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>

  <CommandPrompt {fileUrls} />
</nav>
