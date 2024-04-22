<script lang="ts">
  import FolderList from './FolderList.svelte';
  import NavBar from './NavBar.svelte';

  const modules = import.meta.glob('$routes/applet/**/+page.svelte');

  let contributors = [
    { name: 'Abel de Bruijn', title: 'Developer' },
    { name: 'Julia van der Kris', title: 'Developer' },
    { name: 'Christophe Smet', title: 'Teacher' },
    { name: 'Fokko van de Bult', title: 'Teacher' },
    { name: 'Teun Janssen', title: 'Teacher' },
    { name: 'Beryl van Gelderen', title: 'Cooridinator' }
  ];

  $: fileUrls = Object.keys(modules).map((rawUrl) =>
    // Remove head of path and extension
    rawUrl.replace('/src/routes/applet/', '').replace('/+page.svelte', '')
  );
</script>

<NavBar {fileUrls} />

<div class="mx-auto max-w-2xl p-10">
  <FolderList {fileUrls} />

  <div
    class="container mx-auto my-10 box-border flex flex-col gap-2 rounded-lg border border-base-300 bg-base-200 p-4"
  >
    <div class="prose">
      <h2>Credits</h2>
      <p>
        These applets were created for the
        <a href="https://prime.pages.ewi.tudelft.nl/openlabook-published/index.html">
          TU Delft Open Linear Algebra book
        </a>
      </p>

      <h3>Contributors</h3>
      <div class="flex w-full flex-wrap justify-between gap-2">
        {#each contributors as { name, title }}
          <div class="flex gap-2">
            <div class="not-prose w-24 overflow-hidden rounded">
              <img
                class="aspect-square object-cover"
                src={'/contributors/' + name + '.jpg'}
                alt={'Profile of ' + name}
              />
            </div>
            <div class="flex flex-col gap-1">
              <span class="bold">{name}</span>
              <span class="text-xs">{title}</span>
            </div>
          </div>
        {/each}
      </div>

      <h3>License</h3>
      <p>
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
      </p>
    </div>
  </div>

  <div class="rounded bg-slate-300 p-10">
    <img class="h-20 w-full object-contain" alt="prime-tudelft" src="/logo-black.png" />
  </div>
</div>
