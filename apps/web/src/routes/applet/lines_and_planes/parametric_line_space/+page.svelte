<script lang="ts">
	import { Vector3 } from 'three';
    import { Equation } from 'visuals-3d';
    import Axis3D from "visuals-3d/components/Axis3D.svelte";
    import Canvas3D from "visuals-3d/components/Canvas3D.svelte";
    import Label3D from "visuals-3d/components/Label3D.svelte";
    import Vector3D from "visuals-3d/components/Vector3D.svelte";
    import { Label } from 'utils/label';
    import { PrimeColor } from 'utils/PrimeColors';
    import Line3D from 'visuals-3d/components/Line3D.svelte';

    let v = new Vector3(1, 2, -0.5);
    let v0 = new Vector3(-1, 1, 0);

    let u = v.clone().add(v0.clone().multiplyScalar(-1));

    let Lstart = v0.clone().add(u.clone().multiplyScalar(-0.4));
    let Lfin = v0.clone().add(u).add(u);

    

    let label=  Label.default(); 
    const labelPosScalar = 0.2;
</script>

<Canvas3D isPerspectiveCamera={false}>

    <Axis3D hideNumbers={true} hideTicks={true}/>

    <!-- label origin -->
    <Label3D
        size={label.size * 15}
        position={new Vector3(-0.1, -0.1, 0.1)}
        color={'black'} 
        > 
        <Equation s={`\\[ O \\]`} />
    </Label3D>



    <!-- yellow vector: v -->

    <Vector3D
        direction={v}
        color={PrimeColor.yellow}
        length={v.length()}
    />

    <Label3D
        size={label.size * 15}
        position={ v.clone().add(v.clone().normalize().multiplyScalar(labelPosScalar).add(new Vector3(0, -0.3, 0)))}
        color={PrimeColor.yellow} 
        > 
        <Equation s={`\\[ \\vec{v} \\]`} />
    </Label3D>



    <!-- red vector: v0 -->

    <Vector3D
        direction={v0}
        color={PrimeColor.red}
        length={v0.length()}
    />

    <Label3D
        size={label.size * 15}
        position={ v0.clone().add(v0.clone().normalize().multiplyScalar(labelPosScalar))}
        color={PrimeColor.red} 
        > 
        <Equation s={`\\[ \\vec{v_0} \\]`} />
    </Label3D>

    <!-- Line L -->
    <Line3D points={[Lstart ,Lfin]} color={PrimeColor.ultramarine}/>

    <Label3D
        size={label.size * 15}
        position={ Lfin.clone().add(Lfin.clone().normalize().multiplyScalar(labelPosScalar))}
        color={PrimeColor.ultramarine} 
        > 
            <Equation s={`\\[ L \\]`} />

        </Label3D>


    <!--  u : driectional of L -->
    <Vector3D 
        direction={u}
        length={u.length()/3}
        origin={v0}
        color={"#0066A2"}/>

        <Label3D
        size={label.size * 15}
        position={ v0.clone().add(u.clone().multiplyScalar(0.4)).add(new Vector3(0, 0.3, 0))}
        color={"#0066A2"} 
        > 
            <Equation s={`\\[ \\vec{u} \\]`} />

        </Label3D>

        <!-- r * u -->
        <Vector3D 
        direction={u}
        length={u.length()}
        origin={v0}
        color={PrimeColor.green}/>

        <Label3D
        size={label.size * 15}
        position={ v0.clone().add(u).multiplyScalar(1.1)}
        color={PrimeColor.green} 
        > 
            <Equation s={`\\[ r \\vec{u} \\]`} />

        </Label3D>
    

</Canvas3D>