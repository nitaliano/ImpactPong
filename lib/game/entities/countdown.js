ig.module(
  'game.entities.countdown'
)
.requires(
  'impact.font',
  'impact.timer',
  'impact.entity'
)
.defines(function () {
  EntityCountdown = ig.Entity.extend({
    font: new ig.Font('media/04b03_black.font.png'),
    size: { x: 1, y: 1 },

    init: function (x, y ,settings) {
      this.parent(x, y, settings);
      this.countDownText = ['3', '2', '1', 'GO!'];
      this.timer = new ig.Timer(1);
      this.cb = settings.cb;
    },

    update: function () {
      this.parent();

      if (this.timer.delta() > 0) {
        this.countDownText.shift();
        if (this.countDownText.length === 0) {
          this.kill();
          return this.cb();
        } else {
          this.timer.set(1);
        }
      }
    },

    draw: function () {
      this.parent();
      this.font.draw(this.countDownText[0], ig.system.width / 2, ig.system.height / 2, ig.Font.ALIGN.CENTER);
    }

  });
});