const app = new PIXI.Application({
	width: 514,         // default: 800
	height: 514,        // default: 600
	antialias: true,    // default: false
	transparent: false, // default: false
	resolution: window.devicePixelRatio,        // default: 1
	forceCanvas: true
})

app.renderer.backgroundColor = 0X000000

// 修改stage的大小
app.renderer.autoResize = true
app.renderer.resize(556, 556)

/*
* PIXI 精灵
* PIXI拥有一个精灵类来创建游戏精灵，有三种主要方法创建它
* 1. 单图片文件
* 2. 用雪碧图来创建，雪碧图是一个放入游戏所需的所有图像的大图
* 3. 从一个纹理贴图集中创建（纹理贴图就是用json定义了图像大小和位置的雪碧图）
* */

function init () {
	/*
	* 将图片加载到纹理中
	* PIXI用webGL和GPU来渲染图像，所以图像需要转化成GPU可以处理的版本，可以被GPU处理的图像被称为 纹理
	* 在你让精灵显示图片之前，需要将普通的图片转化成WebGL纹理，为了让工作执行快速有效率，PIXI使用 纹理缓存 来储存和引用所有精灵需要的纹理
	*
	* PIXI.utils.TextureCache('images/cat.png')
	* let texture = PIXI.utils.TextureCache('images/anySpriteImage.png')
	* let sprite = new PIXI.Sprite(texture)
	*
	* 加载图片
	* PIXI.loader
	* .add('images/anyImage.png')
	* .load(setup)
	*
	* function setup(){
	*   // This code will run when the loader has finished loading the image
	* }
	*
	* */
	
	// 暂存三个sprite
	let lightBluePlane, darkBluePlane, redPlane, gameState
	let direction = 0.01
	PIXI.loader
	.add([
		'./assets/army/plane_red.png',
		'./assets/army/plane_darkBlue.png',
		'./assets/army/plane_lightBlue.png'
	])
	.load(setup)
	
	function play (delta) {
		lightBluePlane.vx += 0.01
		lightBluePlane.vy += direction
		
		if (lightBluePlane.vy >= 1) {
			direction = -direction
		}
		
		lightBluePlane.x += lightBluePlane.vx
		lightBluePlane.y -= lightBluePlane.vy
	}
	
	function gameLoop (delta) {
		gameState(delta)
	}
	
	function setup () {
		redPlane = new PIXI.Sprite(
			PIXI.loader.resources['./assets/army/plane_red.png'].texture
		)
		
		lightBluePlane = new PIXI.Sprite(
			PIXI.loader.resources['./assets/army/plane_lightBlue.png'].texture
		)
		
		darkBluePlane = new PIXI.Sprite(
			PIXI.loader.resources['./assets/army/plane_darkBlue.png'].texture
		)
		
		// lightBluePlane.position.set(x, y)
		lightBluePlane.x = 120
		lightBluePlane.y = 120
		
		lightBluePlane.vx = 0
		lightBluePlane.vy = 0
		
		// lightBluePlane.width = 20
		// lightBluePlane.height = 20
		
		// lightBluePlane.anchor.x = 0.5
		// lightBluePlane.anchor.y = 0.5
		
		lightBluePlane.scale.set(0.5, 0.5)
		
		lightBluePlane.rotation = Math.PI * 1.888
		
		gameState = play
		app.ticker.add(delta => gameLoop(delta))
		
		app.stage.addChild(redPlane)
		app.stage.addChild(lightBluePlane)
		app.stage.addChild(darkBluePlane)
		
		// 移除
		app.stage.removeChild(darkBluePlane)
		
		// 隐藏sprite
		// lightBluePlane.visible = false
	}
	
	document.body.appendChild(app.view)
	console.log(app.renderer.view.width, 'app.renderer.view.width')
	
}

window.onload = init
