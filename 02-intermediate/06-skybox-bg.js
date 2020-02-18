import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import parrot from '../models/Parrot.glb'
import flamingo from '../models/Flamingo.glb'
import stork from '../models/Stork.glb'

import checker from '../models/checker.png'
import bg from '../assets/nbh.jpg'

const {
  Scene,
  WebGLRenderer,
  PerspectiveCamera
} = THREE

const mixers = []
const clock = new THREE.Clock()

class Tutorial {
  constructor () {
    this.SCREEN_WIDTH = window.innerWidth
    this.SCREEN_HEIGHT = window.innerHeight
    
    this.scene = new Scene()
    const loader = new THREE.TextureLoader()
    const bgTexture = loader.load(bg)
    
    // Set the repeat and offset properties of the background texture
    // to keep the image's aspect correct.
    // Note the image may not have loaded yet.
    
    const canvasAspect = this.SCREEN_WIDTH / this.SCREEN_HEIGHT
    const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1
    const aspect = imageAspect / canvasAspect
    
    bgTexture.offset.x = aspect > 1 ? (1 - 1 / aspect) / 2 : 0
    bgTexture.repeat.x = aspect > 1 ? 1 / aspect : 1
    
    bgTexture.offset.y = aspect > 1 ? 0 : (1 - aspect) / 2
    bgTexture.repeat.y = aspect > 1 ? 1 : aspect
    
    this.scene.background = bgTexture
    
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
    const planeSize = 40
    const loader = new THREE.TextureLoader()
    const texture = loader.load(checker)
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
    const mesh = new THREE.Mesh(planeGeo, planeMat)
    mesh.rotateX(-Math.PI / 2)
    this.scene.add(mesh)
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

new Tutorial()
