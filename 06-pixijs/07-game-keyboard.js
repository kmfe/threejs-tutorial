const options = {
	width: 615,
	height: 505
}

const app = new PIXI.Application(options)
const playground = document.querySelector('#px-render')
playground.appendChild(app.view)

// 创建精灵
const Sprite = PIXI.Sprite
const loader = PIXI.Loader.shared
const resources = loader.resources

function keyboard (value){
	let key = {}
	key.value = value
	key.isDown = false
	key.isUp = true
	key.press = undefined
	key.release = undefined
	
	// downHandler
	key.downHandler = event => {
		if (event.key === key.value){
			if (key.isUp && key.press) key.press()
			key.isDown = true
			key.isUp = false
			event.preventDefault()
		}
	}
	
	// upHandler
	key.upHandler = event => {
		if (event.key === key.value) {
			if(key.isDown && key.release) key.release()
			key.isDown = false
			key.isUp = true
			event.preventDefault()
		}
	}
	
	// attach event listeners
	const downListener = key.downHandler.bind(key)
	const upListener = key.upHandler.bind(key)
	
	window.addEventListener('keydown', downListener, false)
	window.addEventListener('keyup', upListener, false)
	
	// detach event listeners
	key.unsubscribe = () => {
		window.removeEventListener('keydown', downListener)
		window.removeEventListener('keyup', upListener)
	}
	
	return key
}

let redPlane, darkBluePlane, state;

loader
.add('bg', './assets/army/gameBackground.png')
.add('redPlan', './assets/army/plane_red.png')
.add('darkBluePlane', './assets/army/plane_darkBlue.png')
.load(setup)

function setup (){
	const bg = new Sprite(resources['bg'].texture)
	redPlane = new Sprite(resources['redPlan'].texture)
	darkBluePlane = new Sprite(resources['darkBluePlane'].texture)
	console.log(redPlane)
	redPlane.x = (app.renderer.width - redPlane.width) / 2
	redPlane.y = (app.renderer.height - redPlane.height) / 2
	redPlane.vx = 0
	redPlane.vy = 0
	
	app.stage.addChild(bg)
	app.stage.addChild(redPlane)
	
	// capture the keyboard arrow keys
	let left = keyboard('ArrowLeft'),
			up = keyboard('ArrowUp'),
			right = keyboard('ArrowRight'),
			down = keyboard('ArrowDown')
	
	// 左键
	left.press = () => {
		redPlane.vx = -2
		redPlane.vy = 0
	}
	
	left.release = () => {
		if (!right.isDown && redPlane.vy === 0){
			redPlane.vx = 0
		}
	}
	
	right.press = () => {
		redPlane.vx = 2
		redPlane.vy = 0
	}
	
	right.release = () => {
		redPlane.vx = 0
		redPlane.vy = 0
	}
	
	up.press = () => {
		redPlane.vx = 0
		redPlane.vy = -2
	}
	
	up.release = () => {
		redPlane.vx = 0
		redPlane.vy = 0
	}
	
	down.press = () => {
		redPlane.vx = 0
		redPlane.vy = 2
	}
	
	down.release = () => {
		redPlane.vx = 0
		redPlane.vy = 0
	}
	
	// set game state
	state = play
	app.ticker.add(delta => gameLoop(delta))
}

function gameLoop(delta) {
	state(delta)
}

function play (){
	redPlane.x += redPlane.vx
	redPlane.y += redPlane.vy
}
