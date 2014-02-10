ig.module(
  'game.entities.paddle'
)
.requires(
  'game.entities.base'
)
.defines(function () {
  EntityPaddle = EntityBase.extend({
    animSheet: new ig.AnimationSheet('media/paddle.png', 32, 64),
    size: { x: 32, y: 64 },

    maxVel: {x: 0, y: 200},
    a: 1000,

    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.FIXED,

    init: function (x, y ,settings) {
      this.parent(x, y, settings);
      this.hits = 0;
    },

    setPosition: function (x, y) {
      if (typeof x !== 'number') {
        return;
      }
      this.pos.x = x;
      this.pos.y = this.center.y;
    },

    setAcceleration: function (state) {
      var isTop, isBottom;

      if (state === 'up') {
        isTop = this.isTop();
        this.accel.y = isTop ? this.a : -this.a;
        this.pos.y = isTop ? this.bounds.top : this.pos.y;
      } else if (state === 'down') {
        isBottom = this.isBottom();
        this.accel.y = isBottom ? -this.a : this.a;
        this.pos.y = isBottom ? this.bounds.bottom : this.pos.y;
      } else if (state === 'stop') {
        this.stop();
      }

      if (isTop || isBottom) {
        this.vel.y = 0;
      }

      this.currentAnim = this.anims.default;
    },

    check: function (ball) {
      this.hits++;

      // if the ball hits the top, or bottom of the paddle
      if (ball.pos.y + ball.size.y === this.pos.y || ball.pos.y === this.pos.y + this.size.y) {
        ball.accel.y = -ball.accel.y;
      } 

      ball.accel.x = -ball.accel.x;
    }
  });
});
