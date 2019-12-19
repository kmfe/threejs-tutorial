### 常见scene基本操作

    scene.add(obj)
    scene.remove(obj)
    scene.getObjectByName(name)
    scene.getObjectBuId(id)
    scene.traverse( obj => console.log(obj)) // 遍历子元素
    scene.background = '' 设置背景
    
### Mesh 操作
    
    obj.position.set(x, y, z)
    obj.position.x = x
    obj.scale.set(x, y, z)
    obj.scale.x = x
    obj.rotation.set(rad, rad, rad)
    
### 3d坐标和2d坐标转换

```javascript
// 3d => 2d
function getLocalPosition(point){
  const halfWidth = window.innerWidth / 2
  const halfHeight = window.innerHeight / 2
  const vector1 = point.project(this.camera.threeCamera)
  retutn [
    vector1.x * halfWidth + halfWidth, 
    -vector1.y * halfHeight + halfHeight
  ]
}

// 2d => 3d
function getFirstIntersectObj(event) {
    if (!event) {
      return
    }
    //通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
    this.raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
    this.raycaster.setFromCamera(mouse, this.camera.threeCamera)
    // 获取raycaster直线和所有模型相交的数组集合
    return this.raycaster.intersectObjects(this.scene.children, true)[0].point
}

```

### 渲染器 renderer

