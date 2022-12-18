import { BlendFunction, Effect } from 'postprocessing'
import { Uniform } from 'three'
import { useFrame } from '@react-three/fiber'
const fragmentShader = /* glsl */ `
uniform float offset;
void mainUv(inout vec2 uv){
 
    
}

void coswarp(inout vec3 trip, float warpsScale ){

    trip.xyz += warpsScale * .1 * cos(3. * trip.yzx + (offset * .15));
    trip.xyz += warpsScale * .05 * cos(11. * trip.yzx + (offset * .15));
    trip.xyz += warpsScale * .025 * cos(17. * trip.yzx + (offset * .15));
    
  }  

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
{
    vec4 color = inputColor;
    float t = (offset * .2) + length(uv-.5);

    vec2 uv2 = fract(uv * 10.);
    float alpha =   .5;

    vec3 color2 = vec3(uv.x, uv.y, 1.);
    coswarp(color2, 3.);
    coswarp(color2, 3.);
    coswarp(color2, 3.);

    alpha+= (color2.r *.25);
    
   vec3 color3 = mix(inputColor.rgb, color2, sin(t));
    
    outputColor = vec4(color3, 1.);
    //outputColor = vec4(.8, 1., .3, inputColor.a);
    
}`


export default class Warpffect extends Effect{

   
   
    constructor({  blendFunction =BlendFunction.DARKEN}){
        super('Warpffect', 
        fragmentShader, 
        {
            blendFunction,
            uniforms: new Map([
              
               ['offset', new Uniform(0)],
              
              
                  
            ])
        }
    )
       
    
    }

update(renderer, inputBuffer, deltaTime){
    this.uniforms.get('offset').value += deltaTime
   
    
}

}
