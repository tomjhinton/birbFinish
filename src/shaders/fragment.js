export default /* glsl */`uniform float uTime;

varying vec2 vUv;

void coswarp(inout vec3 trip, float warpsScale ){

    trip.xyz += warpsScale * .1 * sin(3. * trip.yzx + (uTime * .15));
    trip.xyz += warpsScale * .05 * sin(11. * trip.yzx + (uTime * .15));
    trip.xyz += warpsScale * .025 * sin(17. * trip.yzx + (uTime * .15));
    
  }  

  void uvRipple(inout vec2 uv, float intensity){

	vec2 p = uv -.5;


    float cLength=length(p);

     uv= uv +(p/cLength)*cos(cLength*15.0-uTime*.5)*intensity;

} 

void main()
{
 
    vec2 uv = vUv;
    vec3 color = vec3(0., 0., 1.);

    uvRipple(uv, .25);
    vec3 color2 = vec3(uv.x, uv.y, 1.);
   
    coswarp(color2, 3.);
    coswarp(color2, 3.);
    coswarp(color2, 3.);

    color = mix( vec3(.1, 0.,color2.r), color, color2.b);


    gl_FragColor = vec4(color, 1.0);
}`