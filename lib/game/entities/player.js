ig.module(
  'game.entities.player'
)
.requires(
  'game.entities.paddle'
)
.defines(function () {
  EntityPlayer = EntityPaddle.extend({
    init: function (x, y ,settings) {
      this.parent(x, y, settings);
      this.setPosition(this.bounds.left + this.size.x / 2);
      ig.game.player = this;
    },
    
    reset: function () {
      this.setPosition(this.bounds.left + this.size.x / 2);
    },

    update: function () {
      this.setAcceleration(ig.input.state('up') ? 'up' : ig.input.state('down') ? 'down' : 'stop');
      this.parent();
    }
  });
});
