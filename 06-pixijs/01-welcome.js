const option = {
	width: 400,
	height: 300,
	autoDensity: true,
	transparent: true
}
// 创建一个PIXI应用
const app = new PIXI.Application(option)

// 获取渲染器
const renderer = app.renderer

// 图片精灵
let preview = null

// 置换图精灵
let displacementSprite = null

// 置换滤镜，就是选择另外一幅图片，让其在当前的图片产生凹凸效果
let displacementFilter = null
let stage = null

let playground = document.querySelector('#px-render')

function setScene (url) {
	// renderer.view 是PIXI创建的canvas
	playground.appendChild(app.view)
	stage = new PIXI.Container()
	
	// 根据图片的url 创建图片精灵
	// const texture = PIXI.utils.TextureCache[url]
	
	preview = PIXI.Sprite.from(url)
	
	// 创建置换图精灵，在创建置换滤镜时会用到这个精灵
	displacementSprite = PIXI.Sprite.from('./assets/sprite.png')
	
	// 设置置换图精灵为平铺模式
	displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT
	
	// 创建一个置换滤镜
	displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite)
	
	// 添加 置换图精灵 到舞台
	stage.addChild(displacementSprite)
	
	// 添加图片精灵到舞台
	stage.addChild(preview)
	
	// 把stage 添加到根容器上
	app.stage.addChild(stage)
}

// 置换图精灵的移动速度

let velocity = 2
let raf

function animate () {
	raf = requestAnimationFrame(animate)
	displacementSprite.x += velocity
	displacementSprite.y += velocity
}

setScene('./assets/view.jpg')

const start = document.querySelector('.start-btn')
const stop = document.querySelector('.stop-btn')

start.addEventListener('click', () => {
	stage.filters = [displacementFilter]
	animate()
}, false)

stop.addEventListener('click', () => {
	stage.filters = []
	cancelAnimationFrame(raf)
}, false)
