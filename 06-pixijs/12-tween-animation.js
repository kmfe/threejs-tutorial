const options = {
	width: 605,
	height: 500
}

const app = new PIXI.Application(options)
const playground = document.querySelector('#px-render')
playground.appendChild(app.view)

// 缩放，位移等

const loader = new PIXI.Loader()
let planeSprite = null
let transform = {}
let tween = null

loader
.add('gameBackground', './assets/army/gameBackground.png')
.add('plane', './assets/army/plane_red.png')
.load(setup)

function setup () {
	const {gameBackground, plane} = loader.resources
	const background = new PIXI.Sprite(gameBackground.texture)
	planeSprite = new PIXI.Sprite(plane.texture)
	planeSprite.anchor.set(0.5)
	
	transform = {
		x: planeSprite.width / 2,
		y: planeSprite.height / 2,
		rotation: 0,
		scale: 1
	}
	
	// console.log(transform, planeSprite,  '---')
	
	planeSprite.x = transform.x
	planeSprite.y = transform.y
	
	planeSprite.rotation = transform.rotation
	
	planeSprite.scale.set(transform.scale, transform.scale, transform.scale)
	
	app.stage.addChild(background)
	app.stage.addChild(planeSprite)
	
	const playBtn = new PIXI.Text()
	playBtn.text = 'Play'
	playBtn.x = app.renderer.view.width / 2
	playBtn.y = app.renderer.view.height - 60
	
	app.stage.addChild(playBtn)
	
	playBtn.interactive = true
	playBtn.buttonMode = true
	
	playBtn.on('pointerdown', playHandler)
}

function playHandler () {
	tween = new TWEEN.Tween(transform)
	.to({x: 200, y: 200}, 1000)
	.easing(TWEEN.Easing.Bounce.Out)
	.onUpdate(updateHandler)
	
	let rotateTween = new TWEEN.Tween(transform)
	.to({rotation: Math.PI * 2})
	.easing(TWEEN.Easing.Bounce.Out)
	.onUpdate(updateHandler)
	
	let scaleTween = new TWEEN.Tween(transform)
	.to({scale: 2})
	.easing(TWEEN.Easing.Bounce.Out)
	.onUpdate(updateHandler)
	
	tween.chain(rotateTween)
	rotateTween.chain(scaleTween)
	
	tween.start()
	
	scaleTween.onComplete(res => {
		console.log(res)
		console.log('done')
		app.stage.removeChild(planeSprite)
	})
	
	function updateHandler (object) {
		planeSprite.x = object.x
		planeSprite.y = object.y
		planeSprite.rotation = object.rotation
		planeSprite.scale.set(object.scale, object.scale)
	}
}

animate()

function animate () {
	requestAnimationFrame(animate)
	TWEEN.update()
}

// 操作

const startBtn = document.querySelector('.start-btn')
const stopBtn = document.querySelector('.stop-btn')

startBtn.addEventListener('click', () => {
	console.log('start')
	tween.start()
})

stopBtn.addEventListener('click', () => {
	console.log('stop')
	tween.stop()
})

