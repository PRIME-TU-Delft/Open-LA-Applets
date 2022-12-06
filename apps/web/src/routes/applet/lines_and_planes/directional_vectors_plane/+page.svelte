<script lang="ts">
	
	import { Vector3 } from 'three';
    import { Label } from 'utils/Label';
	import { PrimeColor } from 'utils/PrimeColors';
    import { Equation , Vector3D, Canvas3D, Axis3D, PlaneFromNormal, Label3D} from 'visuals-3d';
    import Angle3D from 'visuals-3d/components/Angle3D.svelte';
    import Point3D from 'visuals-3d/components/Point3D.svelte';

	let label=  Label.default(); 

	const p = new Vector3(2, 1, 0.5);
	const pColor = PrimeColor.pink;
	const pLabelPos = p.clone().add(new Vector3(0, -0.3, 0));
  
	const n = new Vector3(1, 2, 1);
	const nColor = PrimeColor.ultramarine;
	const nLabelPos = n.clone().add(n.clone().normalize().multiplyScalar(0.2)).add(p);
	
	const q = new Vector3(1,  1, -((n.x+n.y)/n.z ));
	const qColor = PrimeColor.green;
	const qLabelPos =  q.clone().add(q.clone().normalize().multiplyScalar(0.3)).add(p);
	
  </script>
  
  <Canvas3D  title="A plane through the point  P." isPerspectiveCamera={false} cameraPos={[2, 0.5, 2]}>

	<PlaneFromNormal normal={n} point={p} color={PrimeColor.yellow}/>	

	<!-- n -->
	<Vector3D direction={n} origin={p} color={nColor} length={n.length()}/>
	<Label3D
        size={label.size * 15}
        position={nLabelPos}
        color={nColor} 
        > 
		<Equation s={`\\[ \\vec{n} \\]`} />
    </Label3D>
	
	<!-- Q -->
	<Vector3D direction={q} origin={p} color={PrimeColor.red} length={q.length()}/>
	<Point3D position={q.clone().add(p)} color={qColor}/>
	<Label3D
        size={label.size * 15}
        position={qLabelPos}
        color={qColor} 
        > 
		<Equation s={`\\[ Q \\]`} />
    </Label3D>

	<!-- P -->
	<Point3D position={p} color={pColor}/>
	<Label3D
        size={label.size * 15}
        position={pLabelPos}
        color={pColor} 
        > 
		<Equation s={`\\[ P \\]`} />
    </Label3D>
	

	<Angle3D vs={[n, q]} origin={p}/>
	
	<Axis3D />

  </Canvas3D>
  