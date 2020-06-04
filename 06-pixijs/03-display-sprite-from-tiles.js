const options = {
	width: 500,
	height: 500
}

const app = new PIXI.Application(options)
const playground = document.querySelector('#px-render')

playground.appendChild(app.view)

// 加载tiles images

const loader = PIXI.Loader.shared
loader
.add('list', './assets/list.png')
.load(setup)

function setup () {
	const listTexture = loader.resources['list'].texture
	listTexture.frame = new PIXI.Rectangle(0,0, 74, 140)
	const firstSprite = new PIXI.Sprite(listTexture)
	app.stage.addChild(firstSprite)
}

