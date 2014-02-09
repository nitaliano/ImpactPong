ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',

	'game.levels.Title',
	'game.levels.PongTable',

  'plugins.impact-splash-loader'
)
.defines(function(){

TitleScreen = ig.Game.extend({
	clearColor: '#000000',
	font: new ig.Font('media/04b03.font.png'),
	startText: 'Press Space to play this awesome pong game!',

	init: function () {
		ig.input.bind(ig.KEY.SPACE, 'start');
		this.loadLevel(LevelTitle);
	},

	update: function () {
		if (ig.input.pressed('start')) {
			ig.system.setGame(PongGame);
			return;
		}
		this.parent();
	},

	draw: function () {
		this.parent();
		this.font.draw(this.startText, ig.system.width / 2, ig.system.height / 2, ig.Font.ALIGN.CENTER);
	}
});

PongGame = ig.Game.extend({	
	clearColor: '#fffff3',
	gravity: 0,
	
	init: function() {
    ig.input.bind(ig.KEY.UP_ARROW, 'up');
    ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
    this.loadLevel(LevelPongTable);
	}
});

ig.main('#canvas', TitleScreen, 60, 480, 320, 1, ig.ImpactSplashLoader);
});
