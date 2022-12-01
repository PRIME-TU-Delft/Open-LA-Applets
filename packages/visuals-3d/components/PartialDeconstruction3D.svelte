<script lang="ts">

	import DashedLine3D from './DashedLine3D.svelte';
    import { Vector3 } from "three";
    
    
    export let p :  Vector3;
    export let color : string = 'black'; //color of used lines
    export let x = false;

    let o = new Vector3(0, 0, 0);

    //points on each axis
    let xAx = new Vector3(p.x, 0, 0);
    let yAx = new Vector3(0, p.y, 0);
    let zAx = new Vector3(0, 0, p.z);

    //points on each plane
    let yP = new Vector3(p.x, 0, p.z);
    
</script>


<!-- three lines to x,z axis -->
<DashedLine3D points={[p, yP]} color={color} />
<DashedLine3D points={[yP, xAx]} color={color} />
<DashedLine3D points={[yP, zAx]} color={color} />

<!-- line to z axis -->
<DashedLine3D points={[p, yAx]} color={color}/>




