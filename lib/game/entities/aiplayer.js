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
      this.setPosition(this.bounds.right - this.size.x / 2, this.center.y);
      ig.game.aiplayer = this;
    },

    reset: function () {
      this.hits = 0;
      this.setAcceleration('stop');
      this.setPosition(this.bounds.right - this.size.x / 2, this.center.y);
    },

    update: function () {
      var ballYPos;

      this.parent();

      if (ig.game.ball.pause) {
        return;
      }

      if (this.hits === 0) {
        this.maxVel.y = 200;
      } else if (this.hits === 5) {
        this.maxVel.y = 150;
      } else if (this.hits === 10) {
        this.maxVel.y = 100;
      }

      ballYPos = ig.game.ball.getPosition().y;

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