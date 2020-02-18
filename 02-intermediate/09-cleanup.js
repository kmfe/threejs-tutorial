import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import parrot from '../models/Parrot.glb'
import flamingo from '../models/Flamingo.glb'
import stork from '../models/Stork.glb'

import checker from '../models/checker.png'
import nx from '../assets/skybox/nx.jpg'
import ny from '../assets/skybox/ny.jpg'
import nz from '../assets/skybox/nz.jpg'
import px from '../assets/skybox/px.jpg'
import py from '../assets/skybox/py.jpg'
import pz from '../assets/skybox/pz.jpg'

/*
* three 内存优化文章
* https://threejsfundamentals.org/threejs/lessons/threejs-cleanup.html
* */


const {
  Scene,
  WebGLRenderer,
  PerspectiveCamera
} = THREE

const mixers = []
const clock = new THREE.Clock()

class ResourceTracker {
  constructor () {
    this.resources = new Set()
  }
  
  track (resource) {
    console.log(resource, resource.dispose, resource instanceof THREE.Object3D)
    if (resource.dispose || resource instanceof THREE.Object3D) {
      this.resources.add(resource)
    }
    return resource
  }
  
  untract (resource) {
    this.resources.delete(resource)
  }
  
  dispose () {
    for (const resource of this.resources) {
      if (resource instanceof THREE.Object3D) {
        if (resource.parent) {
          resource.parent.remove(resource)
        }
      }
      if (resource.dispose) {
        resource.dispose()
      }
    }
    this.resources.clear()
  }
}

class Tutorial {
  constructor () {
    this.SCREEN_WIDTH = window.innerWidth
    this.SCREEN_HEIGHT = window.innerHeight
    this.scene = new Scene()
    
    this.scene.background = new THREE.Color('#000000')
    
    this.initRenderer()
    this.initCamera()
    this.initMesh()
    this.initLight()
    
    this.addHelper()
    this.loadModels()
    this.animate()
  }
  
  initCamera () {
    let aspect = this.SCREEN_WIDTH / this.SCREEN_HEIGHT
    console.log(aspect, 'aspect')
    this.camera = new PerspectiveCamera(45, aspect, 0.1, 100)
    this.camera.position.set(0, 20, 60)
    
    this.control = new OrbitControls(this.camera, this.renderer.domElement)
    this.control.target.set(0, 0, 0)
    this.control.maxDistance = 60
    this.control.update()
  }
  
  initMesh () {
    // 添加内存监控class
    const resTracker = new ResourceTracker()
    const track = resTracker.track.bind(resTracker)
    
    const planeSize = 40
    const loader = new THREE.TextureLoader()
    const texture = track(loader.load(checker))
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.magFilter = THREE.NearestFilter
    const repeats = planeSize / 2
    texture.repeat.set(repeats, repeats)
    
    const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize)
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide
    })
    const mesh = track(new THREE.Mesh(planeGeo, planeMat))
    mesh.rotateX(-Math.PI / 2)
    this.scene.add(mesh)
    const self = this
    
    function makeInstance (geometry, color, x, y, z) {
      let i = 0;
      [THREE.BackSide, THREE.FrontSide].forEach(side => {
        const material = new THREE.MeshPhongMaterial({
          color,
          opacity: 0.5,
          transparent: true,
          side
        })
        const cubeMesh = new THREE.Mesh(geometry, material)
        cubeMesh.name = 'makeInstance' + i
        const cube = track(cubeMesh)
        self.scene.add(cube)
        
        cube.position.set(x, y, z)
        i++
      })
    }
    
    function hls (h, l, s) {
      return (new THREE.Color()).setHSL(h, l, s)
    }
    
    const d = 10
    const y = 4
    const boxWidth = 4
    const boxHeight = 4
    const boxDepth = 4
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)
    
    makeInstance(geometry, hls(0 / 8, 1, .5), -d, y, -d)
    makeInstance(geometry, hls(1 / 8, 1, .5), -d, d, -d)
    makeInstance(geometry, hls(2 / 8, 1, .5), d, y, -d)
    makeInstance(geometry, hls(3 / 8, 1, .5), d, d, -d)
    makeInstance(geometry, hls(4 / 8, 1, .5), -d, y, d)
    makeInstance(geometry, hls(5 / 8, 1, .5), d, y, d)
    makeInstance(geometry, hls(6 / 8, 1, .5), -d, d, d)
    makeInstance(geometry, hls(7 / 8, 1, .5), d, d, d)
    return resTracker
  }
  
  initRenderer () {
    let container = document.getElementById('container')
    this.renderer = new WebGLRenderer({
      canvas: container,
      logarithmicDepthBuffer: true,
      antialias: true,
      alpha: true
    })
    this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.physicallyCorrectLights = true
    // container.appendChild(this.renderer.domElement)
  }
  
  initLight () {
    // 默认光照射的target为(0,0,0)
    const light = new THREE.DirectionalLight(0xffffff, 5.0)
    light.position.set(0, 5, 10)
    this.scene.add(light)
    
    const helper = new THREE.DirectionalLightHelper(light, 8)
    this.scene.add(helper)
    
    // 增加环境光, 半球光
    const ambientLight = new THREE.HemisphereLight(
      0xddeeff, // bright sky color
      0x202020, // dim ground color
      4 // intensity
    )
    this.scene.add(ambientLight)
  }
  
  render () {
    window.onresize = () => {
      this.SCREEN_WIDTH = window.innerWidth
      this.SCREEN_HEIGHT = window.innerHeight
      this.camera.aspect = this.SCREEN_WIDTH / this.SCREEN_HEIGHT
      this.camera.updateProjectionMatrix()
      this.renderer && this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT)
    }
    this.renderer.clear()
    this.renderer.render(this.scene, this.camera)
  }
  
  animate () {
    this.renderer.setAnimationLoop(time => {
      this.render(time)
      const delta = clock.getDelta()
      for (const mixer of mixers) {
        mixer.update(delta)
      }
    })
  }
  
  addHelper () {
    const axesHelper = new THREE.AxesHelper(500)
    this.scene.add(axesHelper)
    
    const cameraHelper = new THREE.CameraHelper(this.camera)
    // this.scene.add(cameraHelper)
    
    let size = 100
    let divisions = 100
    const gridHelper = new THREE.GridHelper(size, divisions)
    // this.scene.add(gridHelper)
  }
  
  loadModels () {
    const loader = new GLTFLoader()
    const onLoad = (gltf, position) => {
      const model = gltf.scene.children[0]
      model.position.copy(position)
      model.scale.set(20, 20, 20)
      
      const animation = gltf.animations[0]
      const mixer = new THREE.AnimationMixer(model)
      mixers.push(mixer)
      
      const action = mixer.clipAction(animation)
      action.play()
      
      this.scene.add(model)
    }
    const onProgress = () => {}
    const onError = (e) => { console.log(e) }
    const parrotPosition = new THREE.Vector3(-300, 400, -250)
    const flamingoPosition = new THREE.Vector3(-320, 500, -310)
    const storkPosition = new THREE.Vector3(-420, 380, -380)
    
    loader.load(parrot, gltf => onLoad(gltf, parrotPosition), onProgress, onError)
    loader.load(flamingo, gltf => onLoad(gltf, flamingoPosition), onProgress, onError)
    loader.load(stork, gltf => onLoad(gltf, storkPosition), onProgress, onError)
  }
}

const tutorial = new Tutorial()

// 其他操作
// const dispose = document.querySelector('#dispose')
// dispose.addEventListener('click', () => {
//   resTracker.dispose()
//   console.log('清空所有试试')
// }, false)

// then let's write some code to add and remove things over time

function waitSeconds (seconds = 0) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}

async function process () {
  for (; ;) {
    const resTracker = tutorial.initMesh()
    await waitSeconds(2)
    resTracker.dispose()
    await waitSeconds(1)
  }
}

