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

      this.setAtOrigin();
      this.setRandomAcceleration();

      ig.game.ball = this;
    },

    setRandomAcceleration: function () {
      switch(Math.floor(Math.random() * 2) + 1) {
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

    getPositionFromCenter: function() {
      return this.pos.y - this._r;
    },

    setAtOrigin: function () {
      this.pos.x = this.origin.x;
      this.pos.y = this.origin.y;
    },

    triggerScore: function (position) {
      var self = this;
      this.pause = true;
      this.stop();
      this.hide();

      if (position < this.bounds.left) {
        ig.game.onScore('player');
      } else {
        ig.game.onScore('aiplayer');
      }

      ig.game.spawnEntity(EntityCountdown, 0, 0, { cb: this.reset.bind(this) });
    },

    hide: function () {
      this.pos.x = this.bounds.left - this.size.x * 2;
      this.pos.y = this.origin.y;
    },

    reset: function () {
      this.setAtOrigin();
      this.setRandomAcceleration();
      this.pause = false;
    }, 

    update: function () {
      var isTop, isBottom;
      this.parent();

      if (this.pause) {
        return;
      }

      if (this.pos.x <= this.scorePosition.xl || this.pos.x >= this.scorePosition.xr) {
        this.triggerScore(this.pos.x);
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