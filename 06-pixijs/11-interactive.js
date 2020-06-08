const options = {
	width: 615,
	height: 505,
	transparent: false
}

const app = new PIXI.Application(options)
const playground = document.getElementById('px-render')
playground.appendChild(app.view)

// 测试interactive

// 任意增加图形
const circle = new PIXI.Graphics()
circle.beginFill(0XFF6600)
circle.drawCircle(40, 40, 20)
circle.endFill()

circle.interactive = true
circle.buttonMode = true
circle.on('pointerdown', circleClick)
app.stage.addChild(circle)

function circleClick () {
	circle.scale.x *= 1.05
	circle.scale.y *= 1.05
}

const line = new PIXI.Graphics()
line.lineStyle(2, 0XFFFFFF, 1)
line.moveTo(40, 40)
line.lineTo(120, 120)
app.stage.addChild(line)

// 增加sprite
const loader = new PIXI.Loader()
let plane = null
loader
.add('plane', './assets/army/plane_red.png')
.load(setup)

function setup () {
	const texture = loader.resources['plane'].texture
	plane = new PIXI.Sprite(texture)
	plane.x = 200
	plane.y = 200
	app.stage.addChild(plane)
	
	plane.interactive = true
	plane.buttonMode = true
	plane.on('pointerdown', onClick)
}

function onClick () {
	plane.x += 5
	plane.y += 5
}
