import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import checker from '../models/checker.png'
import { GUI } from 'dat.gui'
import { HemisphereLight } from 'three'

/*
* THREE lights
* https://threejsfundamentals.org/threejs/lessons/threejs-lights.html
* */

class ColorGUIHelper {
  constructor (object, prop) {
    this.object = object
    this.prop = prop
  }
  
  get value () {
    return `#${this.object[this.prop].getHexString()}`
  }
  
  set value (hexString) {
    this.object[this.prop].set(hexString)
  }
}

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

function main () {
  const canvas = document.getElementById('c')
  const renderer = new THREE.WebGLRenderer({canvas})
  const fov = 60
  const near = 0.1
  const far = 100
  const aspect = window.innerWidth / window.innerHeight
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(0, 10, 20)
  
  const controls = new OrbitControls(camera, canvas)
  controls.target.set(0, 5, 0)
  controls.update()
  
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#000000')
  
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
  
  // AmbientLight 环境光
  // new THREE.AmbientLight(color, intensity);
  const addAmbientLight = () => {
    const color = 0xFFFFFF
    const intensity = 1
    const light = new THREE.AmbientLight(color, intensity)
    scene.add(light)
    
    const gui = new GUI()
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
    gui.add(light, 'intensity', 0, 2, 0.01)
  }
  
  // addAmbientLight()
  
  // HemisphereLight 半球光
  // new THREE.HemisphereLight(skyColor, groundColor, intensity);
  
  const addHemisphereLight = () => {
    const skyColor = 0xB1E1FF
    const groundColor = 0xB97A20
    const intensity = 1
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity)
    scene.add(light)
    const gui = new GUI()
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('skyColor')
    gui.addColor(new ColorGUIHelper(light, 'groundColor'), 'value').name('groundColor')
    gui.add(light, 'intensity', 0, 2, 0.01)
    
    scene.add(light)
  }
  
  // addHemisphereLight()
  
  // directionLight
  const addDirectionLight = () => {
    const color = 0XFFFFFF
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(0, 10, 0)
    light.target.position.set(-5, 0, 0)
    scene.add(light)
    scene.add(light.target)
    
    const gui = new GUI()
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('Color')
    gui.add(light, 'intensity', 0, 2, 0.01)
    gui.add(light.target.position, 'x', -10, 10)
    gui.add(light.target.position, 'y', -10, 10)
    gui.add(light.target.position, 'z', -10, 10)
  }
  
  // addDirectionLight()
  
  // pointLight
  const addPointLight = () => {
    const color = 0xFFFFFF
    const intensity = 1
    const light = new THREE.PointLight(color, intensity)
    
    light.position.set(0, 10, 0)
    scene.add(light)
    
    const helper = new THREE.PointLightHelper(light)
    scene.add(helper)
    
    function updateLight () {
      helper.update()
    }
    
    const gui = new GUI()
    gui.add(new ColorGUIHelper(light, 'color'), 'value').name('Color')
    gui.add(light, 'intensity', 0, 2, 0.01)
    gui.add(light, 'distance', 0, 40).onChange(updateLight)
  }
  
  // addPointLight()
  
  // spotLight
  const addSpotLight = () => {
    const color = 0XFFFFFF
    const intensity = 1
    const light = new THREE.SpotLight(color, intensity)
    light.position.set(0, 12, 0)
    light.target.position.set(-4, 0, 0)
    scene.add(light)
    scene.add(light.target)
    
    const helper = new THREE.SpotLightHelper(light)
    scene.add(helper)
    
    function updateLight () {
      helper.update()
    }
    
    const gui = new GUI()
    gui.add(new DegRadHelper(light, 'angle'), 'value', -90, 90).name('angle').onChange(updateLight)
    gui.add(light, 'distance', -10, 10)
    gui.add(light, 'intensity', 0, 2, 0.01)
    gui.add(light, 'penumbra', 0, 1, 0.01);
    
    gui.add(light.position, 'x', -10, 10)
    gui.add(light.position, 'y', -10, 10)
    gui.add(light.position, 'z', -10, 10)
    
    gui.add(light.target.position, 'x', -10, 10)
    gui.add(light.target.position, 'y', -10, 10)
    gui.add(light.target.position, 'z', -10, 10)
    
  }
  
  addSpotLight()
  
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
  cube.position.set(0, 2, -5)
  scene.add(cube)
  
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
