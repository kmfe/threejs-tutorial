import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import checker from '../models/checker.png'
import { GUI } from 'dat.gui'
import { PerspectiveCamera } from 'three'

/*
* THREE camera
* https://threejsfundamentals.org/threejs/lessons/threejs-cameras.html
* */

class MinMaxGUIHelper {
  constructor (obj, minProp, maxProp, minDif) {
    this.obj = obj
    this.minProp = minProp
    this.maxProp = maxProp
    this.minDif = minDif
  }
  
  get min () {
    return this.obj[this.minProp]
  }
  
  set min (v) {
    this.obj[this.minProp] = v
    this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif)
  }
  
  get max () {
    return this.obj[this.maxProp]
  }
  
  set max (v) {
    this.obj[this.maxProp] = v
    this.min = this.min
  }
}

function main () {
  const canvas = document.getElementById('c')
  const view1Elem = document.querySelector('#view1')
  const view2Elem = document.querySelector('#view2')
  
  const renderer = new THREE.WebGLRenderer({
    canvas,
    logarithmicDepthBuffer: true, // 允许更精确的显示，mobile 基本不支持
  })
  const fov = 45
  const aspect = 2
  const near = 5
  const far = 80
  
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(0, 10, 20)
  
  const cameraHelper = new THREE.CameraHelper(camera)
  
  const controls = new OrbitControls(camera, view1Elem)
  controls.target.set(0, 5, 0)
  controls.update()
  
  // 更新相机并增加gui 监控
  const cameraGui = new GUI()
  cameraGui.add(camera, 'fov', 1, 180)
  const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1)
  cameraGui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near')
  cameraGui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far')
  
  // 增加一个camera 和 control
  const camera2 = new PerspectiveCamera(60, 2, 0.1, 500)
  camera2.position.set(4, 10, 20)
  camera2.lookAt(0, 5, 0)
  
  const control2 = new OrbitControls(camera2, view2Elem)
  control2.target.set(0, 5, 0)
  control2.update()
  
  // 分屏
  function setScissorForElement (elem) {
    const canvasRect = canvas.getBoundingClientRect()
    const elemRect = elem.getBoundingClientRect()
    
    // compute a canvas relative rectangle
    const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left
    const left = Math.max(0, elemRect.left - canvasRect.left)
    const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top
    const top = Math.max(0, elemRect.top - canvasRect.top)
    
    const width = Math.min(canvasRect.width, right - left)
    const height = Math.min(canvasRect.height, bottom - top)
    
    // setup the scissor to only render to that part of canvas
    const positiveYUpBottom = canvasRect.height - bottom
    renderer.setScissor(left, positiveYUpBottom, width, height)
    renderer.setViewport(left, positiveYUpBottom, width, height)
    
    // return the aspect
    return width / height
  }
  
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#000000')
  scene.add(cameraHelper)
  
  function updateCamera () {
    camera.updateProjectionMatrix()
  }
  
  // pointLight
  const addPointLight = (needGui = false) => {
    const color = 0xFFFFFF
    const intensity = 1
    const light = new THREE.PointLight(color, intensity)
    
    light.position.set(0, 10, 0)
    scene.add(light)
    
    const helper = new THREE.PointLightHelper(light)
    scene.add(helper)
  }
  
  addPointLight()
  
  // 增加个地板
  const loader = new THREE.TextureLoader()
  const planeSize = 40
  loader.load(checker, asset => {
    // 加载texture 成功之后
    asset.wrapS = THREE.RepeatWrapping
    asset.wrapT = THREE.RepeatWrapping
    asset.magFilter = THREE.NearestFilter
    const repeats = planeSize / 2
    asset.repeat.set(repeats, repeats)
    
    const plane = new THREE.BoxBufferGeometry(20, 20, 0.5)
    const planeMaterial = new THREE.MeshPhongMaterial({
      map: asset,
      side: THREE.DoubleSide
    })
    
    const planeMesh = new THREE.Mesh(plane, planeMaterial)
    planeMesh.rotateX(THREE.Math.degToRad(90))
    planeMesh.position.set(0, 0, -2)
    scene.add(planeMesh)
  })
  
  // 增加个球面
  const sphereGeo = new THREE.SphereBufferGeometry(2, 40, 40)
  const sphereMat = new THREE.MeshPhongMaterial({
    color: '#CA8'
  })
  const sphere = new THREE.Mesh(sphereGeo, sphereMat)
  sphere.position.set(0, 2, 5)
  scene.add(sphere)
  
  // 适配屏幕缩放
  function resizeRendererToDisplay (renderer) {
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      renderer.setSize(width, height, false)
    }
    return needResize
  }
  
  // 开始渲染
  function render (time) {
    time *= 0.001
    resizeRendererToDisplay(renderer)
    
    // if (resizeRendererToDisplay(renderer)) {
    //   const canvas = renderer.domElement
    //   camera.aspect = canvas.clientWidth / canvas.clientHeight
    //   camera.updateProjectionMatrix()
    // }
    
    renderer.setScissorTest(true)
    
    {
      // render original view
      const aspect = setScissorForElement(view1Elem)
      camera.aspect = aspect
      camera.updateProjectionMatrix()
      cameraHelper.update()
      
      cameraHelper.visible = false
      scene.background.set(0X000000)
      renderer.render(scene, camera)
    }
    
    {
      const aspect = setScissorForElement(view2Elem)
      // render from the 2nd camera
      camera2.aspect = aspect
      camera2.updateProjectionMatrix()
      cameraHelper.visible = true
      
      scene.background.set(0x000040)
      
      renderer.render(scene, camera2)
    }
    requestAnimationFrame(render)
  }
  
  requestAnimationFrame(render)
}

window.onload = main
