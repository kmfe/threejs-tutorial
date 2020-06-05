const options = {
	width: 615,
	height: 505,
	transparent: true
}

const app = new PIXI.Application(options)
const playground = document.querySelector('#px-render')
playground.appendChild(app.view)

let textStyle = new PIXI.TextStyle({
	fontFamily: 'PingFang SC Regular',
	fontSize: 36,
	fill: '#F60',
	stroke: '#cd0000',
	strokeThickness: 4,
	dropShadow: true,
	dropShadowColor: "#000000",
	dropShadowBlur: 4,
	dropShadowAngle: -Math.PI / 8,
	dropShadowDistance: 16,
	
})
let msg = new PIXI.Text('Hello PIXI.js', textStyle)
msg.x = 100
msg.y = 100
msg.style = {
	wordWrap: true,
	wordWrapWidth: 160,
	align: 'center'
}
app.stage.addChild(msg)
