import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

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
  
  // 以下为创建canvas
  const ctx = document.createElement('canvas').getContext('2d')
  ctx.canvas.width = 256
  ctx.canvas.height = 256
  ctx.fillStyle = '#FFF'
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  
  function randInt (min, max) {
    if (max === undefined) {
      max = min
      min = 0
    }
    return Math.random() * (max - min) + min | 0
  }
  
  function drawRandomDot () {
    ctx.fillStyle = `#${randInt(0x1000000).toString(16).padStart(6, '0')}`
    ctx.beginPath()
    const x = randInt(256)
    const y = randInt(256)
    const radius = randInt(10, 64)
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }
  
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
  
  // 创建canvas 文本
  function makeLabelCanvas (size, name) {
    const borderSize = 2
    const ctx = document.createElement('canvas').getContext('2d')
    const font = `${size}px bold sans-serif`
    ctx.font = font
    
    // measure how long the name will be
    const doubleBorderSize = borderSize * 2
    const width = ctx.measureText(name).width + doubleBorderSize
    const height = size + doubleBorderSize
    ctx.canvas.width = width
    ctx.canvas.height = height
    
    // need to set font again after resize canvas
    ctx.font = font
    ctx.textBaseline = 'top'
    ctx.fillStyle = 'blue'
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = 'white'
    ctx.fillText(name, borderSize, borderSize)
    
    return ctx.canvas
  }
  
  // 创建人形body
  const bodyRadiusTop = .4
  const bodyRadiusBottom = .2
  const bodyHeight = 2
  const bodyRadialSegments = 6
  const bodyGeometry = new THREE.CylinderBufferGeometry(bodyRadiusTop, bodyRadiusBottom, bodyHeight, bodyRadialSegments)
  
  // 创建人形 header
  const headRadius = bodyRadiusTop * 0.8
  const headLonSegments = 12
  const headLatSegments = 5
  const headGeometry = new THREE.SphereBufferGeometry(
    headRadius, headLonSegments, headLatSegments)
  
  const labelGeometry = new THREE.PlaneBufferGeometry(1, 1)
  
  //创建人
  
  function makePerson (x, size, name, color) {
    const canvas = makeLabelCanvas(size, name)
    const texture = new THREE.CanvasTexture(canvas)
    
    // because our canvas is likely not a power of 2
    // in both dimensions set the filtering appropriately
    texture.minFilter = THREE.LinearFilter
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    
    const labelMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true
    })
    
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color,
      flatShading: true
    })
    
    const root = new THREE.Object3D()
    root.position.x = x
    
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    root.add(body)
    body.position.y = bodyHeight / 2
    
    const head = new THREE.Mesh(headGeometry, bodyMaterial)
    root.add(head)
    head.position.y = bodyHeight + headRadius * 1.1
    
    const label = new THREE.Mesh(labelGeometry, labelMaterial)
    root.add(label)
    label.position.y = bodyHeight * 4 / 5
    label.position.z = bodyRadiusTop * 1.01
    
    // if units are meters than 0.01 here makes size
    // of the label into centimeters
    const labelBasicScale = 0.01
    label.scale.x = canvas.width * labelBasicScale
    label.scale.y = canvas.height * labelBasicScale
    
    scene.add(root)
    return root
  }
  
  makePerson(-3, 32, '王大锤', 'purple')
  makePerson(-0, 32, '李肖龙', 'green')
  makePerson(+3, 32, '张全蛋', 'red')
  
  // 创建cube
  const canvasTexture = new THREE.CanvasTexture(ctx.canvas)
  let geo = new THREE.BoxBufferGeometry(2, 2, 2)
  let material = new THREE.MeshBasicMaterial({
    map: canvasTexture,
    color: 'lightblue'
  })
  let cube = new THREE.Mesh(geo, material)
  scene.add(cube)
  
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
    if (resizeRendererToDisplay(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }
    
    const speed = .2 * time
    cube.rotation.x = speed
    cube.rotation.y = speed
    
    drawRandomDot()
    canvasTexture.needsUpdate = true
    
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  
  requestAnimationFrame(render)
}

window.onload = main
