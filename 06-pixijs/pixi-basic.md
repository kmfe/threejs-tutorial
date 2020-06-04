## PIXI

    PIXI 中的几个概念
    
    应用 application: 实例化PIXI对象
    
    画布  renderer：控制canvas 对象的大小，缩放，分辨等操作
    
    舞台(根容器)  stage：根容器，存放一切展示对象
    
    精灵  sprite: 游戏精灵，stage 上的展示对象，可以通过 单图像文件，雪碧图，纹理贴图三种方式创建
    
    几何图形 graph
    
    容器 container
      
```javascript

// 创建Pixi应用

const options = {
    width: 256,
    height: 256,
    transparent: false,
    resolution: 1
}
let app = new PIXI.Application(options)

document.body.appendChild(app.view)

// 画布
app.renderer.view.width = 100
app.renderer.view.height = 100

app.renderer.backgroundColor = 0x061639
app.renderer.resize(512, 512)

// 设置canvas的样式
app.renderer.view.style.position = 'absolute'
app.renderer.view.style.display = 'block'

```
    
#### positioning sprite

```javascript
let x = 90
let y = 90
sprite.x = x
sprite.y = y

sprite.position.set(x, y)

```

#### sprite size and scale

```javascript
sprite.width = 90
sprite.height =90

sprite.scale.x = 1.2
sprite.scale.y = 1.2

sprite.scale.set(1.4, 1.4)
```

#### sprite rotation

```javascript
sprite.rotation = 0.5

// 左上角为锚点，也算旋转中心的坐标
sprite.anchor.x = 0.5
sprite.anchor.y = 0.5
sprite.anchor.set(x, y)

```

#### make a sprite from a tileset sub-image

从雪碧图中截取来创建精灵的纹理

```javascript
let texture = TextureCache['images/tileset.png']

// 创建rectangle 截取区域
// Rectangle(x, y, width, height)

let rectangle = new Rectangle(192, 128, 64, 64)
texture.frame = rectangle

let rocket = new Sprite(texture)
rocket.x = 32
rocket.y = 32

app.stage.addChild(rocket)
renderer.render(stage)

```

#### using a texture atlas
使用贴图集，很大很复杂的游戏一般会用纹理贴图集，专门的工具会生成贴图json

#### loading the texture atlas 

```javascript
loader
  .add('./images/treasureHunter.json')
  .load(setup)

  // 1. 使用TextureCache

  let texture = TextureCache['frameId.png'];
  let sprite = new Sprite(texture);
 
  // 2. 如果你是使用的 loader来加载纹理贴图集, 使用loader的 resources:
  let sprite = new Sprite(
    resources["images/treasureHunter.json"].textures["frameId.png"]
  );

  // 3. 要创建一个精灵需要输入太多东西了! 所以我建议你给纹理贴图集的textures对象创建一个叫做id的别名，象是这样：
  let id = PIXI.loader.resources["images/treasureHunter.json"].textures;
      
  // 现在你就可以像这样实例化一个精灵了：
  let sprite = new Sprite(id["frameId.png"]);

```

#### creating sprites from a loaded texture atlas

#### moving sprites

移动精灵，可以使用Pixi 中的ticker, 也被称为游戏循环，任何在游戏循环里的代码都会1秒更新60次

#### using velocity properties

给每个sprite 增加速度属性

#### game states

模块化代码，将不同的游戏状态保存起来，方便调用，demo

#### keyboard movement

#### grouping sprites

Container 对象用来给sprite编组

```javascript

const group =  new PIXI.Container()

group.addChild(cat)
group.addChild(dog)
group.addChild(tiger)

app.stage.addChild(group)

```

#### local and global positions

当你往某个Container中添加一个sprite时，它的x,y的位置是相对分组的左上角的，这是sprite的局部位置,
sprite的全局位置，指该sprite相对于stage 左上角的位置

下面是几种获取全局位置的api
```javascript
// 该sprite的父级 sprite.parent
sprite.parent.toGlobal(sprite.position)

// 直接获取
sprite.getGlobalPosition().x
sprite.getGlobalPosition().y

// 获取相对位置, 第二个参数是相对的sprite
sprite.toLocal(sprite.position, anyOtherSprite)


```


#### using a particleContainer to group sprites



#### 引用
[PIXI基础中文教程](https://github.com/Zainking/learningPixi)
