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
	const list = PIXI.utils.TextureCache['list']
	
	const listTexture = new PIXI.Texture(list)
	listTexture.frame = new PIXI.Rectangle(0,0, 74, 140)
	const firstSprite = new PIXI.Sprite(listTexture)
	
	const listTexture2 = new PIXI.Texture(list)
	listTexture2.frame = new PIXI.Rectangle(74,0, 74, 140)
	const secondSprite = new PIXI.Sprite(listTexture2)
	secondSprite.position.set(200, 200)
	
	app.stage.addChild(firstSprite)
	app.stage.addChild(secondSprite)
}

