import './style.css'

import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';
import { uselessWebButton } from './random_site';
import { CameraHelper, Vector2 } from 'three';

//if site is reloaded while inspector is open, page wont scale properly

// how to publish https://www.youtube.com/watch?v=yo2bMGnIKE8
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1 , 1000)
const loader = new GLTFLoader()



const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector("#bg"),
  // powerPreference: "high-performance"
  precision: "lowp"


})

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap


renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize( window.innerWidth, window.innerHeight)

camera.position.setZ(50); // remove this if you are animating camera, it will jump to next locatation on scroll or click and wont be smooth


window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  
  camera.aspect = window.innerWidth / window.innerHeight // comment out to scale to fit
  camera.updateProjectionMatrix()
  renderer.render()
})






const spotlight = new THREE.SpotLight(0xffffff, 1)
spotlight.position.set(0, 0, 60)
spotlight.castShadow = false


// const SpotlightHelper = new THREE.SpotLightHelper(spotlight, 1)

// const gridhelper = new THREE.GridHelper(50, 50)

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
// https://sketchfab.com/3d-models/interesting-donut-e2395a7a4a19416b93b23f62f97f7ae4#download
var donut

loader.load("interesting_donut.glb", function (gltf){
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
  console.log("error, ABORT NOW. ARRRRGH, donut failed")
}
)




//https://sketchfab.com/3d-models/high-poly-x-wing-fighter-f2170d4a3ee04e8588c0ad29d4f91767
var xwing
var xwing_anim
var xwing_function = loader.load("xwing_drift_invert.blend2.glb", function (glb){
  const blend = glb.scene
  blend.position.set(0,0,25)
  blend.scale.set(2.5, 2.5, 1)
  

  scene.add(blend)
  xwing_anim = new THREE.AnimationMixer(blend)
  const clips = glb.animations
  console.log(xwing_anim.loop = false)

  function removexwing(){
    scene.remove(blend)
  }
  
  
  
  
  clips.forEach(function(clip){
    
    const action = xwing_anim.clipAction(clip)
    // action.startAt(2)
    // action.syncWith()
    document.getElementById("play").addEventListener("click", () => {
      scene.add(blend)
      action.setLoop(THREE.LoopOnce)
      action.play().reset()
      xwing_anim.addEventListener('finished', removexwing)

    })

    window.addEventListener("scroll", () => {
      action.play()
      action.setLoop(THREE.LoopOnce)

      xwing_anim.addEventListener('finished', removexwing)
    })
    
    
    
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

  // callrender()
  
}, function(xhr){
  // console.log((xhr.loaded / xhr.total * 100) + "% loaded")
}, function (error){
  console.log("error, ABORT NOW. ARRRRGH, death star")
}
)



//endor
const endor_texture = new THREE.TextureLoader().load("endor/Endor_squoosh.jpg")
// const endor_normal = new THREE.TextureLoader().load("endor/Endor01.jpg")
// const endor_opacity = new THREE.TextureLoader().load("endor/Opacity.jpg")
// const endor_specular = new THREE.TextureLoader().load("endor/EndorSpect.jpg")

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

//orbitcontrols
const contols = new OrbitControls(camera, renderer.domElement)

document.getElementById("2d_img").addEventListener("click", orbit)
var position
var o = false
var i = true
function orbit(){
  if (i == true){
    document.getElementById("main").style.display = "none"
    document.getElementById("2d_img").src = "threejs_logo/icon_upscale_squoosh.webp"
    document.getElementById("help").style.display = "block"
    i = false
  }
  else {
    document.getElementById("main").style.display = "block"
    document.getElementById("2d_img").src = "threejs_logo/cube_button.webp"
    document.getElementById("help").style.display = "none"

    var vector = new THREE.Vector3()
    position = camera.getWorldPosition(vector)
    console.log("asd", position)
    console.log("fsa", camera.position)
    i = true
    o = true
    console.log(camera.getEffectiveFOV())
  }

}

document.getElementById("help").addEventListener("click", () => {


  document.getElementById("help_overlay").classList.add("fade")
  var fade_interval = setInterval(() => {
    document.getElementById("help_overlay").classList.remove("fade")
    clearInterval(fade_interval)
  }, 3000)

  // document.getElementById("help_overlay").style.display = "block"
  // var i = setInterval(() => {
  //   document.getElementById("help_overlay").classList.add("fade")
  // }, 0)
  
  
  // var fade_interval = setInterval(() => {
    
  //   document.getElementById("help_overlay").classList.remove("fade")
  //   clearInterval(i)
  // }, 3000)
  
  // var a = setInterval(() => {
  //       document.getElementById("help_overlay").style.display = "none"
  //       clearInterval(a)
  //       clearInterval(fade_interval)
  //       clearInterval(fade_in)
     
  // }, 3500)

})

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
        
        // camera.position.x = position.x + t * 0.002;
        // camera.rotation.y = position.y + t * 0.00004;
        // camera.position.z = position.z + t * -0.005;
    // camera.position.x = t * 0.002;
    // camera.position.y = t * 0.002;
    // camera.position.z = 50 + t * -0.005;

    // var oldscroll = window.scrollY
    // var direction
    // window.onscroll = function(e){
    //   if (oldscroll < window.scrollY){
    //     direction = false // down
    //   }else {
    //     direction = true // up
    //   }
    //   console.log(direction)
    //   oldscroll = window.scrollY
    // }

    

    // camera.position.z = 50 + t * -0.005;
    // if (direction){
    //   camera.position.x = camera.position.x + t * 0.002;
    //   camera.rotation.y = t * -0.002;
    //   console.log(direction)

    // }
    // else if (direction == false){
    //   camera.position.x = camera.position.x + t * -0.002;
    //   camera.rotation.y = t * -0.002;
    //   console.log(direction)

    // }

    if (o == false){
      camera.position.z = 50 + t * -0.005;
      camera.position.x = t * 0.002;
      camera.rotation.y = t * -0.002;
      console.log(t, "/n", camera.getEffectiveFOV(), "/n", 75 + t * 0.05)

    }else if (o != false){

      return
    }

      

 
      }


      document.body.onscroll = moveCamera
      moveCamera()
      
      
      
      
      const clock = new THREE.Clock()
      
      function animate() {
        requestAnimationFrame( animate )
        
        //updating objects might return errors on load, bc obj hasn't loaded in yet, as soon as done loading it'll go away
        
        xwing_anim.update(clock.getDelta())
        donut.rotation.x += 0.01
        donut.rotation.y += 0.005
        
        
        contols.update()
        
        render()
      }
      
function render(){
  renderer.render(scene, camera)
}
// console.log("Number of Triangles :", renderer.info.render.triangles);
      
      renderer.setAnimationLoop(animate)
      




document.getElementById("useless").onclick = () => {
  window.open(uselessWebButton())
}






