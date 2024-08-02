<script lang="ts">
	import type { Controls } from '$lib/controls/Controls';
	import type { Toggle } from '$lib/controls/Toggle.svelte';
	import Line3D from '$lib/threlte/Line3D.svelte';
	import PlaneFromPoints from '$lib/threlte/planes/PlaneFromPoints.svelte';
	import { PrimeColor } from '$lib/utils/PrimeColors';
	import { T } from '@threlte/core';
	import { MeshLineGeometry, MeshLineMaterial } from '@threlte/extras';
	import { Vector3 } from 'three';

	type CubePlaneLineProps = {
		toggles: Controls<readonly [Toggle, Toggle, Toggle]>;
		uvw: [Vector3, Vector3, Vector3];
	};

	let { toggles, uvw }: CubePlaneLineProps = $props();

	const CUBE_SIZE = 15;
</script>

{#if toggles[0] && toggles[1] && toggles[2]}
	<T.Mesh scale={0.5}>
		<MeshLineGeometry
			points={[
				new Vector3(-CUBE_SIZE, -CUBE_SIZE, -CUBE_SIZE),
				new Vector3(-CUBE_SIZE, -CUBE_SIZE, CUBE_SIZE),
				new Vector3(-CUBE_SIZE, CUBE_SIZE, CUBE_SIZE),
				new Vector3(-CUBE_SIZE, CUBE_SIZE, -CUBE_SIZE),
				new Vector3(-CUBE_SIZE, -CUBE_SIZE, -CUBE_SIZE),
				new Vector3(CUBE_SIZE, -CUBE_SIZE, -CUBE_SIZE),
				new Vector3(CUBE_SIZE, -CUBE_SIZE, CUBE_SIZE),
				new Vector3(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE),
				new Vector3(CUBE_SIZE, CUBE_SIZE, -CUBE_SIZE),
				new Vector3(-CUBE_SIZE, CUBE_SIZE, -CUBE_SIZE),
				new Vector3(CUBE_SIZE, CUBE_SIZE, -CUBE_SIZE),
				new Vector3(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE),
				new Vector3(-CUBE_SIZE, CUBE_SIZE, CUBE_SIZE),
				new Vector3(-CUBE_SIZE, CUBE_SIZE, -CUBE_SIZE),
				new Vector3(CUBE_SIZE, CUBE_SIZE, -CUBE_SIZE)
			]}
		/>
		<MeshLineMaterial width={0.01} color={PrimeColor.black} opacity={0.5} transparent />
	</T.Mesh>

	<T.Mesh scale={0.5}>
		<MeshLineGeometry
			points={[
				new Vector3(CUBE_SIZE, -CUBE_SIZE, -CUBE_SIZE),
				new Vector3(CUBE_SIZE, CUBE_SIZE, -CUBE_SIZE),
				new Vector3(-CUBE_SIZE, CUBE_SIZE, -CUBE_SIZE),
				new Vector3(-CUBE_SIZE, -CUBE_SIZE, -CUBE_SIZE),
				new Vector3(-CUBE_SIZE, -CUBE_SIZE, CUBE_SIZE),
				new Vector3(CUBE_SIZE, -CUBE_SIZE, CUBE_SIZE)
			]}
		/>
		<MeshLineMaterial width={0.01} color={PrimeColor.black} opacity={0.5} transparent />
	</T.Mesh>

	<T.Mesh>
		<T.BoxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />
		<T.MeshBasicMaterial color={PrimeColor.yellow} opacity={0.5} transparent />
	</T.Mesh>
{:else if (toggles[0] && toggles[1]) || (toggles[0] && toggles[2]) || (toggles[1] && toggles[2])}
	{@const u = toggles[0] ? uvw[0] : new Vector3()}
	{@const v = toggles[1] ? uvw[1] : new Vector3()}
	{@const w = toggles[2] ? uvw[2] : new Vector3()}
	<PlaneFromPoints points={[u, v, w]} color={PrimeColor.yellow} />
{:else if toggles[0] || toggles[1] || toggles[2]}
	{#each toggles as toggle, i}
		{#if toggle.value}
			<Line3D
				origin={uvw[i].clone().normalize().multiplyScalar(-10)}
				endPoint={uvw[i].clone().normalize().multiplyScalar(10)}
				color={PrimeColor.yellow}
				radius={1.5}
			/>
		{/if}
	{/each}
{/if}
