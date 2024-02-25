<script lang="ts">
    import { Arc2D, Draggable2D, RightAngle, Canvas2D, Latex2D, Line2D, Vector2D } from '$lib/d3-components';
    import { PrimeColor } from '$lib/utils/PrimeColors';
    import { Vector2, Vector3 } from 'three';
    
    let v = new Vector2(2, 2/3);
    $: L_start = v.clone().multiplyScalar(-20);
    $: L_end = v.clone().multiplyScalar(20);
    $: L_label = v.clone().normalize().multiplyScalar(5).add(new Vector2(-0.3, 0.3));

    let A_L = v.clone().multiplyScalar(1.5);
    let w_L = new Vector2(2.5, 2.5);
    let wL_sub_AL = w_L.clone().sub(A_L);

    let A_R = v.clone().multiplyScalar(-1.5);
    let w_R = new Vector2(-3.5, 0.5);
    let wR_sub_AR = w_R.clone().sub(A_R);
  </script>
  
  <Canvas2D zoom={1.3}>
    <Draggable2D id="angle_and_projection1" bind:position={w_L} color={PrimeColor.darkGreen} />
    <!-- Arcs -->
    <RightAngle vs={[wL_sub_AL,A_L]} lineWidth={0.03} origin={A_L}/>
    <Arc2D points={[w_L, v]} distance={0.8}></Arc2D>
    <Latex2D latex={'\\varphi'} position={new Vector2(0.8, 2/3)} color={PrimeColor.black} />

    <!-- L /-->
    <Line2D start={L_start} end={L_end} color={PrimeColor.cyan} />
    <Latex2D latex={'\\mathcal{L}'} position={L_label} color={PrimeColor.cyan} />

    <!-- Vector A -->
    <Vector2D direction={A_L} length={A_L.length()} color={PrimeColor.red} />
    <Latex2D
        latex={'A'}
        offset={A_L.clone().add(new Vector2(0, -0.2))}
        color={PrimeColor.black}
    />  

    <!-- Vector v -->
    <Vector2D direction={v} length={v.length()} color={PrimeColor.blue} />
    <Latex2D
        latex={'\\mathbf{v}'}
        offset={v.clone().add(new Vector2(0, -0.2))}
        color={PrimeColor.blue}
    />

    <!-- Vector w -->
    <Vector2D direction={w_L} length={w_L.length()} color={PrimeColor.darkGreen} />
    <Latex2D
        latex={'\\mathbf{w}'}
        offset={w_L.clone().add(new Vector2(-0.4, 0.2))}
        color={PrimeColor.darkGreen}
    />

    <!-- Vector w_sub_A -->
    <Vector2D origin={A_L} direction={wL_sub_AL} length={wL_sub_AL.length()} color={PrimeColor.black} hideHead isDashed/>
    <Latex2D
        latex={'B'}
        offset={w_L.clone().add(new Vector2(0.2, 0.2))}
        color={PrimeColor.black}
    />

    <svelte:fragment slot="splitCanvas">
        <Draggable2D id="angle_and_projection2" bind:position={w_R} color={PrimeColor.darkGreen} />
        <!-- Arcs -->
        <RightAngle vs={[wR_sub_AR,A_R]} lineWidth={0.03} origin={A_R}/>
        <Arc2D points={[w_R, v]} distance={0.8}></Arc2D>
        <Latex2D latex={'\\varphi'} position={new Vector2(0.5, 0.9)} color={PrimeColor.black} />

        <!-- L /-->
        <Line2D start={L_start} end={L_end} color={PrimeColor.cyan} />
        <Latex2D latex={'\\mathcal{L}'} position={L_label} color={PrimeColor.cyan} />

        <!-- Vector A -->
        <Vector2D direction={A_R} length={A_R.length()} color={PrimeColor.red} />
        <Latex2D
            latex={'A'}
            offset={A_R.clone().add(new Vector2(0, -0.2))}
            color={PrimeColor.black}
        />  

        <!-- Vector v -->
        <Vector2D direction={v} length={v.length()} color={PrimeColor.blue} />
        <Latex2D
            latex={'\\mathbf{v}'}
            offset={v.clone().add(new Vector2(0, -0.2))}
            color={PrimeColor.blue}
        />

        <!-- Vector w -->
        <Vector2D direction={w_R} length={w_R.length()} color={PrimeColor.darkGreen} />
        <Latex2D
            latex={'\\mathbf{w}'}
            offset={w_R.clone().add(new Vector2(0.2, 0.3))}
            color={PrimeColor.darkGreen}
        />

        <!-- Vector wA -->
        <Vector2D origin={A_R} direction={wR_sub_AR} length={wR_sub_AR.length()} color={PrimeColor.black} hideHead isDashed/>
        <Latex2D
            latex={'B'}
            offset={w_R.clone().add(new Vector2(-0.4, 0.2))}
            color={PrimeColor.black}
        />
    </svelte:fragment>
  </Canvas2D>
  