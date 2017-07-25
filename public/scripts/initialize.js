var FlappyGame = {
	screens : {},
	persistence : (function () {

		var keyBind = 'DOM_VK_SPACE',
			previousKey = localStorage.getItem('FlappyGame.keyBind');
		if (previousKey !== 'DOM_VK_SPACE') {
			keyBind = previousKey;
		}

		function setKey(key) {
			console.log(key);
			localStorage['FlappyGame.keyBind'] = key;
		}

		function getKey() {
			console.log(keyBind);
			return keyBind;
		}

		return {
			setKey : setKey,
			getKey : getKey
		};		
	}())
};

FlappyGame.game = (function(screens) {

	function showScreen(id) {
		var screen = 0;

		screens[id].run();
	}

	function initialize() {
		var screen = null;

		for (screen in screens) {
			if (screens.hasOwnProperty(screen)) {
				screens[screen].initialize();
			}
		}
		
		showScreen('menu-screen');
	}

	return {
		initialize : initialize,
		showScreen : showScreen
	};
}(FlappyGame.screens));



