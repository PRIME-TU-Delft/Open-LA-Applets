<script lang="ts">
  let contributors = [
    { name: 'Bartek Włodarczyk', title: 'Lead-Developer' },
    { name: 'Abel de Bruijn', title: 'Lead-developer' },
    { name: 'Zhenghan Zhong', title: 'Developer' },
    { name: 'Pauline Hengst', title: 'Frontend-developer' },
    { name: 'Julia van der Kris', title: 'Backend-developer' },
    { name: 'Christophe Smet', title: 'Teacher/Reviewer' },
    { name: 'Fokko van de Bult', title: 'Teacher/Reviewer' },
    { name: 'Teun Janssen', title: 'Teacher/Reviewer' },
    { name: 'Beryl van Gelderen', title: 'Coordinator' }
  ];

  type CreditsProps = {
    bookName?: string | null;
    bookURL?: string | null;
  };

  let { bookName, bookURL }: CreditsProps = $props();
</script>

<div
  class="border-base-300 bg-base-200 container mx-auto my-10 box-border flex flex-col gap-2 rounded-lg border p-4"
>
  <div class="prose max-w-full">
    <h2>Credits</h2>
    <p>
      These applets were created
      {#if bookName && bookURL}
        for the
        <a href={bookURL}>
          {bookName}
        </a>
      {/if}
      by these wonderful contributors.
    </p>

    <h3>Contributors</h3>
    <div class="columns-1 gap-2 md:columns-2">
      {#each contributors as { name, title } (name)}
        <div class="mb-2 flex gap-2">
          <div class="not-prose aspect-square w-24 overflow-hidden rounded">
            <img
              class="block h-full w-full object-cover"
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
