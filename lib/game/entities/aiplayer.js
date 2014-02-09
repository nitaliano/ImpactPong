ig.module(
  'game.entities.aiplayer'
)
.requires(
  'game.entities.paddle'
)
.defines(function () {
  EntityAiplayer = EntityPaddle.extend({
    init: function (x, y ,settings) {
      this.parent(x, y, settings);
      this.setPosition(this.bounds.right - this.size.x / 2);
      ig.game.aiplayer = this;
    },

    update: function () {
      var ballYPos = ig.game.ball.getPositionFromCenter();
      this.parent();

      if (this.hits === 0) {
        this.maxVel.y = 200;
      } else if (this.hits === 5) {
        this.maxVel.y = 150;
      } else if (this.hits === 10) {
        this.maxVel.y = 100;
      }

      if (ballYPos > this.pos.y) {
        this.setAcceleration('down');
      } else if (ballYPos < this.pos.y) {
        this.setAcceleration('up');
      } else {
        this.setAcceleration('stop');
      }
    }
  });
});
