import * as THREE from 'three'
import { GUI } from 'dat.gui'

import wall from '../images/wall.jpg'

import x1 from '../images/texture/x1.jpeg'
import x2 from '../images/texture/x2.jpeg'
import x3 from '../images/texture/x4.jpeg'
import x4 from '../images/texture/x5.jpeg'
import x5 from '../images/texture/x6.jpeg'
import x6 from '../images/texture/x7.jpeg'

/*
* THREE 贴图
* 文章来源：https://threejsfundamentals.org/threejs/lessons/threejs-textures.html
* */

// 以下为辅助方法

// rad convert degree
class DegRadHelper {
  constructor (obj, prop) {
    this.obj = obj
    this.prop = prop
  }
  
  get value () {
    return THREE.Math.radToDeg(this.obj[this.prop])
  }
  
  set value (v) {
    this.obj[this.prop] = THREE.Math.degToRad(v)
  }
}

// string convert number
class StringToNumberHelper {
  constructor (obj, prop) {
    this.obj = obj
    this.prop = prop
  }
  
  get value () {
    return this.obj[this.prop]
  }
  
  set value (v) {
    this.obj[this.prop] = parseFloat(v)
  }
}

function main () {
  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({canvas})
  
  const fov = 75
  const aspect = 2
  const near = 0.1
  const far = 50
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  
  camera.position.z = 10
  
  const scene = new THREE.Scene()
  
  const boxWidth = 5
  const boxHeight = 5
  const boxDepth = 5
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)
  
  // 单个图片的贴图
  const cubes = []
  
  // 增加加载管理器，检测加载进程
  const loadManager = new THREE.LoadingManager()
  const loader = new THREE.TextureLoader(loadManager)
  
  let cubeTexture = loader.load(wall)
  
  // 关于texture的一堆设置
  const wrapModes = {
    'ClampToEdgeWrapping': THREE.ClampToEdgeWrapping,
    'RepeatWrapping': THREE.RepeatWrapping,
    'MirroredRepeatWrapping': THREE.MirroredRepeatWrapping
  }
  
  function updateTexture () {
    cubeTexture.needsUpdate = true
  }
  
  const gui = new GUI()
  gui.add(new StringToNumberHelper(cubeTexture, 'wrapS'), 'value', wrapModes)
  .name('texture.wrapS')
  .onChange(updateTexture)
  
  gui.add(new StringToNumberHelper(cubeTexture, 'wrapT'), 'value', wrapModes)
  .name('texture.wrapT')
  .onChange(updateTexture)
  
  gui.add(cubeTexture.repeat, 'x', 0, 5, 0.01).name('texture.repeat.x')
  gui.add(cubeTexture.repeat, 'y', 0, 5, 0.01).name('texture.repeat.y')
  gui.add(cubeTexture.offset, 'x', -2, 2, .01).name('texture.offset.x');
  gui.add(cubeTexture.offset, 'y', -2, 2, .01).name('texture.offset.y');
  gui.add(cubeTexture.center, 'x', -.5, 1.5, .01).name('texture.center.x');
  gui.add(cubeTexture.center, 'y', -.5, 1.5, .01).name('texture.center.y');
  gui.add(new DegRadHelper(cubeTexture, 'rotation'), 'value', -360, 360)
  .name('texture.rotation');
  
  const timersToRepeatHorizontal = 4
  const timersToRepeatVertical = 4
  
  cubeTexture.wrapS = THREE.RepeatWrapping
  cubeTexture.wrapT = THREE.RepeatWrapping
  cubeTexture.repeat.set(timersToRepeatHorizontal, timersToRepeatVertical)
  
  const xOffset = .25
  const yOffset = .25
  cubeTexture.offset.set(xOffset, yOffset)
  
  cubeTexture.center.set(1, 1)
  cubeTexture.rotation = THREE.Math.degToRad(45)
  
  const material = new THREE.MeshBasicMaterial({
    map: cubeTexture
  })
  
  // 多张图片的贴图
  const multipleMaterial = [
    new THREE.MeshBasicMaterial({map: loader.load(x1)}),
    new THREE.MeshBasicMaterial({map: loader.load(x2)}),
    new THREE.MeshBasicMaterial({map: loader.load(x3)}),
    new THREE.MeshBasicMaterial({map: loader.load(x4)}),
    new THREE.MeshBasicMaterial({map: loader.load(x5)}),
    new THREE.MeshBasicMaterial({map: loader.load(x6)})
  ]
  
  // 加载完成后
  loadManager.onLoad = () => {
    const multipleCube = new THREE.Mesh(geometry, multipleMaterial)
    const cube = new THREE.Mesh(geometry, material)
    cube.position.set(-3, -3, -3)
    multipleCube.position.set(2, 2, 2)
    
    // scene.add(multipleCube)
    scene.add(cube)
    
    cubes.push(cube)
    // cubes.push(multipleCube)
  }
  
  loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
    const progress = itemsLoaded / itemsTotal
    console.log(progress, 'progress')
  }
  
  function resizeRendererToDisplaySize (renderer) {
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      renderer.setSize(width, height, false)
    }
    return needResize
  }
  
  function render (time) {
    time *= 0.001
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }
    
    cubes.forEach((cube, ndx) => {
      const speed = .2 + ndx * 0.1
      const rot = time * speed
      cube.rotation.x = rot
      cube.rotation.y = rot
    })
    
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  
  requestAnimationFrame(render)
}

main()
