import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

/*
* 多场景，多canvas 处理
* https://threejsfundamentals.org/threejs/lessons/threejs-multiple-scenes.html
* */
function main () {
  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({canvas, alpha: true})
  
  function makerScene (elem) {
    const scene = new THREE.Scene()
    const fov = 45
    const aspect = 2
    const far = 5
    const near = 0.1
    
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.z = 2
    camera.position.set(0, 1, 2)
    camera.lookAt(0, 0, 0)
    
    {
      const color = 0XFFFFFF
      const intensity = 1
      const light = new THREE.DirectionalLight(color, intensity)
      light.position.set(-1, 2, 4)
      scene.add(light)
    }
    
    return {
      scene,
      camera,
      elem
    }
  }
  
  function setupScene1 () {
    const sceneInfo = makerScene(document.querySelector('#box'))
    const geometry = new THREE.BoxBufferGeometry(1, 1, 1)
    const material = new THREE.MeshPhongMaterial({color: 'red'})
    const mesh = new THREE.Mesh(geometry, material)
    sceneInfo.scene.background = new THREE.Color('blue')
    sceneInfo.scene.add(mesh)
    sceneInfo.mesh = mesh
    return sceneInfo
  }
  
  function setupScene2 () {
    const sceneInfo = makerScene(document.querySelector('#pyramid'))
    const radius = .8
    const widthSegments = 4
    const heightSegments = 2
    const geometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments)
    const material = new THREE.MeshPhongMaterial({
      color: 'blue',
      flatShading: true
    })
    const mesh = new THREE.Mesh(geometry, material)
    sceneInfo.scene.background = new THREE.Color('green')
    sceneInfo.scene.add(mesh)
    sceneInfo.mesh = mesh
    return sceneInfo
  }
  
  const sceneInfo1 = setupScene1()
  const sceneInfo2 = setupScene2()
  
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
  
  function renderSceneInfo (sceneInfo) {
    const {scene, camera, elem} = sceneInfo
    // get the viewport relative position opf this element
    const {left, right, top, bottom, width, height} = elem.getBoundingClientRect()
    const isOffScreen =
      bottom < 0 ||
      top > renderer.domElement.clientHeight ||
      right < 0 ||
      left > renderer.domElement.clientWidth
    if (isOffScreen) return
    
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    
    const positiveYUpBottom = renderer.domElement.clientHeight - bottom
    // 设置裁剪区域 setScissor(x, y, w, h)
    renderer.setScissor(left, positiveYUpBottom, width, height)
    
    // 设置视口
    renderer.setViewport(left, positiveYUpBottom, width, height)
    renderer.render(scene, camera)
  }
  
  function render (time) {
    time *= 0.001
    
    renderer.domElement.style.transform = `translateY(${window.scrollY}px)`
    
    resizeRendererToDisplaySize(renderer)
    // 启用或禁用裁剪检测
    renderer.setScissorTest(true)
    renderer.clear(true, true)
    
    sceneInfo1.mesh.rotation.y = time * .1
    sceneInfo2.mesh.rotation.y = time * .1
    
    renderSceneInfo(sceneInfo1)
    renderSceneInfo(sceneInfo2)
    
    requestAnimationFrame(render)
  }
  
  requestAnimationFrame(render)
  
}

window.onload = main
