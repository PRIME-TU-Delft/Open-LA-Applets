<script lang="ts">
  import ExternalLink from '@lucide/svelte/icons/external-link';
  import FolderList from '$lib/components/frontpage/FolderList.svelte';
  import NavBar from '$lib/components/frontpage/NavBar.svelte';
  import { resolve } from '$app/paths';

  const modules = import.meta.glob('/src/routes/applet/calculus/**/+page.svelte');

  let contributors = [
    { name: 'Abel de Bruijn', title: 'Lead-developer' },
    { name: 'Pauline Hengst', title: 'Frontend-developer' },
    { name: 'Julia van der Kris', title: 'Backend-developer' },
    { name: 'Bartek Włodarczyk', title: 'Developer' },
    { name: 'Zhenghan Zhong', title: 'Developer' },
    { name: 'Christophe Smet', title: 'Teacher/Reviewer' },
    { name: 'Fokko van de Bult', title: 'Teacher/Reviewer' },
    { name: 'Teun Janssen', title: 'Teacher/Reviewer' },
    { name: 'Beryl van Gelderen', title: 'Coordinator' }
  ];

  const fileUrls = Object.keys(modules).map((rawUrl) =>
    // Remove head of path and extension
    rawUrl.replace('/src/routes/applet/calculus/', '').replace('/+page.svelte', '')
  );
</script>

<NavBar
  bookTitle="Open Calculus book"
  bookURL="https://tudelft-prime-books.github.io/Calculus/"
  {fileUrls}
  directory="calculus/"
/>

<div class="mx-auto my-32 max-w-4xl rounded-xl bg-blue-50 p-10">
  <div class="prose w-full max-w-full">
    <h1>Interactive Calculus applets</h1>
    These applets were created for the
    <a
      class="inline-flex items-center gap-1 hover:underline"
      href="https://tudelft-prime-books.github.io/Calculus/"
    >
      TU Delft Open Calculus book <ExternalLink class="h-4 w-4" /></a
    >. Abstract calculus concepts are visualized in an interactive way to help students understand
    the material better. Using 2D and 3D graphics, the applets provide a hands-on experience to
    explore the concepts.

    <p>
      The applets are sorted by the paragraph that they are associated with in the book. Feel free
      to explore each applet by clicking on the links below.
    </p>

    <blockquote class="border-green-400/50 bg-green-400/10 py-2 text-green-800">
      <span class="font-bold">Hint:</span>
      Looking for Linear Algebra applets? Go to the
      <a class="inline-flex items-center gap-1 hover:underline" href={resolve('/')}
        >main page <ExternalLink class="h-4 w-4" /></a
      >
    </blockquote>

    <blockquote class="border-green-400/50 bg-green-400/10 py-2 text-green-800">
      <span class="font-bold">Hint:</span>
      Press
      <kbd
        class="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none"
      >
        <span class="text-xs">⌘/Ctrl</span>K
      </kbd> to search through all applets.
    </blockquote>
  </div>

  <FolderList {fileUrls} directory="calculus/" />

  <div
    class="border-base-300 bg-base-200 container mx-auto my-10 box-border flex flex-col gap-2 rounded-lg border p-4"
  >
    <div class="prose max-w-full">
      <h2>Credits</h2>
      <p>
        These applets were created for the
        <a href="https://tudelft-prime-books.github.io/Calculus/"> TU Delft Open Calculus book </a> by
        these wonderful contributors.
      </p>

      <h3>Contributors</h3>
      <div class="columns-1 gap-2 md:columns-2">
        {#each contributors as { name, title } (name)}
          <div class="mb-2 flex gap-2">
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
