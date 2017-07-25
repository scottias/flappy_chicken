FlappyGame.render = (function() {

	let context = null;

	let chk_images = [],
		layer_images = [],
		wire_image = {},
		title_image = {};

	function initialize(data) {
		context = data.canvas.getContext('2d');

		CanvasRenderingContext2D.prototype.clear = function() {
			this.save();
			this.setTransform(1, 0, 0, 1, 0, 0);
			this.clearRect(0, 0, data.canvas.width, data.canvas.height);
			this.restore();
		};

		for(let i = 0; i < 4; i++){
			let image = new Image();
			image.src = 'images/chk' + i + '.png';
			chk_images.push(image);
		}

		for(let i = 0; i < 4; i++){
			let image = new Image(data.canvas.width * 2, data.canvas.height);
			image.src = 'images/layers/layer' + i + '.png';
			layer_images.push(image);
		}

		wire_image = new Image();
		wire_image.src = 'images/barbed.png';
		data.ground.image =  layer_images[3];

		title_image = new Image();
		title_image.src = 'images/title.png';
	}

	function run(data) {
		context.clear();
		drawBackround(data);
		if(data.screen === 'game-screen'){
			for(let i=0; i < data.wires.length; i++) {
				data.wires[i].image = wire_image;
				drawRectangle(data.wires[i]);
			}
			drawParticles(data.elapsedTime, data.systems);
			drawSprite(data);
			drawSelectedText(data.scoreText);
		}
		drawRectangle(data.ground);
		if(data.screen === 'menu-screen') {
			drawRectangle({image : title_image, x : data.canvas.width / 2 - 150, y : 50, width : 326, height : 140})
		}
		drawMenu(data);
	}

	function drawParticles(elapsedTime, systems){
		for(var i = 0; i < systems.length; i++){
			systems[i].update(elapsedTime);
			systems[i].render();
			systems[i].create();
		}
	}

	function drawBackround(data) {
		for(let i = 0; i < 3; i++){
			data.backGround.image = layer_images[i];
			drawRectangle(data.backGround);
		}	
	}

	function drawRectangle(spec) {
		context.save();
			
		context.drawImage(
			spec.image, 
			spec.x, 
			spec.y,
			spec.width, spec.height);
		
		context.restore();	
	}

	function drawSprite(data) {

		context.save();
		context.translate(data.chicken.x, data.chicken.y);
		context.rotate(data.chicken.rotation);
		context.translate(-data.chicken.x, -data.chicken.y);

		context.drawImage(
			chk_images[data.imageNum], 
			data.chicken.x - data.chicken.dimension / 2, 
			data.chicken.y - data.chicken.dimension / 2,
			data.chicken.dimension, data.chicken.dimension
		);
		context.restore();
	}

	function drawImage(spec) {
		context.save();
		
		context.translate(spec.center.x, spec.center.y);
		context.rotate(spec.rotation);
		context.translate(-spec.center.x, -spec.center.y);
		
		context.drawImage(
			spec.image, 
			spec.center.x - spec.size/2, 
			spec.center.y - spec.size/2,
			spec.size, spec.size);
		
		context.restore();
	}

	function drawMenu(data) {
		drawTexts(data.buttons);
		drawTexts(data.texts);
	}

	function drawTexts(buttons) {
		for(let i = 0; i < buttons.length; i++) {
			buttons[i].selected ? drawSelectedText(buttons[i]) : drawText(buttons[i]);
		}
	}

	function drawText(text) {
		context.beginPath();
		context.font = text.font === undefined ? "40px Impact" : text.font;
		context.fillStyle = "black";
		context.fillText(text.text, text.x, text.y);
		context.closePath();		
	}

	function drawSelectedText(text) {
		context.beginPath();
		context.font = "60px Impact";
		context.fillStyle = "blue";
		context.fillText(text.text, text.x, text.y);
		context.closePath();		
	}


	return {
		initialize : initialize,
		run : run,
		drawImage : drawImage
	};
	
}());