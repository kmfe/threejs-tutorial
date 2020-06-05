const options = {
	width: 615,
	height: 505
}

const app = new PIXI.Application(options)
const playground = document.querySelector('#px-render')
playground.appendChild(app.view)


// rectangle
const rectangle = new PIXI.Graphics()
rectangle.beginFill(0X66CCFF)
rectangle.lineStyle(4, 0XFF3300, 1)
rectangle.drawRect(20, 20, 100, 100)
rectangle.endFill();

rectangle.x = 150
rectangle.y = 150

app.stage.addChild(rectangle)

// circle

const circle = new PIXI.Graphics()
circle.beginFill(0X9966FF)
circle.drawCircle(0, 0, 32)
circle.endFill()
circle.x = 64
circle.y = 130

app.stage.addChild(circle)

// Ellipse
const ellipse = new PIXI.Graphics()
ellipse.beginFill(0XFFFF00)
ellipse.drawEllipse(0, 0, 50, 20)
ellipse.endFill()

ellipse.x = 180
ellipse.y = 130

app.stage.addChild(ellipse)

// roundedRect
const roundBox = new PIXI.Graphics()
roundBox.lineStyle(2, 0X99CCFF, 1)
roundBox.beginFill(0xff99933)
roundBox.drawRoundedRect(0, 0, 84, 36, 4)
roundBox.endFill()

roundBox.x = 48
roundBox.y = 190

app.stage.addChild(roundBox)

// line
const line = new PIXI.Graphics()
line.lineStyle(2, 0xffffff, 1)
line.moveTo(0, 0)
line.lineTo(80, 50)
line.x = 32
line.y = 32
app.stage.addChild(line)

// polygon

let path = [
	-32, 64,
	32, 64,
	0, 0
]

const triangle = new PIXI.Graphics()
triangle.beginFill(0X66FF33)
triangle.drawPolygon(path)
triangle.endFill()

triangle.x = 320
triangle.y = 320
app.stage.addChild(triangle)

