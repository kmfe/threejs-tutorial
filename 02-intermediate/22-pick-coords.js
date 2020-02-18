import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Scene } from 'three'
import { PerspectiveCamera } from 'three'
import { AxesHelper } from 'three'

class Panorama {
  constructor () {
    this.container = document.getElementById('c')
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.init()
  }
  
  init () {
    this.initRenderer()
    this.initScene()
    this.initCamera()
    this.initMesh()
    this.initLight()
    this.render()
    
    document.body.addEventListener('click', e => {
      let x = e.clientX
      let y = e.clientY
      const colors = ['lightblue', 'lightgreen', 'navy', 'purple', 'pink']
      document.getElementById('screen-x').innerText = 'x:' + x
      document.getElementById('screen-y').innerText = 'y:' + y
      
      // 1. 将鼠标点击的当前 屏幕坐标 转化 为世界坐标
      let vector = new THREE.Vector2()
      vector.x = (x / window.innerWidth) * 2 - 1
      vector.y = (y / window.innerHeight) * -2 + 1
      
      this.raycaster.setFromCamera(vector, this.camera)
      
      // 射线碰撞到的物体
      const intersects = this.raycaster.intersectObjects(this.scene.children)
      if (intersects.length) {
        const obj = intersects[0].object
        // 只设置第一个相交的物体
        obj['material'].color.set(colors[parseInt(Math.random() * 5 + '', 10)])
        
        // 2. 将世界坐标转换为屏幕坐标
        const worldVector = new THREE.Vector3(
          obj.position.x,
          obj.position.y,
          obj.position.z
        )
        //世界坐标转标准设备坐标
        const stdVector = worldVector.project(this.camera)
        const a = window.innerWidth / 2
        const b = window.innerHeight / 2
        console.log(stdVector, '设备坐标')
        //标准设备坐标转屏幕坐标x,y
        const x = Math.round(stdVector.x * a + a)
        const y = Math.round(-stdVector.y * b + b)
        
        console.log(x, y, '屏幕坐标')
      }
      
    }, false)
  }
  
  initRenderer () {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.container,
      antialias: true
    })
    this.renderer.setSize(this.width, this.height)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    
    this.raycaster = new THREE.Raycaster()
    
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap // 默认的是，没有设置的这个清晰 THREE.PCFShadowMap
  }
  
  initCamera () {
    const fov = 60
    const far = 400
    const near = 0.01
    const aspect = this.width / this.height
    this.camera = new PerspectiveCamera(fov, aspect, near, far)
    this.camera.position.set(0, 30, 20)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.update()
  }
  
  initScene () {
    const axesHelper = new AxesHelper(200)
    this.scene = new Scene()
    this.scene.add(axesHelper)
  }
  
  initMesh () {
    // 添加底板
    const planeGeo = new THREE.BoxBufferGeometry(40, 40, 0.5)
    const planeMat = new THREE.MeshPhongMaterial({
      color: '#ccc'
    })
    const plane = new THREE.Mesh(planeGeo, planeMat)
    plane.name = 'plane'
    plane.receiveShadow = true
    plane.rotateX(THREE.Math.degToRad(90))
    plane.position.set(0, -0.5, 0)
    this.scene.add(plane)
    
    // 添加球体，立方体等
    
    const boxGeo = new THREE.BoxBufferGeometry(5, 5, 5)
    const boxMat = new THREE.MeshPhongMaterial({
      color: '#f60'
    })
    const box = new THREE.Mesh(boxGeo, boxMat)
    box.position.set(0, 2.5, -5)
    box.name = 'box'
    box.castShadow = true
    this.scene.add(box)
    // 球体
    const sphereGeo = new THREE.SphereBufferGeometry(2, 30, 30)
    const sphereMat = new THREE.MeshPhongMaterial({
      color: '#cd0000'
    })
    const sphere = new THREE.Mesh(sphereGeo, sphereMat)
    sphere.name = 'sphere'
    sphere.castShadow = true
    sphere.position.set(6, 4, -6)
    this.scene.add(sphere)
  }
  
  initLight () {
    //const ambient = new THREE.AmbientLight('#fff', 1)
    // this.scene.add(ambient)
    
    const light = new THREE.PointLight('#ffffff', 1)
    light.position.set(0, 15, 5)
    light.castShadow = true
    this.scene.add(light)
    this.scene.add(new THREE.PointLightHelper(light))
  }
  
  render () {
    const w = window.innerWidth
    const h = window.innerHeight
    const needResize = this.width !== w || this.height !== h
    if (needResize) {
      this.camera.aspect = w / h
      this.camera.updateProjectionMatrix()
      this.renderer && this.renderer.setSize(w, h, true)
    }
    
    this.renderer.render(this.scene, this.camera)
    this.renderer.setAnimationLoop(() => {
      this.render()
    })
  }
  
  destroy () {
  
  }
}

window.onload = () => {
  const panorama = new Panorama()
  console.log(panorama)
}
