import './style.css'

import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';




const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1 , 1000)

const loader = new GLTFLoader()
const tgaloader = new TGALoader()


const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector("#bg")

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



renderer.render(scene, camera)

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 , wireframe: false})
const torus = new THREE.Mesh(geometry, material)
torus.position.set(0,0,2)
torus.castShadow = true
torus.receiveShadow = true
scene.add(torus)

const spotlight = new THREE.SpotLight(0xffffff, 1)
spotlight.position.set(0, 0, 60)
spotlight.castShadow = false


const SpotlightHelper = new THREE.SpotLightHelper(spotlight, 1)

const gridhelper = new THREE.GridHelper(50, 50)

scene.add(spotlight, SpotlightHelper, gridhelper)
// spotlight.shadow.mapSize.width = 512
// spotlight.shadow.mapSize.height = 512
// spotlight.shadow.camera.near = 0.5
// spotlight.shadow.camera.far = 500



function addstars() {
  const RandomRadius = THREE.MathUtils.randFloat(0.2, 0.25)

  const StarGeometry = new THREE.SphereGeometry(RandomRadius)
  const StarMaterial = new THREE.MeshStandardMaterial({color: 0xffffff})
  const star = new THREE.Mesh(StarGeometry, StarMaterial)
  const [x, y] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(300))
  const [z] = Array(3).fill().map(() => THREE.MathUtils.randFloat(-100, 30))
  // if (z > 29){
  //   console.log(z)
  // }

    star.position.set(x, y, z)
  scene.add(star)

}

Array(2000).fill().forEach(addstars)

// https://sketchfab.com/3d-models/donut-20-8d6cac74abfc4b408ec86c37661fa5a6
var donut

loader.load("donut_2.0.glb", function (gltf){
  const model = gltf.scene
  model.position.set(-18, 9, 35)
  model.scale.set(5,5,5)
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

  clips.forEach(function(clip){
    const action = xwing_anim.clipAction(clip)

    action.play()
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
  dt_model.position.set(25, 10, 0)
  dt_model.scale.set(2, 2, 3)
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

//death star


  // xwing = blend.children[0]
  // console.log(xwing)

  // callrender()

// const contols = new OrbitControls(camera, renderer.domElement)





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
renderer.setAnimationLoop(callrender)




//scroll animation
function moveCamera(){
  const t = document.body.getBoundingClientRect().top;


  window.addEventListener('wheel', (a) => {
      let scrolldir = a.deltaY
      // let rotateamount = scrolldir * 0.00002
      if (scrolldir < 0){
         
          death_star.rotation.z += 0.001;
      }
      else if (scrolldir > 0 ){
          death_star.rotation.z += -0.001;
      }
  })


  //camera.position.z = t * -0.01;
  //camera.position.x = t * -0.00001;
  //camera.rotation.y = t * -0.00001;
 
}

document.body.onscroll = moveCamera
moveCamera()

