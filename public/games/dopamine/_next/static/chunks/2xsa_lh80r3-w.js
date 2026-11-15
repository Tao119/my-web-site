(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,1624,e=>{"use strict";var t=e.i(26524),n=e.i(59534),r=e.i(13526),a=e.i(57591),i=e.i(85536),o=e.i(71077),l=e.i(8359),u=e.i(97932),c=e.i(31706);let s=`
  uniform float uTime;
  uniform float uPulse;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uAspect;
  uniform float uTanHalf;
  uniform float uEnergy;
  uniform vec2 uPointer;
  uniform vec2 uClick;

  attribute vec4 aRand;

  varying vec3 vColor;
  varying float vAlpha;

  const vec3 PINK   = vec3(1.0, 0.176, 0.584);
  const vec3 ORANGE = vec3(1.0, 0.541, 0.0);
  const vec3 LIME   = vec3(0.776, 1.0, 0.0);
  const vec3 CYAN   = vec3(0.0, 0.941, 1.0);
  const vec3 VIOLET = vec3(0.545, 0.361, 0.965);

  vec3 palette(float t) {
    t = fract(t) * 5.0;
    if (t < 1.0) return mix(PINK, ORANGE, t);
    if (t < 2.0) return mix(ORANGE, LIME, t - 1.0);
    if (t < 3.0) return mix(LIME, CYAN, t - 2.0);
    if (t < 4.0) return mix(CYAN, VIOLET, t - 3.0);
    return mix(VIOLET, PINK, t - 4.0);
  }

  vec3 swirl(vec3 p, float t) {
    return vec3(
      sin(p.y * 1.7 + t) + sin(p.z * 2.3 - t * 1.3),
      sin(p.z * 1.9 + t * 1.1) + sin(p.x * 2.1 + t * 0.7),
      sin(p.x * 1.5 - t * 0.9) + sin(p.y * 2.5 + t * 1.2)
    ) * 0.5;
  }

  void main() {
    vec3 p = position;
    float r = length(p.xz);

    // differential rotation: the core spins faster than the rim
    float ang = uTime * 0.16 / (0.55 + r * 0.32);
    float c = cos(ang);
    float s = sin(ang);
    p.xz = mat2(c, -s, s, c) * p.xz;

    p += swirl(p * 0.55, uTime * 0.35) * (0.10 + 0.28 * aRand.x) * (1.0 + uEnergy);
    p *= 1.0 + 0.035 * sin(uTime * 1.4 + r * 0.9);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float depth = -mv.z;
    vec2 scale = vec2(uAspect, 1.0) * uTanHalf * depth;
    vec2 ndc = mv.xy / scale;

    // pointer repulsion (screen space, depth-consistent)
    vec2 dP = ndc - uPointer;
    dP.x *= uAspect;
    float dl = length(dP);
    float near = exp(-dl * dl * 7.0);
    ndc += (dP / (dl + 1e-4)) * near * 0.32 * vec2(1.0 / uAspect, 1.0);

    // click shockwave
    vec2 dC = ndc - uClick;
    dC.x *= uAspect;
    float cl = length(dC);
    float ring = uPulse * 2.2;
    float fade = 1.0 - clamp(uPulse / 1.5, 0.0, 1.0);
    float wave = exp(-pow((cl - ring) * 4.5, 2.0)) * fade;
    ndc += (dC / (cl + 1e-4)) * wave * 0.30 * vec2(1.0 / uAspect, 1.0);

    mv.xy = ndc * scale;
    gl_Position = projectionMatrix * mv;

    float hue = 0.97 + r * 0.075 + aRand.y * 0.3 + uTime * 0.015 - wave * 0.15;
    vec3 col = palette(hue);
    col += vec3(1.0) * (near * 0.35 + wave * 1.0);
    vColor = col * (0.2 + aRand.z * 0.4);
    vAlpha = 0.3 + aRand.w * 0.5 + wave;

    float size = uSize * (0.45 + aRand.z * 1.1) * (1.0 + near * 1.6 + wave * 2.4 + uEnergy * 0.6);
    gl_PointSize = size * uPixelRatio * (12.0 / depth);
  }
`,d=`
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = pow(smoothstep(0.5, 0.0, d), 2.2);
    gl_FragColor = vec4(vColor * a, a * vAlpha);
  }
`;function f({count:e}){let r=(0,n.useRef)(null),o=(0,n.useRef)(null),v=(0,n.useRef)({x:0,y:0,cx:0,cy:0,pulseStart:-10}),m=(0,n.useRef)({x:0,y:0,energy:0}),{gl:p,size:h}=(0,i.useThree)(),{pos:x,rnd:g}=(0,n.useMemo)(()=>(e=>{let t=new Float32Array(3*e),n=new Float32Array(4*e);for(let r=0;r<e;r+=1){let e=.035>Math.random(),a=e?1.6*Math.pow(Math.random(),2.2):.6+7.4*Math.pow(Math.random(),1.4),i=r%4/4*Math.PI*2+.75*a+(Math.random()-.5)*(e?6.28:.85/(.4+.25*a)),o=e?.9:.12+.05*a;t[3*r]=Math.cos(i)*a+(Math.random()-.5)*o,t[3*r+1]=(Math.random()-.5)*o*(e?2.2:1.1)*1.6,t[3*r+2]=Math.sin(i)*a+(Math.random()-.5)*o,n[4*r]=Math.random(),n[4*r+1]=Math.random(),n[4*r+2]=Math.random(),n[4*r+3]=Math.random()}return{pos:t,rnd:n}})(e),[e]),w=(0,n.useMemo)(()=>({uTime:{value:0},uPulse:{value:9},uSize:{value:2.9},uPixelRatio:{value:1},uAspect:{value:1},uTanHalf:{value:Math.tan(55*Math.PI/360)},uEnergy:{value:0},uPointer:{value:new l.Vector2(9,9)},uClick:{value:new l.Vector2(0,0)}}),[]);return(0,n.useEffect)(()=>{let e=p.domElement,t=t=>{let n=e.getBoundingClientRect();return{x:(t.clientX-n.left)/n.width*2-1,y:-((t.clientY-n.top)/n.height*2-1),inside:t.clientY>=n.top&&t.clientY<=n.bottom}},n=e=>{let n=t(e);n.inside&&(v.current.x=n.x,v.current.y=n.y)},r=e=>{let n=t(e);n.inside&&(v.current.cx=n.x,v.current.cy=n.y,v.current.pulseStart=performance.now()/1e3,m.current.energy=1,(0,c.reward)(2,{x:e.clientX,y:e.clientY},1.1))};return window.addEventListener("pointermove",n,{passive:!0}),window.addEventListener("pointerdown",r,{passive:!0}),()=>{window.removeEventListener("pointermove",n),window.removeEventListener("pointerdown",r)}},[p]),(0,a.useFrame)(e=>{let t=r.current,n=o.current;if(!t||!n)return;let a=e.clock.elapsedTime,i=v.current,l=a-i.pulseStart;l>4&&a%5.5<.03&&(i.cx=0,i.cy=0,i.pulseStart=a,l=0),m.current.energy*=.955,m.current.x+=(i.x-m.current.x)*.12,m.current.y+=(i.y-m.current.y)*.12;let c=Math.min(1,u.scrollState.y/Math.max(1,h.height));t.uniforms.uTime.value=a,t.uniforms.uPulse.value=l,t.uniforms.uPixelRatio.value=e.gl.getPixelRatio(),t.uniforms.uAspect.value=h.width/h.height,t.uniforms.uEnergy.value=m.current.energy,t.uniforms.uPointer.value.set(m.current.x,m.current.y),t.uniforms.uClick.value.set(i.cx,i.cy),n.rotation.x=1-.7*c+-.08*m.current.y,n.rotation.z=.9*c+.08*m.current.x,e.camera.position.z=9.5-5.5*c}),(0,t.jsx)("group",{ref:o,children:(0,t.jsxs)("points",{frustumCulled:!1,children:[(0,t.jsxs)("bufferGeometry",{children:[(0,t.jsx)("bufferAttribute",{attach:"attributes-position",args:[x,3]}),(0,t.jsx)("bufferAttribute",{attach:"attributes-aRand",args:[g,4]})]}),(0,t.jsx)("shaderMaterial",{ref:r,vertexShader:s,fragmentShader:d,uniforms:w,transparent:!0,depthWrite:!1,blending:l.AdditiveBlending,toneMapped:!1})]})})}function v(){let e=(0,n.useMemo)(()=>new l.Vector2(6e-4,6e-4),[]);return(0,a.useFrame)(()=>{let t=Math.min(.006,7e-4+25e-5*Math.abs(u.scrollState.velocity));e.set(t,t)}),(0,t.jsxs)(o.EffectComposer,{multisampling:0,children:[(0,t.jsx)(o.Bloom,{intensity:.7,luminanceThreshold:.3,luminanceSmoothing:.85,mipmapBlur:!0}),(0,t.jsx)(o.ChromaticAberration,{offset:e,radialModulation:!1,modulationOffset:0}),(0,t.jsx)(o.Vignette,{eskil:!1,offset:.15,darkness:.85})]})}e.s(["default",0,function({active:e,reduced:a}){let i=(0,n.useMemo)(()=>window.innerWidth<768?26e3:7e4,[]);return(0,n.useEffect)(()=>{(0,c.burst)({x:window.innerWidth/2,y:window.innerHeight/2,power:1.4})},[]),(0,t.jsxs)(r.Canvas,{dpr:[1,1.75],frameloop:a?"demand":e?"always":"never",camera:{position:[0,0,9.5],fov:55,near:.1,far:60},gl:{antialias:!1,powerPreference:"high-performance",alpha:!0},children:[(0,t.jsx)(f,{count:i}),(0,t.jsx)(v,{})]})}],1624)},47730,function(e){e.n(e.i(1624))}]);