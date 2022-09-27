import './style.css'

import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';





const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1 , 1000)

const loader = new GLTFLoader()


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
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  // renderer.render()
})



renderer.render(scene, camera)

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 , wireframe: false})
const torus = new THREE.Mesh(geometry, material)
torus.position.set(0,0,0)
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
  model.position.set(18, 9, 35)
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


var xwing
loader.load("xwing_drift_invert.blend.glb", function (glb){
  const blend = glb.scene
  blend.position.set(0,0,0)
  blend.scale.set(1,1,1)
  scene.add(blend)

  xwing = blend.children[0]
  console.log(xwing)

  // callrender()
}, function(xhr){
  console.log((xhr.loaded / xhr.total * 100) + "% loaded")
},function (error){
  console.log("xwing error")
}
)




// const contols = new OrbitControls(camera, renderer.domElement)


function callrender() {
  requestAnimationFrame( callrender )
  renderer.render(scene, camera)
  
  donut.rotation.y += 0.005
  donut.rotation.x += 0.005
  
  // contols.update()
}

callrender()