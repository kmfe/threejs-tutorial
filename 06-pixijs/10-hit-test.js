const options = {
	width: 615,
	height: 505,
	transparent: false
}

const app = new PIXI.Application(options)
const playground = document.querySelector('#px-render')
playground.appendChild(app.view)

