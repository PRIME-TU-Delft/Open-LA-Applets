<script lang="ts">
	
	import { Vector3 } from 'three';
	import { Formula } from 'ui';
    import { Label } from 'utils/Label';
  
	import { PrimeColor } from 'utils/PrimeColors';
	import { Sliders } from 'utils/Slider';
    import { Equation , Vector3D, Canvas3D, AutoPlane, Axis3D, PlaneFromNormal, Label3D} from 'visuals-3d';
    import Angle3D from 'visuals-3d/components/Angle3D.svelte';
    import Point3D from 'visuals-3d/components/Point3D.svelte';


  
	const n = new Vector3(1, 2, 1);

	let label=  Label.default(); 
	
	$: b1 = new Vector3(1,  1, -((n.x+n.y)/n.z ));

	
  </script>
  
  <Canvas3D  title="A plane through the origin.">

	<PlaneFromNormal normal={n} color={PrimeColor.yellow}/>	

	<!-- n -->
	<Vector3D direction={n} color={PrimeColor.ultramarine} length={n.length()}/>
	<Label3D
        size={label.size * 15}
        position={n.clone().multiplyScalar(1.1)}
        color={PrimeColor.ultramarine} 
        > 
       n
    </Label3D>
	
	<!-- Q -->
	<Vector3D direction={b1} color={PrimeColor.red} length={b1.length()}/>
	<Point3D position={b1} color={PrimeColor.green}/>
	<Label3D
        size={label.size * 15}
        position={b1.clone().multiplyScalar(1.1)}
        color={PrimeColor.green} 
        > 
       Q
    </Label3D>

	

	<Angle3D vs={[n, b1]}/>
	
	<Axis3D />

  </Canvas3D>
  