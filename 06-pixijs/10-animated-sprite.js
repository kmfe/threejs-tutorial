const options = {
	width: 615,
	height: 505,
	transparent: true
}

const app = new PIXI.Application(options)
const playground = document.querySelector('#px-render')
playground.appendChild(app.view)

const loader = PIXI.Loader.shared

loader
.add('list', './assets/list.png')
.load(setup)

function setup () {
	const base = PIXI.utils.TextureCache['list']
	let texture0 = new PIXI.Texture(base)
	texture0.frame = new PIXI.Rectangle(0, 0, 80, 140)
	
	let texture1 = new PIXI.Texture(base)
	texture1.frame = new PIXI.Rectangle(80, 0, 80, 140)
	
	let texture2 = new PIXI.Texture(base)
	texture2.frame = new PIXI.Rectangle(160, 0, 80, 140)
	
	let texture3 = new PIXI.Texture(base)
	texture3.frame = new PIXI.Rectangle(240, 0, 80, 140)
	
	// 创建纹理数组
	const textures = [texture0, texture1, texture2, texture3]
	const animatedSprite = new PIXI.AnimatedSprite(textures)
	animatedSprite.animationSpeed = 0.1
	animatedSprite.play()
	app.stage.addChild(animatedSprite)
}

/*
* const obj = new PIXI.AnimatedSprite(textures, autoUpdate)
* 返回的animatedSprite 具有以下属性及方法
*
* obj.animationSpeed 播放速度
* obj.currentFrame 当前帧编号
*
* obj.play()
* obj.gotoAndPlay()
* obj.stop()
*
* 参考文档
* [https://segmentfault.com/a/1190000017877760](动画精灵)
* [http://pixijs.download/release/docs/PIXI.AnimatedSprite.html](官方文档)
* */
