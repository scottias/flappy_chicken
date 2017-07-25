FlappyGame.update = (function(render, sound) {
	let updateData = {};

	function initialize(data) {
		updateData = data;
		data.keyboard = FlappyGame.input.Keyboard();
		data.keyboard.registerCommand(KeyEvent.DOM_VK_DOWN, moveSelectionDown);
		data.keyboard.registerCommand(KeyEvent.DOM_VK_UP, moveSelectionUp);
		data.keyboard.registerCommand(KeyEvent.DOM_VK_SPACE, makeSelection);
		data.keyboard.registerCommand(KeyEvent[data.bind], flap);
 
		data.mouse.registerCommand('mousedown',	makeSelection);
		data.mouse.registerCommand('mousedown', flap);
		data.mouse.registerCommand('mouseup', function() { data.keyboard.press = false; });
		data.mouse.registerCommand('mousemove', function(e, elapsedTime) {
			changeSelection(e.clientX, e.clientY);
		});

		if(data.screen === 'menu-screen') {
			data.buttons.push({text : 'New Game', x : data.canvas.width / 2 - 150, y : 300, selected : true});
			data.buttons.push({text : 'Controls', x : data.canvas.width / 2 - 150, y : 400, selected : false});
			data.buttons.push({text : 'High Scores', x : data.canvas.width / 2 - 150, y : 500, selected : false});
			data.buttons.push({text : 'Credits', x : data.canvas.width / 2 - 150, y : 600, selected : false});
		}

		if(data.screen === 'controls-screen') {
			data.buttons.push({text : 'Flap', x : data.canvas.width / 2 - 150, y : 350, selected : true});
			data.texts.push({text : data.bind.slice(7), x : data.canvas.width / 2, y : 350, selected : false});
			data.buttons.push({text : 'Back', x : data.canvas.width / 2 - 150, y : 600, selected : false});
		}

		if(data.screen === 'score-screen') {
			showScores();			
			data.buttons.push({text : 'Clear Scores', x : data.canvas.width / 2 - 150, y : 600, selected : true});
			data.buttons.push({text : 'Back', x : data.canvas.width / 2 - 150, y : 700, selected : false});
		}

		if(data.screen === 'credits-screen') {
			data.texts.push({text : 'Created by ', x : data.canvas.width / 2 - 150, y : 225, selected : false});
			data.texts.push({text : '   Scott Sorensen', x : data.canvas.width / 2 - 150, y : 300, selected : false});	
			data.buttons.push({text : 'Back', x : data.canvas.width / 2 - 150, y : 600, selected : true});
		}

		if(data.screen === 'game-over-screen') {
			data.buttons.push({text : 'Menu', x : data.canvas.width / 2 - 150, y : 600, selected : true});
		}
		newWire(data, data.canvas.width);
		newWire(data, data.canvas.width * 1.5 + 50);
	}

	function run(data) {
		
		data = updateData;
		if(!data.chicken.grounded){
			changeNum(data);
		}
		if(data.screen === 'game-screen') {
			updatePosition(data);
			checkCollisions(data);
			moveWires(data);
			addNewWire(data);
			updateScore(data);
			gameOver(data);
		}

	}

	function gameOver(data) {

	}

	function updateScore(data) {
		if(data.wires[0].x <= data.chicken.x && data.addScoreFlag) {
			data.score += 1;
			data.scoreText.text = data.score.toString();
			data.addScoreFlag = false;
			sound.playSound('coin');
		}
	}

	function addNewWire(data) {
		if(data.wires[0].x + data.wires[0].width <= 0) {
			data.wires.splice(0, 2);
			newWire(data, data.canvas.width);
			data.addScoreFlag = true;
		}
	}

	function newWire(data, x) {
		let max = -100;
		let min = -500;
		let random = Math.floor(Math.random() * (max - min + 1)) + min;
		let wire1 = {
			x : x,
			y : random,
			width : data.wireWidth,
			height : data.wireHeight		
		};
		let wire2 = {
			x : x,
			y : random + 780,
			width : data.wireWidth,
			height : data.wireHeight
		};
		data.wires.push(wire1); 
		data.wires.push(wire2);
	}

	function moveWires(data) {
		for(let i = 0; i < data.wires.length; i++) {
			data.wires[i].x -= data.gameSpeed;
		}
		data.ground.x -= data.gameSpeed;
		if(data.ground.x < -data.canvas.width){
			data.ground.x = 0;
		}
	}

	function checkCollisions(data) {
		let groundBox = {
			x : 0, 
			y : data.groundHeight, 
			width : data.canvas.width, 
			height : data.canvas.height - data.groundHeight
		};

		let chkBox = {
			x : data.chicken.x - data.chicken.dimension / 2 + 5, 
			y : data.chicken.y - data.chicken.dimension / 2 + 5, 
			width : data.chicken.dimension - 20, 
			height : data.chicken.dimension - 10
		};

		for(let i = 0; i < data.wires.length; i++) {
			if(boxCollision(data.wires[i], chkBox)) {
				if(data.soundFlag) {
					sound.playSound('death');
					data.soundFlag = false;
				}
				data.gameSpeed = 0;
				data.dead = true;
			}
		}

		if(boxCollision(groundBox, chkBox)) {
			data.gameSpeed = 0;
			data.dead = true;
			data.chicken.grounded = true;
			if(data.soundFlag) {
				sound.playSound('death');
				data.soundFlag = false;
			}
			if(data.particleFlag) {
				createDeathParticleSystem(data);
				data.particleFlag = false;
			}
			if(data.addButtonsFlag) {
				data.buttons.push({text : 'Submit', x : data.canvas.width / 2 - 150, y : 400, selected : true});
				data.buttons.push({text : 'Menu', x : data.canvas.width / 2 - 150, y : 600, selected : false});
				data.addButtonsFlag = false;
			}
		}
	}

	function createDeathParticleSystem(data) {
		data.systems.push(ParticleSystem( {
			image : "images/feather.png",
			center: {x: data.chicken.x , 
					 y: data.chicken.y},
			speed: {mean: 65, stdev: 5},
			lifetime: {mean: 1, stdev: 0.1},
			maxParticles : 30
		}, 
		render));
	}

	function boxCollision(box1, box2) {
		if (box1.x < box2.x + box2.width &&
			box1.x + box1.width > box2.x &&
			box1.y < box2.y + box2.height &&
			box1.height + box1.y > box2.y) {
				return true;
		}
		return false;
	}

	function updatePosition(data) {
		if(!data.chicken.grounded) {
			data.chicken.velocity += data.chicken.acceleration;
			data.chicken.y += data.chicken.velocity;
			if(data.chicken.rotation < data.pi / 2) {
				data.chicken.rotation += data.chicken.velocity / 100;
			}
			if(data.chicken.rotation < -data.pi / 3) {
				data.chicken.rotation = -data.pi / 3;
			}
		}
	}

	function changeNum(data){

		data.timeInt += data.elapsedTime;

		if(data.timeInt < 100) { 
			data.imageNum = 0;
		}
		else if(data.timeInt < 200) { 
			data.imageNum = 1;
		}
		else if(data.timeInt < 300) {
			data.imageNum = 2;
		}
		else if(data.timeInt < 400) { 
			data.imageNum = 3;
		}
		else if(data.timeInt < 500) { 
			data.imageNum = 2;
		}
		else if(data.timeInt < 600) { 
			data.imageNum = 1;
		}
		else {
			data.timeInt = 0;
		}

	}

	function createParticleSystem(data) {
		data.systems.push(ParticleSystem( {
			image : "images/feather.png",
			center: {x: data.chicken.x - 10, 
					 y: data.chicken.y + data.flapSpeed * 3},
			speed: {mean: 35, stdev: 5},
			lifetime: {mean: 1, stdev: 0.1},
			maxParticles : 15
		}, 
		render));
	}

	function flap() {
		if(!updateData.keyboard.press && !updateData.dead) {
			updateData.chicken.velocity = updateData.flapSpeed;
			updateData.keyboard.press = true;
			updateData.chicken.rotation = 0;
			createParticleSystem(updateData);
			sound.stopSound('flap');
			sound.playSound('flap');
		}
	}

	function moveSelectionDown() {
		for(let i = 0; i < updateData.buttons.length; i++) {
			if(updateData.buttons[i].selected && !updateData.keyboard.press) {
				updateData.buttons[i].selected = false;
				updateData.keyboard.press = true;
				if(i === updateData.buttons.length - 1) {
					updateData.buttons[0].selected = true;
				}
				else{
					updateData.buttons[i + 1].selected = true;
				}
				break;
			}
		}	
	}

	function moveSelectionUp() {
		for(let i = 0; i < updateData.buttons.length; i++) {
			if(updateData.buttons[i].selected && !updateData.keyboard.press){
				updateData.buttons[i].selected = false;
				updateData.keyboard.press = true;
				if(i === 0) {
					updateData.buttons[updateData.buttons.length - 1].selected = true;
				}
				else{
					updateData.buttons[i - 1].selected = true;
				}
				break;
			}
		}
	}

	function changeSelection(x, y) {
		for(let i = 0; i < updateData.buttons.length; i++) {
			if(x > updateData.buttons[i].x && x < updateData.buttons[i].x + 220 &&
				y > updateData.buttons[i].y - 30 && y < updateData.buttons[i].y + 15) {
				if(!updateData.buttons[i].selected) {
					for(let j = 0; j < updateData.buttons.length; j++) {
						if(updateData.buttons[j].selected) {
							updateData.buttons[j].selected = false;
							break;
						}
					}
					updateData.buttons[i].selected = true;
					break;
				}
			}
		}
	}

	function makeSelection(){
		for(let i = 0; i < updateData.buttons.length; i++) {
			if(updateData.buttons[i].selected && !updateData.keyboard.press){
				updateData.buttons[i].selected = false;
				updateData.keyboard.press = true;
				switch(updateData.buttons[i].text) {
					case 'New Game':
						updateData.cancelNextRequest = true;
						updateData.screen = 'game-screen';
						break;					
					case 'Controls':
						updateData.cancelNextRequest = true;
						updateData.screen = 'controls-screen';
						break;
					case 'High Scores':
						updateData.cancelNextRequest = true;
						updateData.screen = 'score-screen';
						break;
					case 'Credits':
						updateData.cancelNextRequest = true;
						updateData.screen = 'credits-screen';
						break;
					case 'Back':
						updateData.cancelNextRequest = true;
						updateData.screen = 'menu-screen';
						break;
					case 'Menu':
						document.getElementById('score-input').style.display = 'none';
						updateData.cancelNextRequest = true;
						updateData.screen = 'menu-screen';
						break;
					case 'Flap':
						rebind();
						break;
					case 'Submit':
						submit();
						break;
					case 'Clear Scores':
						clearScores();
						break;
					default:
						break;
				}
			}
		}
	}

	function submit() {
		document.getElementById('score-input').style.display = 'inline-block';
	}

	document.getElementById('game-save-button').addEventListener(
		'click',
		function() {
			addScore();
			document.getElementById('score-input').style.display = 'none';
		}
	);	

	function rebind() {
		updateData.texts[0].selected = true;
		window.addEventListener('keydown',function(e){
			if(updateData.texts.length > 0){
				if(updateData.texts[0].selected) {
					updateData.texts[0].text = getKeyByValue(KeyEvent, e.keyCode).slice(7);
					updateData.texts[0].selected = false;
					updateData.bind = getKeyByValue(KeyEvent, e.keyCode);
					updateData.buttons[0].selected = true;
					FlappyGame.persistence.setKey(updateData.bind);
				}
			}
		}, true);
	}

	function getKeyByValue(object, value) {
	  return Object.keys(object).find(key => object[key] === value);
	}


	function addScore() {
		var name = $('#name').val();
		document.getElementById("myForm").reset();
		$.ajax({
			url: 'http://localhost:3000/v1/scores?name=' + name + '&score=' + updateData.score,
			type: 'POST',
			error: function() { alert('POST failed'); },
			success: function() {
				updateData.cancelNextRequest = true;
				updateData.screen = 'menu-screen';	
			}
		});
	}

	function showScores() {
		$.ajax({
			url: 'http://localhost:3000/v1/scores',
			cache: false,
			type: 'GET',
			error: function() { alert('GET failed'); },
			success: function(data) {
				for(let i = 0; i < data.length; i++){
					updateData.texts.push({text : (i + 1) + '  -  ' + data[i].name, x : updateData.canvas.width / 2 - 150, y : (i + 1) * 50, 
						selected : false, font : '30px Arial'});
					updateData.texts.push({text : data[i].score, x : updateData.canvas.width / 2 + 100, y : (i + 1) * 50, 
						selected : false, font : '30px Arial'});
					console.log(data[i].name + ' : ' + data[i].date + ', ' + data[i].score);
				}
			}
		});
	}

	function clearScores() {
		$.ajax({
			url: 'http://localhost:3000/v1/scores/clear',
			cache: false,
			type: 'GET',
			error: function() { alert('GET failed'); },
			success: function(data) {
				updateData.texts = [];
				console.log('scores cleared');
			}
		});
	}

	return {
		initialize : initialize,
		run : run,
	};
	
}(FlappyGame.render, FlappyGame.sound));