<script lang="ts">
  import { Euler, Quaternion, Vector3 } from 'three';
  import ThrelteLabel from 'utils/ThrelteLabel';
  import { Text } from '@threlte/extras';
  import { useFrame } from '@threlte/core';
  import { get } from 'svelte/store';

  export let label: ThrelteLabel = ThrelteLabel.default();
  export let start: Vector3 = new Vector3(0, 0, 0);
  export let end: Vector3 = new Vector3(0, 0, 0);
  export let rotation: Euler = new Euler();

  export let position = label.position;
  export let color: string = label.color;
  let quaternion: Quaternion = new Quaternion();

  $: {
    if (label.location == 'start') {
      position = start;
    } else if (label.location == 'end') {
      position = end;
    } else if (label.location == 'center') {
      position = start.clone().add(end).divideScalar(2);
    }

    position.add(new Vector3(0, label.size, 0));
  }

  function approxEqual(a: Quaternion, b: Quaternion, eps: number = 0.01) {
    return (
      Math.abs(a.x - b.x) < eps &&
      Math.abs(a.y - b.y) < eps &&
      Math.abs(a.z - b.z) < eps &&
      Math.abs(a.w - b.w) < eps
    );
  }

  useFrame(({ camera }) => {
    if (!camera) return;

    const quat = get(camera).quaternion;
    if (approxEqual(quat, quaternion)) return;

    quaternion = quat.clone();
    rotation = new Euler().setFromQuaternion(quaternion);
  });
</script>

{#if label.text}
  <Text
    {color}
    text={label.text}
    fontSize={label.size}
    position={label.position || position}
    {rotation}
  />
{/if}
