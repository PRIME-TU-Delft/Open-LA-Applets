<script lang="ts">
	
	import { Vector3 } from 'three';
    import { Label } from 'utils/Label';
	import { PrimeColor } from 'utils/PrimeColors';
    import { Equation , Vector3D, Canvas3D, Axis3D, PlaneFromNormal, Label3D} from 'visuals-3d';
    import Angle3D from 'visuals-3d/components/Angle3D.svelte';
    import Point3D from 'visuals-3d/components/Point3D.svelte';


  
	const n = new Vector3(1, 2, 1);
	const nColor = PrimeColor.ultramarine;
	
	let label=  Label.default(); 
	
	$: q = new Vector3(1,  1, -((n.x+n.y)/n.z ));
	const qColor = PrimeColor.green;
	
  </script>
  
  <Canvas3D  title="A plane through the origin.">

	<PlaneFromNormal normal={n} color={PrimeColor.yellow}/>	

	<!-- n -->
	<Vector3D direction={n} color={nColor} length={n.length()}/>
	<Label3D
        size={label.size * 15}
        position={n.clone().multiplyScalar(1.1)}
        color={nColor} 
        > 
		<Equation s={`\\[ \\vec{n} \\]`} />
    </Label3D>
	
	<!-- Q -->
	<Vector3D direction={q} color={PrimeColor.red} length={q.length()}/>
	<Point3D position={q} color={qColor}/>
	<Label3D
        size={label.size * 15}
        position={q.clone().multiplyScalar(1.1)}
        color={qColor} 
        > 
		<Equation s={`\\[ Q \\]`} />
    </Label3D>

	

	<Angle3D vs={[n, q]}/>
	
	<Axis3D />

  </Canvas3D>
  