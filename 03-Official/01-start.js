import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  BoxBufferGeometry,
  MeshNormalMaterial,
  MeshStandardMaterial,
  Mesh
} = THREE

class Tutorial {
  constructor () {
    this.step = 0
    this.SCREEN_WIDTH = window.innerWidth
    this.SCREEN_HEIGHT = window.innerHeight
    this.scene = new Scene()
    this.scene.background = new THREE.Color('skyblue')
    this.addGui()
    
    this.initCamera()
    this.initMesh()
    this.initLight()
    this.initRenderer()
    this.addOrbitControl()
    this.addHelper()
    
    this.animate()
  }
  
  initCamera () {
    let aspect = this.SCREEN_WIDTH / this.SCREEN_HEIGHT
    this.camera = new PerspectiveCamera(60, aspect, 0.1, 100)
    this.camera.position.set(10, 10, 10)
    this.camera.target = new THREE.Vector3(0, -1, 0)
  }
  
  initMesh () {
    let geometry = new BoxBufferGeometry(2, 2, 2)
    let material = new MeshNormalMaterial()
    this.mesh = new Mesh(geometry, material)
    this.mesh.position.set(0, 1.8, 0)
    this.scene.add(this.mesh)
    
    let plane = new BoxBufferGeometry(8, 8, 0.1)
    let planeMaterial = new MeshNormalMaterial()
    this.plane = new Mesh(plane, planeMaterial)
    this.plane.position.set(this.planeParams.x || 0, this.planeParams.y || 0, this.planeParams.z || 0)
    this.plane.rotateX(this.planeParams.rotateX || 0)
    this.plane.rotateY(this.planeParams.rotateY || 0)
    this.plane.rotateZ(this.planeParams.rotateZ || 0)
    this.scene.add(this.plane)
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
    container.appendChild(this.renderer.domElement)
  }
  
  initLight () {
    // 默认光照射的target为(0,0,0)
    const light = new THREE.DirectionalLight(0xffffff, 5.0)
    light.position.set(10, 10, 10)
    this.scene.add(light)
  }
  
  updateMesh () {
    this.step += 0.01
    this.mesh.rotation.set(this.step, this.step, this.step)
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
    this.control.enabled = this.orbit.canOrbit
  }
  
  addGui () {
    const gui = new dat.GUI()
    
    // 是否可控制
    this.planeParams = {
      x: 0,
      y: 0,
      z: 0,
      rotateX: -Math.PI / 2,
      rotateY: 0,
      rotateZ: 0
    }
    this.orbit = {
      canOrbit: true
    }
    
    // 添加gui控制
    const rotateHandler = () => {
      this.plane.rotateX(this.planeParams.rotateX)
      this.plane.rotateY(this.planeParams.rotateY)
      this.plane.rotateZ(this.planeParams.rotateZ)
    }
    const posHandler = () => { this.plane.position.set(this.planeParams.x, this.planeParams.y, this.planeParams.z) }
    const enableOrbit = () => {this.control.enabled = this.orbit.canOrbit}
    
    let params = Object.keys(this.planeParams)
    
    for (let i = 0; i < params.length; i++) {
      if (params[i].includes('rotate')) {
        gui.add(this.planeParams, params[i], -3.14, 3.14).step(0.001).onChange(rotateHandler)
      } else {
        gui.add(this.planeParams, params[i], -10, 10).onChange(posHandler)
      }
    }
    
    gui.add(this.orbit, 'canOrbit').name('是否支持Orbit').onChange(enableOrbit)
  }
}

new Tutorial()
