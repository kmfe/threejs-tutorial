import * as THREE from '../../libs/three.weapp.js'
import { OrbitControls } from '../../jsm/controls/OrbitControls'
let listener = null;

Page({
  data: {
    canvasId: null
  },
  onLoad: function () {
    wx.createSelectorQuery()
      .select('#c')
      .node()
      .exec((res) => {
        let canvasId = res[0].node._canvasId
        const canvas = THREE.global.registerCanvas(canvasId, res[0].node)

        this.setData({ canvasId })

        const camera = new THREE.PerspectiveCamera(70, canvas.width / canvas.height, 1, 1000);
        camera.position.z = 500;
        const scene = new THREE.Scene();
        // scene.background = new THREE.Color(0xAAAAAA);
        const renderer = new THREE.WebGLRenderer({ 
          antialias: true, 
          alpha: true
        });

        const controls = new OrbitControls(camera, renderer.domElement);
        // controls.enableDamping = true;
        // controls.dampingFactor = 0.25;
        // controls.enableZoom = false;
        camera.position.set(200, 200, 500);
        controls.update();
        const geometry = new THREE.BoxBufferGeometry(200, 200, 200);

        const texture = new THREE.TextureLoader().load('./pikachu.png');
        const material = new THREE.MeshBasicMaterial({ 
          color: '#cd0000'
          // map: texture 
        });

        // const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // renderer.setPixelRatio(wx.getSystemInfoSync().pixelRatio);
        // renderer.setSize(canvas.width, canvas.height);

        function onWindowResize() {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(canvas.width, canvas.height);
        }
        function render() {
          canvas.requestAnimationFrame(render);
          // mesh.rotation.x += 0.005;
          // mesh.rotation.y += 0.01;
          controls.update();
          renderer.render(scene, camera);
        }

        render()

      })
  },
  onUnload: function () {
    THREE.global.unregisterCanvas(this.data.canvasId)
  },
  touchStart(e) {
    console.log('canvas', e)
    THREE.global.touchEventHandlerFactory('canvas', 'touchstart')(e)
  },
  touchMove(e) {
    console.log('canvas', e)
    THREE.global.touchEventHandlerFactory('canvas', 'touchmove')(e)
  },
  touchEnd(e) {
    console.log('canvas', e)
    THREE.global.touchEventHandlerFactory('canvas', 'touchend')(e)
  },
  touchCancel(e) {
    // console.log('canvas', e)
  },
  longTap(e) {
    // console.log('canvas', e)
  },
  tap(e) {
    // console.log('canvas', e)
  },

  // 以下为摄像机逻辑

  stopListen(){
    listener.stop()
  },

  initDone() { 
    console.log('init done')
    this.listenFrame()
  },
  stopHander(){
    console.log('stop')
  },
  errorHander(){
    console.log('error')
  },

  listenFrame(){
    console.log('fuck--- 初始化成功');
    const context = wx.createCameraContext(this)

    listener = context.onCameraFrame(frame => {
      console.log(frame, '监听成功回调')
      console.log(frame.data instanceof ArrayBuffer, frame.width, frame.height)
    })

    listener.start({
      success: function () {
        console.log('listener start success')
      },
      fail: function () {
        console.log('listener start fail')
      }
    })
  },

  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  }
})