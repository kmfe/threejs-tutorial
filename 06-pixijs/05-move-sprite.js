/*
* app.ticker 游戏循环
* */
const options = {
	width: 500,
	height: 500
}

const app = new PIXI.Application(options)
const playground = document.querySelector('#px-render')
playground.appendChild(app.view)

// move sprite

const loader = PIXI.Loader.shared
let redPlane = null

loader
.add('redPlane', './assets/army/plane_red.png')
.load(setup)

function setup () {
	const redPlaneTexture = loader.resources['redPlane'].texture
	redPlane = new PIXI.Sprite(redPlaneTexture)
	app.stage.addChild(redPlane)
	redPlane.position.y = redPlane.height / 2
	
	// 添加速度属性
	redPlane.vx = 1
	redPlane.anchor.set(0.5, 0.5)
	app.ticker.add(delta => gameLoop(delta))
}

function gameLoop () {
	// requestAnimationFrame(gameLoop)
	redPlane.position.x += redPlane.vx
	
	if (redPlane.position.x > app.renderer.width || redPlane.position.x < 0) {
		redPlane.vx = -redPlane.vx
	}
	redPlane.rotation += 0.01
}

// gameLoop()
