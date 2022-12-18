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

  void uvRipple(inout vec2 uv, float intensity){

	vec2 p = uv -.5;


    float cLength=length(p);

     uv= uv +(p/cLength)*cos(cLength*15.0-offset*.5)*intensity;

} 

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
{
    vec4 color = inputColor;
    float t = (offset * .2) + length(uv-.5);

    vec2 uv2 = uv;
    float alpha =   .5;

    uvRipple(color.rg, 2.4);
    coswarp(color.rgb, 3.);
    coswarp(color.rgb, 3.);
    coswarp(color.rgb, 3.);

    vec3 color2 = vec3(uv2.x, uv2.y, 1.);
    coswarp(color2, 3.);
    coswarp(color2, 3.);
    coswarp(color2, 3.);

    alpha+= (color2.r *.25);
    
    
   vec3 color3 = mix(color.rgb, color2, 1.);

   if(uv.x < .5){
       color3 = inputColor.rgb;
   }

   if(uv.x < .35){
    color3 = vec3(step(color.r, .5 ), step(color.r, .4), step(color.r, .3));
}
    
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
