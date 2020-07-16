# Matter.js 文档

- Engine, World

`Matter.Engine` 模块包含了创建和处理引擎的方法，引擎是负责管理和更新模拟世界的控制器，引擎可以控制时间的缩放，可以检测所有的碰撞事件，并且拿到所有碰撞的物体对 (pairs)

`Matter.World` 是任何物体的存放处，物体必须添加到world中，然后由Engine运行这个世界。

![MatterJS_EngineAndWorld](https://misc.aotu.io/ONE-SUNDAY/MatterJS/MatterJS_EngineAndWorld.jpg)

```javascript
const engine = Matter.Engine.create()

const render = Matter.Render.create({
  element: document.body,
  engine: engine,
  options: options
})

Matter.Engine.run(engine)
Matter.Render.run(render)
```

`Matter.Render` 是将实例渲染到Canvas中的渲染器，控制视图层的样式，主要作用是开发和调试，默认情况 `Matter.Render`将只显示物体的轮廓（wireFrames）,可以在options中配置渲染方式，绘图选项，重力，阻力，sprite和视窗功能。

- Matter.Body 

物理引擎中的刚体，是指在运动中和受力作用后，形状和大小不变。每个物体都有自己的物理属性，质量、速度、摩擦力、角度等，还可以设置刚体的标记，`Matter.Bodies`模块中内置了几种刚体，`Matter.rectangle`, `Matter.polygon`，`Matter.circle`, `Matter.trapezoid`等

- Matter.Composite 

由刚体和复合材料通过 约束 组合在一起的就叫复合体，复合体对外当做一个刚体，
复合体的物理属性时通过包含的刚体的属性综合计算出来的。`Matter.Composite` 模块包含用于创建和处理复合体的方法，
另外，`Matter.Composites`模块提供了几种特别的符合材料，
如 链`Composites.chain`，牛顿摆球 `Composites.newtonsGradle`，软体 `Composites.softBody`，
汽车 `Composites.car` ，网格 `Composite.mesh`，金字塔 `pyramid`
堆叠 `Composites.stack`等等



- Matter.Constraint

约束可以理解为 通过一条线，将刚体A 和 刚体B 连接起来，被约束的两个刚体由于被连接在一起，移动就相互收到限制。`Matter.Constraint`模块包含了用于创建和处理约束的方法，这个约束可以宽松，可以紧绷，还可以定义约束的距离，约束具有弹性，可以用来当做橡皮筋。

![MatterJS_Constraint](https://misc.aotu.io/ONE-SUNDAY/MatterJS/MatterJS_Constraint.jpg)

- Matter.MouseConstraint

如果你想刚体和用户之间有交互，那就要在鼠标和刚体之间建立连接，也就是鼠标和刚体之间的约束，`Matter.MouseContraint` 模块包含用于鼠标约束的方法，提供通过鼠标或触摸移动刚体的能力，可以设置什么标记的物体才能被鼠标操作，创建约束后，可以获取鼠标的各类事件。

```javascript
const mouseConstraint = Matter.MouseConstraint.create({
  element: render.canvas
})
Matter.World.add(engine.world, mouseConstraint)

// 设置某个标记的物体可以被操作
const categoryBall = 0X0001

const ball = Matter.Bodies.circle(300, 320, 32, {
  density: 0.68, // 密度
  restitution: 1, // 弹性 0~1
  /*
   碰撞配置有三种属性 group, category, mask
   group 相等的情况下，如果任意group > 0 则两者始终碰撞，group < 0, 大家永远不会碰撞，
   group 不相等的情况下(或某一个值为0)，根据category和mask进行判定
   
   category 属性为16进制数字，默认0X0001，其值只能是2的幂数，如0X0002,0X0004
   
   举例： A物体的category 为0X0002, B物体的category = 0X0004, 
   C物体如果要与A物体碰撞则其 mask值应该为A的category值，即0X0002, 
   C物体如果要与B物体碰撞，其mask值应为B的category值，即 0X0004
   C物体如果要与A,B物体同时碰撞，其mask 值必须包含A,B的category值，即 0X0002|0X0004
   category 必须与mask配合使用才会生效，因为mask默认值包含了所有的category, 默认可与所有物体碰撞。
  */
  collisionFilter: {
    caategory: categoryBll
  }
})

const mouseConstraint = MouseContraint.create({
  element: render.canvas,
  collisionFilter: {
    mask: categoryBall
  }
})

Matter.World.add(engine.world, mouseContraint)
```

- Matter.Vector 

`Matter.Vector` 模块包含用于创建和操作向量的方法，向量是引擎有关几何操作行为的基础，修改物体的运动状态基础都是使用向量来控制，例如赋予物体一个力，或者设置物体的速度，旋转角度，并且内置了很多向量的求解函数：向量积、标量积、格式化，垂直向量等

- Matter.Events

  `Matter.Events` 模块包含了绑定、移除和触发对象的方法

  - 绑定事件 `Matter.Events.on(object, eventNames, callback)`
  - 移除事件 `Matter.Events.off(object, eventNames, callback)`
  - 触发事件 Matter.Events.trigger(object, eventNames, callback)
    

- Others

  - 施加力 

    Matter.applyForce(body, position, force) 可以给刚体施加一个力，传入X和Y轴需要的力度值
    ```javascript
    const ball = Matter.Bodies.circle(300, 300, 25, {
      density: 0.69,
      resititution: 0.8
    })
    Matter.World.add(engine.world, ball)

    function addForce(){
      const forceMagnitude = 0.02 * ball.mass
      Ball.applyForce(ball, ball.position, {
         x : (forceMagnitude + Common.random() * forceMagnitude) * Common.choose([1, -1]),
            y : -forceMagnitude + Common.random() * -forceMagnitude
      })
    }
    addForce()
    ```

  - 重力
    可以设置X， Y轴的重力值，默认都是1，参数在0，-1， 1中选择使用

    ```javascript
      engine.world.gravity.y = -1 // 反重力效果
      engine.world.gravity.y = 0 // 无重力效果
    ```

	- 睡眠状态

    通过`enableSleeping: true` 开启睡眠模式后，当刚体处于不受作用状态时，会进入睡眠状态，这样可以有效提高引擎性能，当物体被其他碰撞或者对刚体施加力时，刚体会被叫醒，引擎会继续对齐进行计算模拟。

    ```javascript
    const engine = Engine.create({
      enableSleeping: true
    })

    Event.on(ball, 'sleepStart', function(){
      World.remove(engine.world, ball)
    })
    ```

	- 摩擦力 friction, frictionAir, frictionStatic

    摩擦力在Matter.js中分别提供了三种，friction 摩擦力, frictionAir 空气阻力, frictionStatic 静止摩擦力。

    friction 默认为0.1，取值范围 [0, 1]，当值为0 意味着刚体可以无限滑动，当值为1 表示刚体施加力后会立即停止；

    fircitionAir 默认0.01, 取值范围[0, 1]，当值为0意味着刚体在空间中移动速度永远不会减慢，值越高时刚体在空间中移动速度越慢；

    firctionStatic 默认0.5, 当值为0时，意味着刚体几乎是静止的，值越高表示移动刚体所需的力越大

    ```javascript
    Bodies.rectangle(300, 70, 40, 40, {
    firction: 0.01
    })
    ```

	- 时间缩放 timeScale

    可以控制全局的时间，当值为0时冻结模拟，值为0.1给出慢动作效果，值为1.2 会给出加速效果`engine.timing.timeScale = 01.`

	- Debug 调试

    ```javascript
    const render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 800,
            height: 600,
            pixelRatio: 1, // 设置像素比
            background: '#fafafa', // 全局渲染模式时背景色
            wireframeBackground: '#222', // 线框模式时背景色
            hasBounds: false,
            enabled: true,
            wireframes: true, // 线框模式
            showSleeping: true, // 刚体睡眠状态
            showDebug: false, // Debug 信息
            showBroadphase: false, // 粗测阶段
            showBounds: false, // 刚体的界限
            showVelocity: false, // 移动刚体时速度
            showCollisions: false, // 刚体碰撞点
            showSeparations: false, // 刚体分离
            showAxes: false, // 刚体轴线
            showPositions: false, // 刚体位置
            showAngleIndicator: false, // 刚体转角指示
            showIds: false, // 显示每个刚体的 ID
            showVertexNumbers: false, // 刚体顶点数
            showConvexHulls: false, // 刚体凸包点
            showInternalEdges: false, // 刚体内部边界
            showMousePosition: false // 鼠标约束线
        }
    });
    ```
  
- 其他

		- 删除物体  World.remove(world, ball)