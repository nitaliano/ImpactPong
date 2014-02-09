ig.module(
  'game.entities.base'
)
.requires(
  'impact.entity'
)
.defines(function () {
  EntityBase = ig.Entity.extend({
    init: function (x, y ,settings) {
      this.parent(x, y, settings);

      this.bounds = { 
        top: 0, 
        bottom: ig.system.height - this.size.y,
        left: 0,
        right: ig.system.width - this.size.x
      };

      this.center = {
        x: this.bounds.right / 2,
        y: this.bounds.bottom / 2
      };

      this.addAnim('default', 1, [0]);
    },

    isTop: function () {
      return this.pos.y <= this.bounds.top;
    },

    isBottom: function () {
      return this.pos.y >= this.bounds.bottom;
    }
  });
});
