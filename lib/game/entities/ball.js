ig.module(
  'game.entities.ball'
)
.requires(
  'game.entities.base'
)
.defines(function () {
  EntityBall = EntityBase.extend({
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

    getPositionFromCenter: function() {
      return this.pos.y - this._r;
    },

    setAtOrigin: function () {
      this.vel.x = this.vel.y = this.accel.x = this.accel.y = 0;
      this.pos.x = this.origin.x;
      this.pos.y = this.origin.y;
    },

    update: function () {
      var isTop, isBottom;
      this.parent();

      if (this.pos.x <= this.scorePosition.xl || this.pos.x >= this.scorePosition.xr) {
        this.setAtOrigin();
        this.setRandomAcceleration();
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