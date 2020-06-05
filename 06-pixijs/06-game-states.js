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

// 图片转化成texture
loader
.add('bg', './assets/army/gameBackground.png')
.add('redPlan', './assets/army/plane_red.png')
.add('darkBlue', './assets/army/plane_darkBlue.png')
.load(setup)

// 操作图片 —> 添加sprite
let gameState, redPlane, darkBluePlane

function setup () {
	console.log(loader.resources)
	const {bg, redPlan, darkBlue} = loader.resources
	const background = new Sprite(bg.texture)
	redPlane = new Sprite(redPlan.texture)
	darkBluePlane = new Sprite(darkBlue.texture)
	
	const planes = new PIXI.Container()
	planes.addChild(redPlane)
	darkBluePlane.position.set(100, 100)
	planes.addChild(darkBluePlane)
	
	redPlane.vx = 1
	redPlane.x = 100
	
	app.stage.addChild(background)
	app.stage.addChild(planes)
	gameState = play
	app.ticker.add(delta => gameLoop(delta))
}

// 添加运动及运动状态

function gameLoop (delta) {
	gameState(delta)
}

function play () {
	redPlane.vx = 1
	redPlane.x += redPlane.vx
}

function stop () {
	redPlane.vx = 0
}

// 操作运动
const startBtn = document.querySelector('.start-btn')
const stopBtn = document.querySelector('.stop-btn')
startBtn.addEventListener('click', () => {
	gameState = play
})

stopBtn.addEventListener('click', () => {
	gameState = stop
})
