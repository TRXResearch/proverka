// AML Crystal 3D Engine
// Three.js holographic crystal

const canvas = document.getElementById("crystalCanvas");

if (canvas) {

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
45,
canvas.clientWidth / canvas.clientHeight,
0.1,
100
);

camera.position.z = 5;


const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha:true,
    antialias:true
});


renderer.setPixelRatio(window.devicePixelRatio);

renderer.setSize(
canvas.clientWidth,
canvas.clientHeight
);



/* LIGHT */

const light1 = new THREE.PointLight(
0x00ff88,
5,
10
);

light1.position.set(2,3,3);

scene.add(light1);



const light2 = new THREE.PointLight(
0x00d4ff,
4,
10
);

light2.position.set(-3,-2,2);

scene.add(light2);



/* CRYSTAL GEOMETRY */


const geometry =
new THREE.IcosahedronGeometry(
1.25,
2
);



const material =
new THREE.MeshPhysicalMaterial({

color:0x00d4ff,

metalness:0.2,

roughness:0.05,

transmission:0.95,

thickness:1.5,

clearcoat:1,

clearcoatRoughness:0.1,

emissive:0x00ff88,

emissiveIntensity:0.4

});



const crystal =
new THREE.Mesh(
geometry,
material
);


scene.add(crystal);



/* INNER CORE */

const coreGeometry =
new THREE.IcosahedronGeometry(
0.45,
2
);


const coreMaterial =
new THREE.MeshBasicMaterial({

color:0x00ff88,

wireframe:true

});


const core =
new THREE.Mesh(
coreGeometry,
coreMaterial
);


scene.add(core);



/* PARTICLES */


const particlesGeometry =
new THREE.BufferGeometry();


const particles = [];


for(let i=0;i<300;i++){

particles.push(
(Math.random()-0.5)*8,
(Math.random()-0.5)*8,
(Math.random()-0.5)*8
);

}


particlesGeometry.setAttribute(
"position",
new THREE.Float32BufferAttribute(
particles,
3
)
);



const particlesMaterial =
new THREE.PointsMaterial({

color:0x00ff88,

size:0.03

});


const stars =
new THREE.Points(
particlesGeometry,
particlesMaterial
);


scene.add(stars);



/* ANIMATION */


function animate(){

requestAnimationFrame(animate);


crystal.rotation.y +=0.005;

crystal.rotation.x +=0.002;


core.rotation.y -=0.01;


stars.rotation.y +=0.001;



renderer.render(
scene,
camera
);


}


animate();



/* RESPONSIVE */

window.addEventListener(
"resize",
()=>{

renderer.setSize(
canvas.clientWidth,
canvas.clientHeight
);

camera.aspect =
canvas.clientWidth /
canvas.clientHeight;


camera.updateProjectionMatrix();


});

}
