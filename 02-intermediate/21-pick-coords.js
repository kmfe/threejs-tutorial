import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import TWEEN from '@tweenjs/tween.js'
import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  BoxBufferGeometry,
  MeshPhongMaterial,
  Mesh
} from 'three'
import checker from '../models/checker.png'

// 随意增加一些操纵

function main () {
  
  const canvas = document.getElementById('c')
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    logarithmicDepthBuffer: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  
  const scene = new Scene()
  const fov = 60
  const far = 400
  const near = 0.01
  const aspect = window.innerWidth / window.innerHeight
  const camera = new PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(0, 30, 20)
  
  const cameraHelper = new THREE.CameraHelper(camera)
  scene.add(cameraHelper)
  
  const controls = new OrbitControls(camera, canvas)
  // controls.target.set(0, 5, 0)
  controls.update()
  
  const light = new THREE.AmbientLight('#ffffff', 1)
  
  scene.add(light)
  
  // 添加辅助坐标
  const axes = new THREE.AxesHelper(100)
  scene.add(axes)
  
  // --- start code
  let color = '#ff6600'
  
  /*
  * color 的多种定义方法
  * material.color.set(0x00ffff)
  * material.color.set(cssString) //purple, '#F60'等方式
  * material.color.set(someColor) // THREE.Color
  * material.color.setHSL(h, s, l)
  * material.color.setRGB(r, g, b)
  * */
  
  // --- end code
  const resizeHandler = () => {
    window.onresize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      renderer.setSize(width, height, true)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
  }
  
  /*
  * MeshPhongMaterial 不受光照影响
  * MeshLambertMaterial 只计算最高点的光
  * MeshPhongMaterial 计算每像素的光照及镜面高光
  *
  * shininess 设置镜面高光，默认为30
  * emissive
  * material.needsUpdate = true 用于更新material
  * flatShading = true
  * */
  
  const boxGeo = new BoxBufferGeometry(5, 5, 5)
  const boxMat = new MeshPhongMaterial({
    color
  })
  const mesh = new Mesh(boxGeo, boxMat)
  // mesh.castShadow = true
  mesh.position.y = 5
  scene.add(mesh)
  
  let rndColor = () => {
    return `rgb(${Math.trunc(Math.random() * 256)}, ${Math.trunc(Math.random() * 256)}, ${Math.trunc(Math.random() * 256)})`
  }
  let coordsSet = []
  for (let i = -100; i < 100; i++) {
    coordsSet.push(i)
  }
  let sizeSet = new Array(10).fill('').map((item, index) => index + 1)
  
  const getRndCoords = () => {
    return coordsSet[Math.floor(Math.random() * coordsSet.length)]
  }
  
  const getRndSize = () => {
    return sizeSet[Math.floor(Math.random() * sizeSet.length)]
  }
  
  // 随机显示200个box
  
  for (let i = 0; i < 200; i++) {
    let boxSize = getRndSize()
    let box = new BoxBufferGeometry(boxSize, boxSize, boxSize)
    let boxMat = new MeshPhongMaterial({
      color: rndColor()
    })
    let boxMesh = new Mesh(box, boxMat)
    boxMesh.position.set(getRndCoords(), getRndCoords(), getRndCoords())
    scene.add(boxMesh)
  }
  
  // 增加个地板
  const loader = new THREE.TextureLoader()
  const planeSize = 80
  loader.load(checker, asset => {
    // 加载texture 成功之后
    asset.wrapS = THREE.RepeatWrapping
    asset.wrapT = THREE.RepeatWrapping
    asset.magFilter = THREE.NearestFilter
    const repeats = planeSize / 2
    asset.repeat.set(repeats, repeats)
    
    const plane = new THREE.BoxBufferGeometry(planeSize, planeSize, 0.5)
    const planeMaterial = new THREE.MeshPhongMaterial({
      map: asset,
      side: THREE.DoubleSide
    })
    
    const planeMesh = new THREE.Mesh(plane, planeMaterial)
    planeMesh.rotateX(THREE.Math.degToRad(90))
    // planeMesh.receiveShadow = true
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
  // sphere.castShadow = true
  scene.add(sphere)
  
  const render = time => {
    time *= 0.001
    // mesh.rotation.y = time
    // mesh.rotation.x = time
    TWEEN.update()
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
  
  resizeHandler()
  
  // 获取坐标操作
  let screenX = document.getElementById('screen-x')
  let screenY = document.getElementById('screen-y')
  
  let coordsX = document.getElementById('world-x')
  let coordsY = document.getElementById('world-y')
  let coordsZ = document.getElementById('world-z')
  
  document.onmousemove = e => {
    screenX.innerHTML = 'x：' + e.clientX
    screenY.innerHTML = 'y：' + e.clientY
  }
}

window.onload = main
