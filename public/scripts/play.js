FlappyGame.play = (function(update, render, input, game, sound) {

	let previousTime = performance.now();
	let data = {
		canvas : document.getElementById('game-canvas'),
		title : 'Flappy!',
		keyboard : input.Keyboard(),
		mouse : input.Mouse(),
		pi : 3.14159,
		bind : FlappyGame.persistence.getKey()
	};

	function initialize(screen) {
		data.cancelNextRequest = false;
		initializeData(screen);
		update.initialize(data);
		render.initialize(data);
		sound.initialize();
		if(previousTime < 200){
			sound.playSound('music');	
		}
		requestAnimationFrame(gameLoop);
	}

	function initializeData(screen) {
		data.scores = [];
		data.screen = screen;
		data.buttons = [];
		data.texts = [];
		data.timeInt = 0;
		data.imageNum = 0;
		data.chicken = {
			x : data.canvas.width / 2 - 100, 
			y : data.canvas.height / 2, 
			dimension : 70,
			velocity : 0,
			acceleration : 1 / 4,
			rotation : 0,
			grounded : false
		};
		data.flapSpeed = -6;
		data.groundHeight = 750;
		data.wires = [];
		data.wireWidth = 100;
		data.wireHeight = 600;
		data.gameSpeed = 2;
		data.dead = false;
		data.score = 0;
		data.addScoreFlag = true;
		data.scoreText = {text : '0', x : data.canvas.width / 2, y : 70};
		data.systems = [];
		data.particleFlag = true;
		data.soundFlag = true;
		data.addButtonsFlag = true;
		data.ground = {
			image : {},
			x : 0, 
			y : 0,
			width : data.canvas.width * 2, 
			height : data.canvas.height
		};
		data.backGround = {
			image : {},
			x : 0, 
			y : 0,
			width : data.canvas.width * 2, 
			height : data.canvas.height
		};
	}

	function gameLoop(time) {
		data.elapsedTime = time - previousTime;
		previousTime = time;
		data.keyboard.update(data.elapsedTime);
		data.mouse.update(data.elapsedTime);
		update.run(data);
		render.run(data);
		if(!data.cancelNextRequest) {
			requestAnimationFrame(gameLoop);
		}
		else {
			if(data.screen === 'menu-screen') {
				sound.stopSound('music');
			}
			game.showScreen(data.screen);
		}
	}

	return {
		initialize : initialize,
		gameLoop : gameLoop
	};

}(FlappyGame.update, FlappyGame.render, FlappyGame.input, FlappyGame.game, FlappyGame.sound));