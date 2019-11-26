import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import parrot from '../models/Parrot.glb'
import flamingo from '../models/Flamingo.glb'
import stork from '../models/Stork.glb'

import checker from '../models/checker.png'

const {
  Scene,
  WebGLRenderer,
  PerspectiveCamera
} = THREE

const mixers = []
const clock = new THREE.Clock()

const utils = {
  dumpObject (obj, lines = [], isLast = true, prefix = '') {
    const localPrefix = isLast ? '└─' : '├─'
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`)
    const newPrefix = prefix + (isLast ? '  ' : '│ ')
    const lastNdx = obj.children.length - 1
    obj.children.forEach((child, ndx) => {
      const isLast = ndx === lastNdx
      this.dumpObject(child, lines, isLast, newPrefix)
    })
    return lines
  }
}

class Tutorial {
  constructor () {
    this.SCREEN_WIDTH = window.innerWidth
    this.SCREEN_HEIGHT = window.innerHeight
    this.scene = new Scene()
    this.scene.background = new THREE.Color('skyblue')
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
    this.camera.position.set(0, 10, 20)
    
    this.control = new OrbitControls(this.camera, this.renderer.domElement)
    this.control.target.set(0, 0, 0)
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
    
    // 计算camera frame 模型的区域
    function frameArea (sizeToFitOnScreen, boxSize, boxCenter, camera) {
      const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5
      const halfFovY = THREE.Math.degToRad(camera.fov * .5)
      const distance = halfSizeToFitOnScreen / Math.tan(halfFovY)
      // compute a unit vector that points in the direction the camera is now
      // in the xz plane from the center of the box
      const direction = (new THREE.Vector3())
      .subVectors(camera.position, boxCenter)
      .multiply(new THREE.Vector3(1, 0, 1))
      .normalize()
      
      // move the camera to a position distance units way from the center
      // in whatever direction the camera was from the center already
      camera.position.copy(direction.multiplyScalar(distance).add(boxCenter))
      
      // pick some near and far values for the frustum that
      // will contain the box.
      camera.near = boxSize / 100
      camera.far = boxSize * 100
      
      camera.updateProjectionMatrix()
      
      // point the camera to look at the center of the box
      camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z)
    }
    
    // 增加地面模型
    const gltfLoader = new GLTFLoader()
    let cars
    gltfLoader.load('https://res.eschervr.com/vrPlayer/scene/scene.gltf',
      gltf => {
        const root = gltf.scene
        this.scene.add(root)
        //console.log(utils.dumpObject(root))
        this.cars = root.getObjectByName('Cars')
        // console.log(this.cars, 'this.cars')
        // const fixes = [
        //   {prefix: 'Car_08', rot: [Math.PI * 0.5, 0, Math.PI + 0.5]},
        //   {prefix: 'Car_03', rot: [0, Math.PI, 0]},
        //   {prefix: 'Car_04', rot: [0, Math.PI, 0]}
        // ]
        
        // getSize() 获取物体的大小
        // getCenter 获取物体的中心点
        const box = new THREE.Box3().setFromObject(root)
        const boxSize = this.boxSize = box.getSize(new THREE.Vector3()).length()
        const boxCenter = this.boxCenter = box.getCenter(new THREE.Vector3())
        
        // 物体实在太大，设置camera能看到该box
        frameArea(boxSize * 0.5, boxSize, boxCenter, this.camera)
        
        this.control.maxDistance = boxSize * 10
        this.control.target.copy(boxCenter)
        this.control.update()
      },
      (e) => {
        console.log(e)
      },
      e => {
        console.error(e)
      })
  }
  
  initRenderer () {
    let container = document.getElementById('container')
    this.renderer = new WebGLRenderer({
      logarithmicDepthBuffer: true,
      antialias: true
    })
    this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.physicallyCorrectLights = true
    container.appendChild(this.renderer.domElement)
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
  
  render (time) {
    window.onresize = () => {
      this.SCREEN_WIDTH = window.innerWidth
      this.SCREEN_HEIGHT = window.innerHeight
      this.camera.aspect = this.SCREEN_WIDTH / this.SCREEN_HEIGHT
      this.camera.updateProjectionMatrix()
      this.renderer && this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT)
    }
    // time *= 0.001
    // if (this.cars) {
    //   for (let car of this.cars.children) {
    //     car.rotation.y = time
    //   }
    // }
    this.renderer.clear()
    this.renderer.render(this.scene, this.camera)
  }
  
  animate () {
    this.renderer.setAnimationLoop(time => {
      // this.updateMesh()
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
