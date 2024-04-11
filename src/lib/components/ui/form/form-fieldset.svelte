<script lang="ts" context="module">
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import type { FormPath, SuperForm } from 'sveltekit-superforms';
  type T = Record<string, unknown>;
  type U = unknown;
</script>

<script lang="ts">
  import { cn } from '$lib/utils.js';
  import * as FormPrimitive from 'formsnap';

  type T = $$Generic<Record<string, unknown>>;
  type U = $$Generic<FormPath<T>>;
  type $$Props = FormPrimitive.FieldsetProps<T, U>;

  export let form: SuperForm<T>;
  export let name: U;

  let className: $$Props['class'] = undefined;
  export { className as class };
</script>

<FormPrimitive.Fieldset
  {form}
  {name}
  let:constraints
  let:errors
  let:tainted
  let:value
  class={cn('space-y-2', className)}
>
  <slot {constraints} {errors} {tainted} {value} />
</FormPrimitive.Fieldset>
