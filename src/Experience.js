import { useRef, useEffect, useMemo } from "react"
import { OrbitControls , shaderMaterial, Center} from '@react-three/drei'
import { useAnimations,useGLTF, Clone } from "@react-three/drei"
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import { EffectComposer } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

import { useFrame } from "@react-three/fiber";
import * as THREE from 'three';
import Fog  from './Fog.js'


export default function Experience(){

    let raph = useRef()
    const model = useGLTF('./raph.glb')
    const mesh = useRef();
    const fogRef = useRef()


    let count = 500

 const animations = useAnimations(model.animations, model.scene)



 const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const time = 1
      const factor =  Math.floor(Math.random() * 120) + 20
      const speed = Math.random() * .1
      const x = Math.floor(Math.random() * 100) -50;
      const y = Math.floor(Math.random() * 100) -50;
      const z = Math.floor(Math.random() * 100) -50;
  
      temp.push({ time, factor, speed, x, y, z });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    // Run through the randomized data to calculate some movement
    particles.forEach((particle, index) => {
      let { factor, speed, x, y, z } = particle;

      // Update the particle time
      const t = (particle.time += speed * .05);

      // Update the particle position based on the time
      // This is mostly random trigonometry functions to oscillate around the (x, y, z) point
      dummy.position.set(
        x + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        y + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        z + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );

      // Derive an oscillating value which will be used
      // for the particle size and rotation
      const s = Math.cos(t);
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();

      // And apply the matrix to the instanced item
      mesh.current.setMatrixAt(index, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });


    useEffect(() =>
    {
        const action = animations.actions.metarigAction
        action.play()
    }, [])


    return(

        <>
         <EffectComposer >

        
    
    <Fog 
    ref={ fogRef }
    blendFunction={ BlendFunction.DARKEN}

    />

    </EffectComposer>
    <OrbitControls makeDefault enableZoom={true} maxPolarAngle={Math.PI * .5}/>


         <primitive ref={raph} object={ model.scene } 
         scale={ 10.5 }
         position={ [ 0, -.5, 2.5 ] }/>




<instancedMesh ref={mesh} args={[null, null, count]}>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshPhongMaterial color="#ffffff"  />
      </instancedMesh>

        </>

    )
}