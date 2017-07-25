FlappyGame.sound = (function() {

	sounds = {};

	function loadSound(source) {
		let sound = new Audio();
		sound.src = source;
		return sound;
	}

	function initialize() {
		sounds['flap'] = loadSound('audio/flap.flac');
		sounds['death'] = loadSound('audio/punch.mp3');
		sounds['coin'] = loadSound('audio/coin.wav');
		sounds['music'] = loadSound('audio/Campfire.mp3');
		sounds['music'].volume = 0.4;
		sounds['music'].loop = true;
	}

	function playSound(whichSound) {
		 sounds[whichSound].play();
	}

	function stopSound(whichSound) {
		sounds[whichSound].pause();
		sounds[whichSound].currentTime = 0;
	}

	return {
		initialize : initialize,
		playSound : playSound, 
		stopSound : stopSound
	};

}());