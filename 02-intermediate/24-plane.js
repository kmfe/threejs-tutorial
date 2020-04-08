import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import timg from './timg.png'

function main () {
  const canvas = document.getElementById('c')
  const renderer = new THREE.WebGLRenderer({canvas})
  const fov = 60
  const near = 0.1
  const far = 100
  const aspect = window.innerWidth / window.innerHeight
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.z = 10
  
  const controls = new OrbitControls(camera, canvas)
  controls.target.set(0, 2, 0)
  controls.update()
  
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#ffffff')
  
  // 创建灯光
  function addLight (position) {
    const color = 0XFFFFF
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(...position)
    scene.add(light)
    scene.add(light.target)
  }
  
  addLight([-3, 1, 1])
  addLight([2, 1, 5])
  
  // 创建cube
  const loader = new THREE.TextureLoader()
  loader.load(timg, texture => {
    texture.minFilter = THREE.LinearFilter
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    
    let geo = new THREE.BoxBufferGeometry(4, 0.2, 4)
    let material = new THREE.MeshBasicMaterial({
      transparent: true,
      map: texture
    })
    let cube = new THREE.Mesh(geo, material)
    scene.add(cube)
  })
  
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
    if (resizeRendererToDisplay(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }
    
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  
  requestAnimationFrame(render)
}

window.onload = main
