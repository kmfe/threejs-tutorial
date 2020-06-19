## PIXI 常用方法 

- 创建texture 的n种方式

```javascript
// 1. 纹理缓存中创建texture
let texture = PIXI.utils.TextureCache.imgAlias

// 2. resource中创建
let texture2 = PIXI.loader.resources.imgAlias.texture

// 3. 从图片中创建纹理
let texture3 = new PIXI.Texture.from(imgPath)


```

- 创建 Sprite

