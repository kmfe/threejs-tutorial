import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

import parrot from '../models/Parrot.glb'
import flamingo from '../models/Flamingo.glb'
import stork from '../models/Stork.glb'
import mi from '../models/mi.glb'
import huo from '../models/test-2.glb'

import miTf from '../models/mi.gltf'
import test from '../models/fbx/test.fbx'
import floor from '../models/gltf/Floor.gltf'
import xiaomi from '../models/xiaomi/XiaoMi.gltf'

const {
  Scene,
  WebGLRenderer,
  PerspectiveCamera
} = THREE

const mixers = []
const clock = new THREE.Clock()

class Tutorial {
  constructor () {
    this.step = 0
    this.SCREEN_WIDTH = window.innerWidth
    this.SCREEN_HEIGHT = window.innerHeight
    this.scene = new Scene()
    this.scene.background = new THREE.Color('skyblue')
    
    this.initCamera()
    this.initMesh()
    this.initLight()
    this.initRenderer()
    this.addOrbitControl()
    this.addHelper()
    this.loadModels()
    this.animate()
  }
  
  initCamera () {
    let aspect = this.SCREEN_WIDTH / this.SCREEN_HEIGHT
    this.camera = new PerspectiveCamera(60, aspect, 0.1, 100)
    this.camera.position.set(-5, 5, 7)
    this.camera.target = new THREE.Vector3(0, -1, 0)
  }
  
  initMesh () {
    const createMaterials = () => {
      const body = new THREE.MeshStandardMaterial({
        color: 0xff3333,
        flatShading: true
      })
      body.color.convertSRGBToLinear()
      
      const detail = new THREE.MeshStandardMaterial({
        color: 0x333333,
        flatShading: true
      })
      detail.color.convertSRGBToLinear()
      return {
        body,
        detail
      }
    }
    
    const createGeometries = () => {
      const nose = new THREE.CylinderBufferGeometry(0.75, 0.75, 5, 12)
      const cabin = new THREE.BoxBufferGeometry(2, 2.25, 1.5)
      const chimney = new THREE.CylinderBufferGeometry(0.3, 0.1, 0.5)
      const wheel = new THREE.CylinderBufferGeometry(0.4, 0.4, 1.75, 16)
      
      wheel.rotateX(Math.PI / 2)
      return {
        nose,
        cabin,
        chimney,
        wheel
      }
    }
    
    const createMeshes = () => {
      const train = new THREE.Group()
      this.scene.add(train)
      
      const materials = createMaterials()
      const geometries = createGeometries()
      
      const nose = new THREE.Mesh(geometries.nose, materials.body)
      nose.rotation.z = Math.PI / 2
      nose.rotation.x = -1
      
      const cabin = new THREE.Mesh(geometries.cabin, materials.body)
      cabin.position.set(1.5, 0.4, 0)
      
      const chimney = new THREE.Mesh(geometries.chimney, materials.detail)
      chimney.position.set(-2, 0.9, 0)
      
      const smallWheelRear = new THREE.Mesh(geometries.wheel, materials.detail)
      smallWheelRear.position.set(0, -0.5, 0)
      
      const smallWheelCenter = smallWheelRear.clone()
      smallWheelCenter.position.x = -1
      
      const smallWheelFront = smallWheelRear.clone()
      smallWheelFront.position.x = -2
      
      const bigWheel = smallWheelCenter.clone()
      bigWheel.scale.set(2, 2, 1.25)
      bigWheel.position.set(1.5, -0.1, 0)
      
      train.add(
        nose,
        cabin,
        chimney,
        
        smallWheelCenter,
        smallWheelFront,
        smallWheelRear,
        bigWheel
      )
      train.rotateY(Math.PI / 2)
    }
    
    createMeshes()
  }
  
  initRenderer () {
    let container = document.getElementById('container')
    this.renderer = new WebGLRenderer({
      logarithmicDepthBuffer: true,
      antialias: true
    })
    this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    
    this.renderer.sortObjects = false
    this.renderer.autoClear = false
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
  
  updateMesh () {
    this.step += 0.01
    this.control.update()
  }
  
  render () {
    window.onresize = () => {
      this.SCREEN_WIDTH = window.innerWidth
      this.SCREEN_HEIGHT = window.innerHeight
      this.camera.aspect = this.SCREEN_WIDTH / this.SCREEN_HEIGHT
      this.camera.updateProjectionMatrix()
      this.renderer && this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT)
    }
    this.camera.lookAt(this.camera.target)
    this.renderer.clear()
    this.renderer.render(this.scene, this.camera)
  }
  
  animate () {
    this.renderer.setAnimationLoop(() => {
      this.updateMesh()
      this.render()
      const delta = clock.getDelta()
      for (const mixer of mixers) {
        mixer.update(delta)
      }
    })
  }
  
  addHelper () {
    const axesHelper = new THREE.AxesHelper(10)
    this.scene.add(axesHelper)
    
    const cameraHelper = new THREE.CameraHelper(this.camera)
    // this.scene.add(cameraHelper)
    
    let size = 100
    let divisions = 100
    const gridHelper = new THREE.GridHelper(size, divisions)
    this.scene.add(gridHelper)
  }
  
  addOrbitControl () {
    this.control = new OrbitControls(this.camera, this.renderer.domElement)
    this.control.enabled = true
  }
  
  loadModels () {
    const loader = new GLTFLoader()
    const onLoad = (gltf, position) => {
      console.log(gltf, 'xx')
      if (gltf.scene.children.length > 1) {
        gltf.scene.children.forEach(child => {
          this.scene.add(child)
        })
      } else {
        const model = gltf.scene.children[0]
        model.position.copy(position)
        
        if (gltf.animations.length) {
          const animation = gltf.animations[0]
          const mixer = new THREE.AnimationMixer(model)
          mixers.push(mixer)
          
          const action = mixer.clipAction(animation)
          action.play()
        }
        
        this.scene.add(model)
      }
    }
    const onProgress = () => {}
    const onError = (e) => { console.log(e) }
    const parrotPosition = new THREE.Vector3(0, 3, 2.5)
    const flamingoPosition = new THREE.Vector3(7, 4, -10)
    const storkPosition = new THREE.Vector3(0, 2, -10)
    const floorPosition = new THREE.Vector3(0, 0, 10)
    
    loader.load(parrot, gltf => onLoad(gltf, parrotPosition), onProgress, onError)
    loader.load(flamingo, gltf => onLoad(gltf, flamingoPosition), onProgress, onError)
    loader.load(stork, gltf => onLoad(gltf, storkPosition), onProgress, onError)
    loader.load(huo, gltf => onLoad(gltf, storkPosition), onProgress, onError)
    
    // loader.load(mi, gltf => onLoad(gltf, floorPosition), onProgress, onError)
    
    // 新增fbx 模型
    // const fbxLoader = new FBXLoader()
    // const fbxLoad = (object) => {
    //   // const mixer = new THREE.AnimationMixer( object );
    //
    //   // var action = mixer.clipAction( object.animations[ 0 ] );
    //   // action.play();
    //   console.log(object)
    //   object.traverse(function (child) {
    //     // if (child.isMesh) {
    //     //   child.castShadow = true
    //     //   child.receiveShadow = true
    //     // }
    //   })
    //   object.scale.set(0.02, 0.02, 0.02)
    //   this.scene.add(object)
    // }
    // fbxLoader.load(test, fbx => fbxLoad(fbx, parrotPosition), onProgress, onError)
  }
}

new

Tutorial()
