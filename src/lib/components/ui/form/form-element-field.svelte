<script lang="ts">
  import { cn } from '$lib/utils.js';
  import * as FormPrimitive from 'formsnap';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { SuperForm } from 'sveltekit-superforms';

  type T = $$Generic<Record<string, unknown>>;
  type U = $$Generic<FormPath<T>>;
  type $$Props = FormPrimitive.ElementFieldProps<T, U> & HTMLAttributes<HTMLDivElement>;

  export let form: SuperForm<T>;
  export let name: U;

  let className: $$Props['class'] = undefined;
  export { className as class };
</script>

<FormPrimitive.ElementField {form} {name} let:constraints let:errors let:tainted let:value>
  <div class={cn('space-y-2', className)}>
    <slot {constraints} {errors} {tainted} {value} />
  </div>
</FormPrimitive.ElementField>
