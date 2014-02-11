ig.module(
  'game.entities.ball'
)
.requires(
  'impact.font',
  'game.entities.base',
  'game.entities.countdown'
)
.defines(function () {
  EntityBall = EntityBase.extend({
    font: new ig.Font('media/04b03_black.font.png'),
    animSheet: new ig.AnimationSheet('/media/ball.png', 32, 32),
    size: { x: 32, y: 32 },

    maxVel: {x: 200, y: 200},
    _a: 1000,
    _r: 16,

    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.ACTIVE,

    init: function (x, y ,settings) {
      this.parent(x, y, settings);

      this.origin = {
        x: this.center.x - this._r,
        y: this.center.y - this._r
      };

      this.scorePosition = {
        xl: this.bounds.left - this.size.x,
        xr: this.bounds.right + this.size.x
      };

      this.setPosition(this.origin.x, this.origin.y);
      this.setRandomAcceleration();

      ig.game.ball = this;
    },

    setRandomAcceleration: function () {
      switch(Math.floor(Math.random() * 4) + 1) {
        case 1:
          this.accel.x = this._a;
          this.accel.y = -this._a;
          break;
        case 2:
          this.accel.x = this.accel.y = this._a;
          break;
        case 3:
          this.accel.x = -this._a;
          this.accel.y = this._a;
          break;
        case 4:
          this.accel.x = this.accel.y = -this._a;
          break;
      }
    },

    triggerScore: function (player) {
      var self = this;
      this.pause = true;
      this.stop();
      this.hide();
      ig.game.onScore(player);
      ig.game.spawnEntity(EntityCountdown, 0, 0, { cb: this.reset.bind(this) });
    },

    reset: function () {
      this.setPosition(this.origin.x, this.origin.y);
      this.setRandomAcceleration();
      this.pause = false;
    }, 

    update: function () {
      var isTop, isBottom, isLeftScore;
      this.parent();

      if (this.pause) {
        return;
      }

      isLeftScore = this.pos.x <= this.scorePosition.xl;
      if (isLeftScore || this.pos.x >= this.scorePosition.xr) {
        this.triggerScore(isLeftScore ? 'player' : 'aiplayer');
        return;
      }

      isTop = this.isTop();
      isBottom = this.isBottom();

      if (isTop || isBottom) {
        this.accel.y = -2 * this.accel.y;
        this.vel.y = -this.vel.y;
        this.pos.y = isTop ? this.bounds.top : isBottom ? this.bounds.bottom : this.pos.y;
      }
    }
  });
});