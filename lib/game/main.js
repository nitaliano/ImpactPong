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
	font: new ig.Font('media/04b03_black.font.png'),
	gravity: 0,
	maxScore: 5,
	
	init: function() {
    ig.input.bind(ig.KEY.UP_ARROW, 'up');
    ig.input.bind(ig.KEY.DOWN_ARROW, 'down');

    this.score = {
    	player: 0,
    	aiplayer: 0
    };

    this.loadLevel(LevelPongTable);
	},

	draw: function () {
		var w, h;
		this.parent();

		w = ig.system.width / 2;
		h = ig.system.height - 8;

		this.font.draw('Score:', w - 64, h);
		this.font.draw(this.score.player, w - 16, h);
		this.font.draw(this.score.aiplayer, w + 16, h);
	},

  update: function () {
  	this.parent();
  },

  restart: function () {
  	this.score.player = 0;
  	this.score.aiplayer = 0;
  },

	onScore: function (player) {
		if (typeof this.score[player] !== 'undefined') {
			this.score[player]++;
			ig.game.aiplayer.hits = 0;

			if (this.score[player] === this.maxScore) {
				this.restart();
			}
		}
	}
});

ig.main('#canvas', TitleScreen, 60, 480, 320, 1, ig.ImpactSplashLoader);
});
