<script lang="ts">
  import * as Select from '$lib/components/ui/select/index.js';
  import type { Dropdown } from '$lib/controls/Dropdown.svelte';
  import { getLocalizedString } from '$lib/utils';
  import { locale, _ } from 'svelte-i18n';

  type DropdownProps = {
    controller: Dropdown;
  };

  const { controller: dropdown }: DropdownProps = $props();

  let selectedKey = $state(dropdown.value.en);

  $effect(() => {
    const matchingValue = dropdown.values.find((v) => v.en === selectedKey);
    if (matchingValue) {
      dropdown.value = matchingValue;
    }
  });

  const localizedValue = $derived(
    getLocalizedString(dropdown.value, $locale || 'en') || $_('dropdown_select_item')
  );

  const localizedValues = $derived(
    dropdown.values.map((v) => getLocalizedString(v, $locale || 'en') || '')
  );
</script>

<Select.Root type="single" name="favoriteFruit" bind:value={selectedKey}>
  <Select.Trigger class="w-[180px]">
    {localizedValue}
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      {#if dropdown.label}
        <Select.GroupHeading>{dropdown.label}</Select.GroupHeading>
      {/if}
      {#each dropdown.values as item, index (item.en)}
        <Select.Item value={item.en} label={localizedValues[index]}>
          {localizedValues[index]}
        </Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>
