import * as THREE from 'three'

import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  BoxBufferGeometry,
  MeshPhongMaterial,
  MeshBasicMaterial,
  Mesh
} from 'three'

function main () {
  const canvas = document.getElementById('c')
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    logarithmicDepthBuffer: true
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  
  const scene = new Scene()
  const fov = 60
  const far = 100
  const near = 0.01
  const aspect = window.innerWidth / window.innerHeight
  const camera = new PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(0, 0, 40)
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
  
  /*
  * MeshBasicMaterial 不受光照影响
  * MeshLambertMaterial 只计算最高点的光
  * MeshPhongMaterial 计算每像素的光照及镜面高光
  *
  * shininess 设置镜面高光，默认为30
  * emissive
  * material.needsUpdate = true 用于更新material
  * flatShading = true
  * */
  
  const boxGeo = new BoxBufferGeometry(5, 5, 5)
  const boxMat = new MeshBasicMaterial({
    color
  })
  const mesh = new Mesh(boxGeo, boxMat)
  scene.add(mesh)
  
  // --- end code
  const resizeHandler = () => {
    window.onresize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
  }
  
  const render = time => {
    time *= 0.001
    mesh.rotation.y = time
    mesh.rotation.x = time
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
  
  resizeHandler()
}

window.onload = main
