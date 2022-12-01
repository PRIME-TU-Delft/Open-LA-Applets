<script lang="ts">

    import { Vector3 } from 'three';
    import { Axis3D, Canvas3D, Label3D, Vector3D, Equation, PartialDeconstruction3D } from 'visuals-3d';

    import { PrimeColor } from 'utils/PrimeColors';
    import { Label } from 'utils/label';
  
    //green
    const v1 = new Vector3(-1, 2, 2);
    //blue
    const v2 = new Vector3(3, 3, 1);
    //red
    const v3 = v1.clone().add(v2);

    const labelPosScalar = 0.8;
    let label=  Label.default(); 
    const pointSize = 0.05;

  </script>

  
  <Canvas3D title={'Geometrical interpretation of addition for three-dimensional vectors.'} isPerspectiveCamera={false}>
  
    <!-- lower green vector -->
      <Vector3D 
        direction={v1} 
        color={PrimeColor.green} 
        length={v1.length()}
      />

      <Label3D
        size={label.size * 15}
        position={ v1.clone().add(v1.clone().normalize().multiplyScalar(labelPosScalar))}
        color={PrimeColor.green} 
        > 
        <Equation   s={"\\begin{bmatrix} " + v1.x + " \\\\ " + v1.z  + " \\\\ " +  v1.y  + " \\end{bmatrix}"} />

      </Label3D>

      <PartialDeconstruction3D p={v1} color={PrimeColor.green} showAxisPoints={true}/>

   <!-- upper green vector -->
      <Vector3D 
        direction={v1} 
        origin={v2} 
        color={PrimeColor.green}
        length={v1.length()}
      />
  

  <!-- blue vector -->
      <Vector3D 
        direction={v2} 
        color={PrimeColor.ultramarine} 
        length={v2.length()}
      />

      <Label3D
        size={label.size * 15}
        position={ v2.clone().add(v2.clone().normalize().multiplyScalar(labelPosScalar))}
        color={PrimeColor.ultramarine} 
        > 
        
        <Equation   s={"\\begin{bmatrix} " + v2.x + " \\\\ " + v2.z  + " \\\\ " +  v2.y  + " \\end{bmatrix}"} />
      </Label3D>

      <PartialDeconstruction3D p={v2} color={PrimeColor.ultramarine} showAxisPoints={true}/>

   <!-- red vector -->
      <Vector3D 
        direction={v3} 
        color={PrimeColor.red} 
        length={v3.length()}
        />

        <Label3D
        size={label.size * 15}
        position={ v3.clone().add(v3.clone().normalize().multiplyScalar(labelPosScalar))}
        color={PrimeColor.red} 
        > 
        
        <Equation   s={"\\begin{bmatrix} " + v3.x + " \\\\ " + v3.z  + " \\\\ " +  v3.y  + " \\end{bmatrix}"} />
        </Label3D>

        <PartialDeconstruction3D p={v3} color={PrimeColor.red} showAxisPoints={true}/>
  

  <Axis3D axisLength={7} />
  
  </Canvas3D>