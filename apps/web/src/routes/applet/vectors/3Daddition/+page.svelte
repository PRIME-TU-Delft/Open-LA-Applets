<script lang="ts">
    import { Vector3 } from 'three';
  
    import { Axis3D, Canvas3D, Label3D } from 'visuals-3d';

    import Vector3D from 'visuals-3d/components/Vector3D.svelte';
    import { PrimeColor } from 'ui/utils/primeColors';
    import { Label } from 'visuals-3d/utils/label';
  
    //green
    let v1 = new Vector3(2, 2, -2).multiplyScalar(0.5);
    //blue
    let v2 = new Vector3(1, 3, 2).multiplyScalar(0.5);
    //red
    let v3 = v1.clone().add(v2);

    let labelShift= new Vector3(0, 0.4 , 0);
    let label=  Label.default(); 
    
  </script>
  
  <Canvas3D title={'Geometrical interpretation of addition for three-dimensional vectors.'}>
  

    <!-- lower green vector -->
  <Vector3D 
    direction={v1} 
    color={PrimeColor.green} 
    showDeconstruction={true}
    deconstructionColor={PrimeColor.green}
    length={v1.length()}
   />
   
   <Label3D
     size={label.size * 15}
     position={ v1.clone().multiplyScalar(0.5).add(labelShift)}
     color={PrimeColor.green} 
     > [2, 2, -2]
  </Label3D>


   <!-- upper green vector -->
  <Vector3D 
    direction={v1} 
    origin={v2} 
    color={PrimeColor.green}
    showDeconstruction={true}
    deconstructionColor={PrimeColor.green}
    length={v1.length()}
  />

  <Label3D
    size={label.size * 15}
    position={ v1.clone().multiplyScalar(0.5).add(v2).add(labelShift)}
    color={PrimeColor.green} 
    > [2, 2, -2]
  </Label3D>

  <!-- blue vector -->
  <Vector3D 
    direction={v2} 
    color={PrimeColor.ultramarine} 
    showDeconstruction={true}
    deconstructionColor={PrimeColor.ultramarine}
    length={v2.length()}
   />

   <Label3D
    size={label.size * 15}
    position={ v2.clone().multiplyScalar(0.5).add(labelShift)}
    color={PrimeColor.ultramarine} 
    > [1, 3, 2]
  </Label3D>

   <!-- red vector -->
  <Vector3D 
    direction={v3} 
    color={PrimeColor.red} 
    showDeconstruction={true}
    deconstructionColor={PrimeColor.red}
    length={v3.length()}
    />

    <Label3D
    size={label.size * 15}
    position={ v3.clone().multiplyScalar(0.5).add(labelShift)}
    color={PrimeColor.red} 
    > [3, 5, 1]
  </Label3D>
  

  <Axis3D axisLength={3} />
  </Canvas3D>