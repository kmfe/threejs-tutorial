const options = {
	width: 500,
	height: 500
}

const app = new PIXI.Application(options)
const playground = document.querySelector('#px-render')
playground.appendChild(app.view)

// loader
const loader = PIXI.Loader.shared
loader
.add('./assets/tiles/tiles.json')
.load(setup)

function setup(){
	// 注意用法
	const textures = loader.resources['./assets/tiles/tiles.json'].textures
	
	const darkPlane = new PIXI.Sprite(textures['plane_darkBlue.png'])
	const lightPlane = new PIXI.Sprite(textures['plane_lightBlue.png'])
	const redPlane = new PIXI.Sprite(textures['plane_red.png'])
	lightPlane.position.set(100, 100)
	redPlane.position.set(200, 200)
	
	app.stage.addChild(darkPlane)
	app.stage.addChild(lightPlane)
	app.stage.addChild(redPlane)
}
