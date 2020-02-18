import * as THREE from 'three'
import { GUI } from 'dat.gui'

class AxisGridHelper {
  constructor (node, units = 10) {
    const axes = new THREE.AxesHelper()
    axes.material.depthTest = false
    axes.renderOrder = 2
    node.add(axes)
    
    const grid = new THREE.GridHelper(units, units)
    grid.material.depthTest = false
    grid.renderOrder = 1
    node.add(grid)
    
    this.grid = grid
    this.axes = axes
    this.visible = false
  }
  
  get visible () {
    return this._visible
  }
  
  set visible (v) {
    this._visible = v
    this.grid.visible = v
    this.grid.visible = v
  }
}

function main () {
  const canvas = document.getElementById('c')
  const renderer = new THREE.WebGLRenderer({canvas})
  const fov = 60
  const aspect = window.innerWidth / window.innerHeight
  const near = 0.01
  const far = 160
  
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(0, 50, 10)
  camera.lookAt(0, 0, 0)
  
  const scene = new THREE.Scene()
  
  {
    const color = 0xffffff
    const intensity = 3
    const light = new THREE.PointLight(color, intensity)
    scene.add(light)
  }
  
  const objects = []
  // 创建sun + earth 组
  const solarSystem = new THREE.Object3D()
  scene.add(solarSystem)
  objects.push(solarSystem)
  
  // create sun
  const radius = 1
  const widthSegments = 6
  const heightSegments = 6
  const sunGeo = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments)
  const sunMat = new THREE.MeshPhongMaterial({
    emissive: 0xffff00,
    // wireframe: true
  })
  const sun = new THREE.Mesh(sunGeo, sunMat)
  sun.scale.set(5, 5, 5)
  solarSystem.add(sun)
  objects.push(sun)
  
  // 创建地球组
  const earthOrbit = new THREE.Object3D()
  earthOrbit.position.x = 10
  solarSystem.add(earthOrbit)
  objects.push(earthOrbit)
  
  // create earth
  const earthMat = new THREE.MeshPhongMaterial({
    color: 0x2233FF,
    emissive: 0x112244
  })
  const earthMesh = new THREE.Mesh(sunGeo, earthMat)
  // earthMesh.position.x = 10
  earthOrbit.add(earthMesh)
  objects.push(earthMesh)
  
  // create moon
  const monMat = new THREE.MeshPhongMaterial({
    color: '#ff6600',
    emissive: 0x222222
  })
  const moonMesh = new THREE.Mesh(sunGeo, monMat)
  moonMesh.position.x = 2
  moonMesh.scale.set(0.5, 0.5, 0.5)
  earthOrbit.add(moonMesh)
  objects.push(moonMesh)
  
  // add an AxesGridHelper to each node
  const gui = new GUI()
  
  const makeAxisGrid = (node, label, units) => {
    const helper = new AxisGridHelper(node, units)
    gui.add(helper, 'visible').name(label)
  }
  
  makeAxisGrid(solarSystem, 'solarSystem', 25);
  makeAxisGrid(sun, 'sunMesh');
  makeAxisGrid(earthOrbit, 'earthOrbit');
  makeAxisGrid(earthMesh, 'earthMesh');
  makeAxisGrid(moonMesh, 'moonMesh');
  
  // resize
  const resizeRendererToDisplaySize = (renderer) => {
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    
    if (needResize) {
      console.log('resize right now')
      renderer.setSize(width, height, false)
    }
    return needResize
  }
  
  const render = (time) => {
    time *= 0.001
    
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }
    
    objects.forEach(item => {
      item.rotation.y = time
    })
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  
  requestAnimationFrame(render)
  
}

window.onload = main
