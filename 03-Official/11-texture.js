import * as THREE from 'three'
import wall from '../images/wall.jpg'

function main () {
  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({canvas})
  
  const fov = 75
  const aspect = 2
  const near = 0.1
  const far = 5
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  
  camera.position.z = 2
  
  const scene = new THREE.Scene()
  
  const boxWidth = 1
  const boxHeight = 1
  const boxDepth = 1
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)
  
  const cubes = []
  const loader = new THREE.TextureLoader()
  const material = new THREE.MeshBasicMaterial({
    map: loader.load(wall)
  })
  
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)
  cubes.push(cube)
  
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
