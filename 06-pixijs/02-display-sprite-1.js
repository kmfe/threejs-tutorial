const options = {
	width: 615,
	height: 505,
	transparent: true
}

const app = new PIXI.Application(options)
const playground = document.getElementById('px-render')
playground.appendChild(app.view)

// 1. 将图片加载到纹理缓存中
// 纹理生成之后，通过纹理创建 精灵

const TextureCache = PIXI.utils.TextureCache
const loader = PIXI.Loader.shared
const planeGroup = new PIXI.Container()

loader
.add('bg', './assets/army/gameBackground.png')
.add('darkPlane', './assets/army/plane_darkBlue.png')
.add('lightPlane', './assets/army/plane_lightBlue.png')
.load(setup)

function setup () {
	let bg = new PIXI.Sprite(
		loader.resources['bg'].texture
	)
	
	// 注意用法
	let darkPlane = new PIXI.Sprite(
		new PIXI.Texture(PIXI.utils.TextureCache['darkPlane'])
	)
	darkPlane.position.set(100, 100)
	
	let lightPlane = new PIXI.Sprite(
		loader.resources['lightPlane'].texture
	)
	
	lightPlane.width = 40
	lightPlane.height = 60
	lightPlane.position.set(200, 200)
	lightPlane.anchor.set(0.5, 0.5)
	lightPlane.rotation = Math.PI / 2
	
	planeGroup.addChild(darkPlane)
	planeGroup.addChild(lightPlane)
	
	app.stage.addChild(bg)
	app.stage.addChild(planeGroup)
	
	// 2. 直接通过url创建精灵
	const redPlane = PIXI.Sprite.from('./assets/army/plane_red.png')
	app.stage.addChild(redPlane)
	
}

const removeBtn = document.querySelector('.removePlane')

removeBtn.addEventListener('click', () => {
	app.stage.removeChild(planeGroup)
}, false)
