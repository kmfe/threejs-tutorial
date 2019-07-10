import * as THREE from 'three'
import { DeviceOrientationControls } from 'three/examples/jsm/controls/DeviceOrientationControls'
import TWEEN from '@tweenjs/Tween.js'
import * as dat from 'dat.gui'

const gui = new dat.GUI()

const media = /iphone|android|micromessenger/ig.test(navigator.userAgent) ? 'mobile' : 'pc'

// 切换图片 实现动画，标记动画vert, horiz 方向上的数量
// tileDispDuration 每张图片显示的时间

function TextureAnimator (texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) {
  this.tilesHorizontal = tilesHoriz
  this.tilesVertical = tilesVert
  this.numberOfTiles = numTiles
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical)
  this.tileDisplayDuration = tileDispDuration
  this.currentDisplayTime = 0
  this.currentTile = 0
  this.update = function (milliSec) {
    this.currentDisplayTime += milliSec
    while (this.currentDisplayTime > this.tileDisplayDuration) {
      this.currentDisplayTime -= this.tileDisplayDuration
      this.currentTile++
      if (this.currentTile === this.numberOfTiles)
        this.currentTile = 0
      let currentColumn = this.currentTile % this.tilesHorizontal
      texture.offset.x = currentColumn / this.tilesHorizontal
      let currentRow = Math.floor(this.currentTile / this.tilesHorizontal)
      texture.offset.y = currentRow / this.tilesVertical
    }
  }
}

export default class Panorama {
  constructor (options) {
    this.el = document.getElementById(options.el)
    this.data = options.data
    this.cover = options.cover
    this.scene = new THREE.Scene()
    this.clickables = options.clickables
    this.media = media
    this.imgLoad = new THREE.TextureLoader()

    // 数据
    this.buttonList = [...this.data]

    // 编组
    this.spriteGroup = new THREE.Group()
    this.scene.add(this.spriteGroup)
    this.circle = null
    this.gui = gui

    // init GUI
    this.guiParams = new function () {
      this.pointX = 0
      this.pointY = 0
      this.pointZ = 0
      this.Rx = 0
      this.Ry = 0
      this.Rz = 0
    };

    // 全景控件, 配置
    this.camera = null
    this.controls = null
    this.clock = new THREE.Clock()

    // 储存当前全景的状态
    this.state = {
      position: {
        lon: 0,
        lat: 0,
        fov: 120,
        phi: 0,
        theta: 0
      },
      mouse: {
        onMouseDownMouseX: 0,
        onMouseDownMouseY: 0,
        onMouseDownLon: 0,
        onMouseDownLat: 0,
        onTwoTouchX: 0,
        onTwoTouchY: 0,
        onMouseDownFov: 0
      },
      gyro: false,
      autoMove: true,
      timeout: null
    }

    // 配置
    this.settings = {
      timeDelay: 10000,
      moveRate: 0.1,
      minFov: 10,
      maxFov: 120
    }

    this.initRenderer()
    this.initCamera()
    this.initMesh()
    // this.initButtons()

    this.clickables.forEach(item => {
      this.addChoreAll(item.cover, item.width, item.height, item.pos, item.rotation, item.name)
    })

    this.animate()
    this.initModal()
    this.bindEvent()

    this.initTouch()

    this.axesHelper = new THREE.AxesHelper(500000)
    this.scene.add(this.axesHelper)

    // 绑定resize事件
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    }, false)

  }

  initCamera () {
    const {position} = this.state
    this.camera = new THREE.PerspectiveCamera(position.fov, window.innerWidth / window.innerHeight, 1, 1000)
    this.camera.position.set(0, 0, 0)
    this.camera.target = new THREE.Vector3(0, 0, 0)
    this.controls = new DeviceOrientationControls(this.camera)
  }

  initMesh () {
    let geometry = new THREE.SphereGeometry(500, 60, 40)
    geometry.scale(-1, 1, 1)
    geometry.rotateY(-Math.PI / 2)

    let material = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(this.cover)
    })

    let mesh = new THREE.Mesh(geometry, material)
    this.scene.add(mesh)
  }

  // initButtons () {
  //
  //   this.buttonList = [...this.data]
  //
  //   this.buttonGroup = new THREE.Group()
  //   this.buttonArr = []
  //   this.buttonList.forEach((button) => {
  //     this.createButton(button)
  //   })
  //   this.scene.add(this.buttonGroup)
  //
  // }
  //
  // getButtonPoint (phi, theta) {
  //   let r = 500
  //   return [
  //     r * Math.sin(THREE.Math.degToRad(phi)) * Math.cos(THREE.Math.degToRad(theta)),
  //     r * Math.sin(THREE.Math.degToRad(phi)) * Math.sin(THREE.Math.degToRad(theta)),
  //     r * Math.cos(THREE.Math.degToRad(phi))
  //   ]
  // }
  //
  // createButton (button) {
  //   let position = this.getButtonPoint(button.phi, button.theta)
  //   let meshGroup = new THREE.Group()
  //   meshGroup.name = button.name
  //   meshGroup.position.set(...position)
  //
  //   let mesh = this.createSpriteShape('#ffffff', 0.8, 12)
  //
  //   meshGroup.add(mesh)
  //
  //   mesh = this.createSpriteShape('#2d2d2d', 0.6, 24)
  //   meshGroup.add(mesh)
  //
  //   mesh = this.createSpriteShape('#2d2d2d', 0.2, 36)
  //   meshGroup.add(mesh)
  //   this.buttonArr.push(mesh)
  //   mesh.name = button.name
  //   this.buttonGroup.add(meshGroup)
  //   this.animatePoints(meshGroup)
  // }
  //
  // createSpriteShape (color, opacity, scale) {
  //   let canvas = document.createElement('canvas')
  //   // document.body.appendChild(canvas);
  //   canvas.width = 128
  //   canvas.height = 128
  //   let ctx = canvas.getContext('2d')
  //   ctx.fillStyle = color
  //   ctx.arc(64, 64, 64, 0, 2 * Math.PI)
  //   ctx.fill()
  //
  //   let texture = new THREE.Texture(canvas)
  //   texture.needsUpdate = true
  //   let material = new THREE.SpriteMaterial({
  //     map: texture,
  //     transparent: true,
  //     opacity: opacity,
  //     depthTest: false
  //   })
  //   let mesh = new THREE.Sprite(material)
  //   mesh.scale.set(scale * 2, scale * 2, 1)
  //   return mesh
  // }
  //
  // animatePoints (meshGroup) {
  //   let t = 300
  //   meshGroup.children.forEach(item => {
  //     let scale = item.scale
  //     let tweenA = new TWEEN.Tween(scale).to({x: scale.x * 0.8, y: scale.y * 0.8}, 500).delay(100)
  //     let tweenB = new TWEEN.Tween(scale).to({x: scale.x * 1.2, y: scale.y * 1.2}, 500).delay(100)
  //     tweenA.chain(tweenB)
  //     tweenB.chain(tweenA)
  //     tweenA.start(t = t + 100)
  //   })
  //
  // }

  bindEvent () {
    let raycaster = new THREE.Raycaster()

    const eventHandler = event => {
      if (this.isShowModaling) return

      let mouse = new THREE.Vector2()

      // 通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
      if (this.media === 'pc') {
        event.preventDefault()
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
      } else {
        mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1
      }
      raycaster.setFromCamera(mouse, this.camera)

      let intersects = raycaster.intersectObjects(this.spriteGroup.children)
      if (intersects.length > 0) {
        this.showModal(intersects[0].object.name)
        if (intersects[0].object.name === 'doorCover') {
          console.log('door')
        }
      }
    }

    if (this.media === 'pc') {
      document.addEventListener('click', eventHandler, false)
    } else {
      document.addEventListener('touchstart', eventHandler, {passive: true})
    }
  }

  initModal () {
    const modal = document.querySelector('.md-modal')
    const main = document.querySelector('.md-main')
    const content = modal.querySelector('.md-content')
    const close = modal.querySelector('.md-close')

    function removeModal () {
      modal.classList.remove('md-show')
      this.isShowModaling = false
    }

    close.addEventListener('click', ev => {
      ev.stopPropagation()
      removeModal.call(this)
    })
    this.showModal = name => {
      let tmp = this.buttonList.filter(item => item.name === name)
      main.className = 'md-main'
      content.innerHTML = tmp[0].desc
      modal.classList.add('md-show')
      this.isShowModaling = true
    }
  }

  initRenderer () {
    let renderer = this.renderer = new THREE.WebGLRenderer({logarithmicDepthBuffer: true, antialias: true})
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.sortObjects = false
    renderer.autoClear = false
    this.el.appendChild(renderer.domElement)
  }

  animate () {
    this.render()
    requestAnimationFrame(() => { this.animate() })
  }

  render () {
    TWEEN.update()

    const {position} = this.state

    if (this.state.gyro) {
      this.controls.update()
    } else {
      //计算出当前目标朝向的弧度值
      position.lat = THREE.Math.clamp(position.lat, -89.99, 89.99)
      position.phi = THREE.Math.degToRad(90 - position.lat)
      position.theta = THREE.Math.degToRad(position.lon)

      //计算出当前相机的朝向的位置
      this.camera.target.x = 100 * Math.sin(position.phi) * Math.cos(position.theta)
      this.camera.target.y = 100 * Math.cos(position.phi)
      this.camera.target.z = 100 * Math.sin(position.phi) * Math.sin(position.theta)
      this.camera.lookAt(this.camera.target)
    }
    this.bottle.update(500 * this.clock.getDelta())
    this.renderer.render(this.scene, this.camera)
  }

  initGUI (circle, name) {
    let {guiParams} = this
    let _this = this
    _this.gui.remember(this.guiParams)

    let folderPoi = this.gui.addFolder(name)
    folderPoi.add(guiParams, 'pointX', -100, 30).step(0.1).onChange(function (value) {
      circle.position.x = value
    }).listen()

    folderPoi.add(guiParams, 'pointY', -100, 30).step(0.1).onChange(function (value) {
      circle.position.y = value
    }).listen()

    folderPoi.add(guiParams, 'pointZ', -100, 30).step(0.1).onChange(function (value) {
      circle.position.z = value
    }).listen()

    folderPoi.add(guiParams, 'Rx', -Math.PI, Math.PI).step(0.1).onChange(function (value) {
      circle.rotation.x = value
    }).listen()

    folderPoi.add(guiParams, 'Ry', -Math.PI, Math.PI).step(0.1).onChange(function (value) {
      circle.rotation.y = value
    }).listen()

    folderPoi.add(guiParams, 'Rz', -Math.PI, Math.PI).step(0.1).onChange(function (value) {
      circle.rotation.z = value
    }).listen()

    // folderPoi.open()
  }

  // img, 宽， 高，位置，角度
  addChoreAll (pUrl, w, h, pPos, pE, name) {
    let circleTexture = new Image()
    circleTexture.setAttribute('crossOrigin', 'anonymous')
    circleTexture.src = pUrl

    // let texture = new THREE.Texture(canvas)
    let circleGeo = new THREE.PlaneGeometry(w, h, 32)
    let texture = new THREE.TextureLoader().load(pUrl)

    if (name === 'light') {
      this.bottle = new TextureAnimator(texture, 2, 1, 2, 200)
    }

    let circleMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      opacity: 1.0,
      depthTest: false,
      transparent: true
    })

    // canvas 作为texture 必须要开启needsUpdate, 性能极差
    // texture.needsUpdate = true

    let {circle} = this
    circle = new THREE.Mesh(circleGeo, circleMat)
    circle.name = name
    circle.position.set(pPos.x, pPos.y, pPos.z)

    pE.x && (circle.rotation.x = pE.x)
    pE.y && (circle.rotation.y = pE.y)
    pE.z && (circle.rotation.z = pE.z)

    circle.scale.set(10, 10, 10)
    this.spriteGroup.add(circle)
    this.initGUI(circle, name)
  }

  // 初始化鼠标事件
  initTouch () {
    let {position, mouse, gyro, autoMove, timeout} = this.state
    let settings = this.settings
    let that = this

    // 绑定鼠标事件
    if (this.media === 'pc') {
      this.el.addEventListener('mousedown', onDocumentMouseDown, false)
    } else {
      //绑定移动端拖拽
      this.el.addEventListener('touchstart', onDocumentMouseDown, false)
    }

    function onDocumentMouseDown (event) {

      //判断是否开启了陀螺仪
      if (gyro) return
      event.preventDefault()
      autoMove = false

      //判断当前的设备类型
      if (that.media === 'pc') {
        mouse.onMouseDownMouseX = event.clientX
        mouse.onMouseDownMouseY = event.clientY
      } else {
        mouse.onMouseDownMouseX = event.touches[0].clientX
        mouse.onMouseDownMouseY = event.touches[0].clientY
      }

      //如果是第一个手指，将记录当前的lon和lat
      if (that.media === 'pc' || event.touches.length === 1) {
        mouse.onMouseDownLon = position.lon
        mouse.onMouseDownLat = position.lat
      }

      //绑定移动和抬起事件
      if (that.media === 'pc') {
        document.addEventListener('mousemove', onDocumentMouseMove, false)
        document.addEventListener('mouseup', onDocumentMouseUp, false)
      } else {
        if (event.touches.length === 1) {
          document.removeEventListener('touchmove', onTwoTouchMove, false)
          document.addEventListener('touchmove', onDocumentMouseMove, false)
          document.addEventListener('touchend', onDocumentMouseUp, false)
        } else if (event.touches.length === 2) {
          //获取第二个手指的位置
          mouse.onTwoTouchX = event.touches[1].clientX
          mouse.onTwoTouchY = event.touches[1].clientY
          //存储按下时的fov值
          mouse.onMouseDownFov = position.fov
          //清除第一个事件
          document.removeEventListener('touchmove', onDocumentMouseMove, false)
          //添加两指的拖拽事件
          document.addEventListener('touchmove', onTwoTouchMove, false)
        }
      }

    }

    function onDocumentMouseMove (event) {
      if (autoMove === false) {

        let moveX, moveY
        if (that.media === 'pc') {
          moveX = event.clientX
          moveY = event.clientY

          position.lon = (mouse.onMouseDownMouseX - moveX) * 0.1 * that.camera.fov / 100 + mouse.onMouseDownLon
          position.lat = (moveY - mouse.onMouseDownMouseY) * 0.1 * that.camera.fov / 100 + mouse.onMouseDownLat
        } else {
          moveX = event.targetTouches[0].clientX
          moveY = event.targetTouches[0].clientY

          position.lon = (mouse.onMouseDownMouseX - moveX) * 0.1 * that.camera.fov / 50 + mouse.onMouseDownLon
          position.lat = (moveY - mouse.onMouseDownMouseY) * 0.1 * that.camera.fov / 50 + mouse.onMouseDownLat
        }

      }
    }

    // todo 暂时不做处理，引入 dop 后再处理
    function onTwoTouchMove (event) {
      if (event.touches.length === 1) return
      //首先计算出按下时两个手指的距离
      let downDistance = dop.getRange(mouse.onMouseDownMouseX, mouse.onMouseDownMouseY, mouse.onTwoTouchX, mouse.onTwoTouchY)

      //然后计算出移动后的两指的距离
      let moveDistance = dop.getRange(event.touches[0].clientX, event.touches[0].clientY, event.touches[1].clientX, event.touches[1].clientY)

      //最后计算一下当前的fov
      that.setSceneFov((downDistance - moveDistance) / 5 + mouse.onMouseDownFov)
    }

    function onDocumentMouseUp (event) {

      //清楚原来的延迟器
      clearTimeout(timeout)

      //清楚默认的移动和抬起事件
      document.removeEventListener('mousemove', onDocumentMouseMove, false)
      document.removeEventListener('mouseup', onDocumentMouseUp, false)
      document.removeEventListener('touchmove', onDocumentMouseMove, false)
      document.removeEventListener('touchmove', onTwoTouchMove, false)
      document.removeEventListener('touchend', onDocumentMouseUp, false)

      //设置新的定时器
      timeout = setTimeout(function () {
        autoMove = true
      }, settings.timeDelay)

    }
  }

  destroy () {
    this.scene.dispose()
    for (let i = 0; i < this.el.children.length; i++) {
      this.el.removeChild(this.el.children[i])
    }
  }
}

/*
* gif 贴图不能显示gif 的动画，用序列帧代替
*
* */
