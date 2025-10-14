<script lang="ts">
  import * as Select from '$lib/components/ui/select/index.js';
  import type { Dropdown } from '$lib/controls/Dropdown.svelte';
  import { _ } from 'svelte-i18n';

  type DropdownProps = {
    controller: Dropdown;
  };

  const { controller: dropdown }: DropdownProps = $props();

  const localizedValue = $derived($_(dropdown.value) || $_('dropdown_select_item'));

  const localizedValues = $derived(dropdown.values.map((v) => $_(v) || ''));
</script>

<Select.Root type="single" name="favoriteFruit" bind:value={dropdown.value}>
  <Select.Trigger class="w-[180px]">
    {localizedValue}
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      {#if dropdown.label}
        <Select.GroupHeading>{dropdown.label}</Select.GroupHeading>
      {/if}
      {#each dropdown.values as item, index (item)}
        <Select.Item value={item} label={localizedValues[index]}>
          {localizedValues[index]}
        </Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>
