<script lang="ts">
	import { onMount, afterUpdate, onDestroy, getContext } from 'svelte';

	import { BufferGeometry, Color,  Line, LineBasicMaterial, Vector3 } from 'three';
	
	import getRandomColor from 'ui/utils/primeColors';
	import { sceneKey, type SceneContext } from '../utils/sceneKey';

	export let color: string = 'Black';
	export let points: [Vector3, Vector3] = [new Vector3(5, 0, 0), new Vector3(5, 0, 0)];
	export let origin: Vector3 = new Vector3(0,0,0);
	export let pointsOnArc: number = 15;

	export let u = new Vector3(0, 1, 0);
	
	// Import scene from root Canvas.svelte. Context is used because store is too global.
	// More info: https://svelte.dev/docs#run-time-svelte-setcontext
	const { scene } = getContext<SceneContext>(sceneKey);


	//explanation of math can be found in  Open LA book Teams -> developers interactivity -> files -> cirkelboog.pdf

	function rTemp( t: number, is180: boolean ){
		const a = points[0].clone();
		const b = is180 ? u.clone() : points[1].clone();

		return a.multiplyScalar(Math.cos(t)).add(b.multiplyScalar(Math.sin(t)));
	}

	
	function calculatePoints() {

		let arcPoints : Vector3[] = [];

		let is180 : boolean = points[0].dot(points[1]) == -points[0].length() * points[1].length();

		let limitT = is180 ? Math.PI : (Math.PI/2);

		let counter = 0;
		while (counter <= pointsOnArc) {
			const t = counter * (limitT / pointsOnArc);
			const r = rTemp(t, is180);
			let newPoint = r.multiplyScalar(points[0].length() /r.length()).add(origin);
			arcPoints.push(newPoint);

			if(!is180 ){
				u = newPoint.clone();
			}

			counter++;
		}
		
		return arcPoints;
	} 

	let curvePoints = calculatePoints();

	const geometry = new BufferGeometry().setFromPoints(curvePoints);
	const material = new LineBasicMaterial();
	let arc: Line;
	

	/**
	 * Init the arc
	 */
	onMount(() => {
		// Set a randomColor if no color is set
		color = color ?? getRandomColor();

		material.color.set(color);
		
		arc  = new Line( geometry, material );
		arc.geometry.attributes.position.needsUpdate = true;
		scene.add( arc);
	});

	/**
	 * When points are changed, update geometry & material color.
	 */
	afterUpdate(() => {
		
		let newPoints =  calculatePoints();
		geometry.setFromPoints(newPoints);

		// Check if color is a valid css color accepts: [#fff, #f0f0f0, rgb(255, 255, 255), rgba(255, 255, 255, 1)] | rejects: [random, #rgba]
		if (!CSS.supports('color', color)) return;

		const newColor = new Color(color);

		// Check if color is updated
		if (!newColor.equals(material.color)) {
			material.color.set(newColor);
		}
	});

	onDestroy(() => {
		scene.remove(arc);
	});
</script>