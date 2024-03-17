<script lang="ts">
  import { createEventDispatcher } from 'svelte'; // Importing the createEventDispatcher function from Svelte.

  export let debug = false; // A debug flag that can be set to true to log the current keys sequence.

  const dispatch = createEventDispatcher(); // Creating an event dispatcher.

  let lastKeyTime = 0; // The timestamp of the last key press.
  let konami = [
    // The Konami Code sequence.
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'KeyB',
    'KeyA'
  ];

  let currentKeys: string[] = []; // The current sequence of keys pressed by the user.

  // The function to handle keydown events.
  function handleKeyDown(e: KeyboardEvent) {
    const code = e.code; // The code of the key pressed.
    if (debug) console.log(code); //  If debug is true, Logging the code.

    const deltaTime = e.timeStamp - lastKeyTime; // The time elapsed since the last key press.

    if (deltaTime > 3000) {
      // If more than 3 seconds have passed since the last key press, reset the current keys sequence.
      currentKeys = [];
    }

    if (code === konami[currentKeys.length]) {
      // If the key pressed is the next key in the Konami Code sequence, add it to the current keys sequence.
      currentKeys.push(code);
      if (debug) console.log(currentKeys); // If debug is true, log the current keys sequence.
    } else {
      // If the key pressed is not the next key in the Konami Code sequence, reset the current keys sequence.
      currentKeys = [];
    }

    if (currentKeys.length === konami.length) {
      // If the current keys sequence is the same length as the Konami Code sequence, dispatch the 'konami' event.
      dispatch('konami');
    }

    lastKeyTime = e.timeStamp; // Update the timestamp of the last key press.
  }
</script>

<svelte:window on:keydown={handleKeyDown} />
