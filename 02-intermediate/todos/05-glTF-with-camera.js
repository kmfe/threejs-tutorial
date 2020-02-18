import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import parrot from '../../models/Parrot.glb'
import flamingo from '../../models/Flamingo.glb'
import stork from '../../models/Stork.glb'

// three 相关
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
      const model = gltf.scene.children[0]
      model.position.copy(position)
      
      const animation = gltf.animations[0]
      const mixer = new THREE.AnimationMixer(model)
      mixers.push(mixer)
      
      const action = mixer.clipAction(animation)
      action.play()
      
      this.scene.add(model)
    }
    const onProgress = () => {}
    const onError = (e) => { console.log(e) }
    const parrotPosition = new THREE.Vector3(0, 3, 2.5)
    const flamingoPosition = new THREE.Vector3(7, 4, -10)
    const storkPosition = new THREE.Vector3(0, 2, -10)
    
    loader.load(parrot, gltf => onLoad(gltf, parrotPosition), onProgress, onError)
    loader.load(flamingo, gltf => onLoad(gltf, flamingoPosition), onProgress, onError)
    loader.load(stork, gltf => onLoad(gltf, storkPosition), onProgress, onError)
  }
}

/*
* constraints 的参数为 audio, video
* 可以强制设置video的尺寸
* video: {width: 1200, height: 200}
*
* 在移动设备上也可以设置摄像头
* video: {facingMode: 'user'}
* video: {facingMode: {exact: 'environment'}}
*
* 设置帧率：
* video: {frameRate: {ideal: 10, max: 15}}
*
* 异常类型：
* AbortError
* NotAllowedError
* NotFoundError
* NotReadableError
* OverConstrainedError
* SecurityError
* TypeError
* */

// let front = true
// let streaming = false
// let width = 320    // We will scale the photo width to this
// let height = 0
// let video = null
// let canvas = null
// let photo = null
//
// let constrains = {
//   audio: false,
//   video: {
//     width: window.innerWidth,
//     height: 200,
//     facingMode: front ? 'user' : 'environment'
//   }
// }
// const createCamera = () => {
//   navigator.mediaDevices.getUserMedia(constrains)
//   .then(stream => {
//     const video = document.createElement('video')
//     video.srcObject = stream
//     video.onloadedmetadata = function () {
//       video.play()
//     }
//     video.addEventListener('canplay', ev => {
//       if (!streaming) {
//         height = video.videoHeight / (video.videoWidth / width)
//       }
//     })
//     document.body.appendChild(video)
//   })
//   .catch(err => {
//     console.error(err.name + ':' + err.message)
//   })
// }
//
// createCamera()
//
// const clearPhoto = () => {
//   const context = canvas.getContext('2d')
//   context.fillStyle = '#aaa'
//   context.fillRect(0, 0, canvas.width, canvas.height)
//   const data = canvas.toDataURL('image/png')
//   photo.setAttribute('src', data)
// }
//
// const takePicture = () => {
//   const context = canvas.getContext('2d')
//   if (width && height) {
//     canvas.width = width
//     canvas.height = height
//     context.drawImage(video, 0, 0, width, height)
//
//     let data = canvas.toDataURL('image/png')
//     photo.setAttribute('src', data)
//   } else {
//     clearPhoto()
//   }
// }
//
// const createHandleBtns = () => {
//
//   const wrap = document.createElement('div')
//   document.body.appendChild(wrap)
//   wrap.style.cssText = `
//     position:absolute;
//     right: 20px;
//     top: 20px;
//     z-index: 999;
//   `
//   const oCameraPos = document.createElement('button')
//   oCameraPos.innerHTML = '切换摄像头'
//   wrap.appendChild(oCameraPos)
//   oCameraPos.addEventListener('click', () => {
//     front = !front
//   }, false)
//
//   const takePhotoBtn = document.createElement('button')
//   takePhotoBtn.innerHTML = '拍照'
//   wrap.appendChild(takePhotoBtn)
//   takePhotoBtn.addEventListener('click', takePicture, false)
// }
//
// createHandleBtns()

// take a picture
let width = window.innerWidth    // We will scale the photo width to this
let height = 0     // This will be computed based on the input stream

let streaming = false

let video = null
let canvas = null
let photo = null
let startbutton = null

function startUp () {
  video = document.getElementById('video')
  canvas = document.getElementById('canvas')
  photo = document.getElementById('photo')
  startbutton = document.getElementById('startbutton')
  navigator.mediaDevices.getUserMedia({
    video: {
      width,
      height: window.innerHeight
    },
    audio: false
  })
  .then(stream => {
    video.srcObject = stream
    video.play()
  })
  .catch(err => {
    console.log('An error occurred', err)
  })
  
  video.addEventListener('canplay', function (ev) {
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth / width)
      
      video.setAttribute('width', width)
      video.setAttribute('height', height)
      canvas.setAttribute('width', width)
      canvas.setAttribute('height', height)
      streaming = true
    }
  }, false)
  
  startbutton.addEventListener('click', function(ev){
    takepicture();
    ev.preventDefault();
  }, false);
}

function clearphoto() {
  let context = canvas.getContext('2d');
  context.fillStyle = "#AAA";
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  let data = canvas.toDataURL('image/png');
  photo.setAttribute('src', data);
}

function takepicture() {
  let context = canvas.getContext('2d');
  if (width && height) {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);
    
    let data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  } else {
    clearphoto();
  }
}

startUp()
