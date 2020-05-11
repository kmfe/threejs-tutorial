## PIXI tips

#### 使用别名

> 对频繁使用Pixi对象和方法设置一些简略的可读性强的别名
```javascript
let Texture = PIXI.utils.TextureCache
let texture = Texture['./images/cat.png']

const Application = PIXI.Application
const loader = PIXI.loader
const resources = PIXI.loader.resources
const Sprite = PIXI.Sprite

const app = new Application({
  width: 700,
  height: 500 
})
document.body.appendChild(app.view)

```

#### 一些加载的其他知识

```javascript
let base = new PIXI.BaseTexture(anyImageObject),
    texture = new PIXI.Texture(base),
    sprite = new PIXI.Sprite(texture)

// 也可以从canvas 中创建纹理
``` 

#### 给加载的文件设置别名

```javascript
PIXI.loader.add('catImage', './images/cat.png')
let cat = new PIXI.Sprite(PIXI.loader.resources.catImage.texture)
```

#### 监听加载进程

```javascript
PIXI.loader.add([
  'images/one.png',
  'images/two'
])
.on('progress', loadProgressHandler)
.load(setup)

function loadProgressHandler(loader, resource){
  console.log('loading', loader, resource)
}
```

#### 一些加载器的其他知识

Pixi的加载器有很多可以设置的功能，add方法有四个基本参数 `add(name, url, optionObject, callbackFunction)`
所以add 方法也是可以使用对象的传值方式。


