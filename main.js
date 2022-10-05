import './style.css'

import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';
import { uselessWebButton } from './random_site';

//if site is reloaded while inspector is open, page wont scale properly

// how to publish https://www.youtube.com/watch?v=yo2bMGnIKE8
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1 , 1000)

const loader = new GLTFLoader()
const tgaloader = new TGALoader()


const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector("#bg"),
  powerPreference: "high-performance"
  
  

})

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap


renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize( window.innerWidth, window.innerHeight)

camera.position.setZ(50); // remove this if you are animating camera, it will jump to next locatation on scroll or click and wont be smooth


window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  
  // camera.aspect = window.innerWidth / window.innerHeight // comment out to scale to fit
  camera.updateProjectionMatrix()
  // renderer.render()
})






const spotlight = new THREE.SpotLight(0xffffff, 1)
spotlight.position.set(0, 0, 60)
spotlight.castShadow = false


const SpotlightHelper = new THREE.SpotLightHelper(spotlight, 1)

const gridhelper = new THREE.GridHelper(50, 50)

scene.add(spotlight)
// spotlight.shadow.mapSize.width = 512
// spotlight.shadow.mapSize.height = 512
// spotlight.shadow.camera.near = 0.5
// spotlight.shadow.camera.far = 500



function addstars() {
  const RandomRadius = THREE.MathUtils.randFloat(0.1, 0.4)

  const StarGeometry = new THREE.SphereGeometry(RandomRadius)
  const StarMaterial = new THREE.MeshStandardMaterial({color: 0xffffff})
  const star = new THREE.Mesh(StarGeometry, StarMaterial)
  const [x, y] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(400))
  const [z] = Array(3).fill().map(() => THREE.MathUtils.randFloat(-100, 5))
  // if (z > 29){
  //   console.log(z)
  // }

    star.position.set(x, y, z)
  scene.add(star)

}

Array(4000).fill().forEach(addstars)

// https://sketchfab.com/3d-models/donut-20-8d6cac74abfc4b408ec86c37661fa5a6
var donut

loader.load("donut_2.0.glb", function (gltf){
  const model = gltf.scene
  model.position.set(-18, 9, 35)
  model.scale.set(10,10,10)
  scene.add(model)
  
  donut = model.children[0]
  
  gltf.animations ; // Array<THREE.AnimationClip>
  gltf.scene; // THREE.Group
  gltf.scenes; // Array<THREE.Group>
  gltf.cameras; // Array<THREE.Camera>
  gltf.asset; // Object
  // callrender()
  
  
}, function(xhr){
  // console.log((xhr.loaded / xhr.total * 100) + "% loaded")
}, function (error){
  console.log("error, ABORT NOW. ARRRRGH")
}
)




//https://sketchfab.com/3d-models/high-poly-x-wing-fighter-f2170d4a3ee04e8588c0ad29d4f91767
var xwing
var xwing_anim
loader.load("xwing_drift_invert.blend2.glb", function (glb){
  const blend = glb.scene
  blend.position.set(0,0,25)
  blend.scale.set(2.5, 2.5, 1)


  scene.add(blend)
  xwing_anim = new THREE.AnimationMixer(blend)
  const clips = glb.animations

  function removexwing(){
    scene.remove(blend)
  }
  
  clips.forEach(function(clip){
    
    const action = xwing_anim.clipAction(clip)
    action.setLoop(THREE.LoopOnce)
    
    action.play()
    xwing_anim.addEventListener('finished', removexwing)

  })

}, function(xhr){
  console.log((xhr.loaded / xhr.total * 100) + "% loaded")
},function (error){
  console.log("xwing error")
}
)

var death_star
loader.load("death_star_ii.glb", function (dt){
  
  const dt_model = dt.scene
  dt_model.position.set(25, 10, 6)
  dt_model.scale.set(2, 2, 2)
  dt_model.rotation.y = -0.5
  scene.add(dt_model)

  death_star = dt_model.children[0]

  dt.animations ; // Array<THREE.AnimationClip>
  dt.scene; // THREE.Group
  dt.scenes; // Array<THREE.Group>
  dt.cameras; // Array<THREE.Camera>
  dt.asset; // Object
  // callrender()
  console.log("dt")
  
}, function(xhr){
  // console.log((xhr.loaded / xhr.total * 100) + "% loaded")
}, function (error){
  console.log("error, ABORT NOW. ARRRRGH, death star")
}
)



//endor
const endor_texture = new THREE.TextureLoader().load("endor/Endor.jpg")
const endor_normal = new THREE.TextureLoader().load("endor/Endor01.jpg")
const endor_opacity = new THREE.TextureLoader().load("endor/Opacity.jpg")
const endor_specular = new THREE.TextureLoader().load("endor/EndorSpect.jpg")

const endor = new THREE.Mesh(
  new THREE.SphereGeometry(10, 20, 15),
  new THREE.MeshStandardMaterial({
    map: endor_texture,
    // normalMap: endor_normal,
    // opacity: endor_opacity,
    // aoMap:endor_specular
  })


)
endor.position.set(-45, -15, 6)
endor.scale.set(0.7, 0.7, 0.7)
scene.add(endor)
// const contols = new OrbitControls(camera, renderer.domElement)


//scroll animation
function moveCamera(){
  const t = document.body.getBoundingClientRect().top;


  // window.addEventListener('wheel', (a) => {
  //     let scrolldir = a.deltaY
  //     console.log(scrolldir)
  //     let rotateamount = scrolldir * 0.0002
  //     if (scrolldir < 0){
         
  //         death_star.rotation.z += 0.1;
  //     }
  //     else if (scrolldir > 0 ){
  //         death_star.rotation.z += -0.1;
  //     }
  // })



  camera.position.z = 50 + t * -0.005;
  camera.position.x = t * 0.002;
  camera.rotation.y = t * 0.00004;

 
}

document.body.onscroll = moveCamera
moveCamera()




const clock = new THREE.Clock()

function callrender() {
  requestAnimationFrame( callrender )

//updating objects might return errors on load, bc obj hasn't loaded in yet, as soon as done loading it'll go away

  xwing_anim.update(clock.getDelta())
  donut.rotation.x += 0.01
  donut.rotation.y += 0.005
  
  renderer.render(scene, camera)


  
  // contols.update()
}
console.log("Number of Triangles :", renderer.info.render.triangles);

renderer.setAnimationLoop(callrender)

document.getElementById("useless").onclick = function test() {
  window.open(uselessWebButton())
}


