var GameView = {
  width: 900,
  height: 600,
  ctx: null,
  init:function()
  {

    var canvas=$('.gamearea')[0];
    var ctx=canvas.getContext('2d');
    this.ctx = ctx;
    this.ctx.setTransform(1, 0, 0, 1, -0.5, -0.5)
    GameKeyListener.init();
    GameViewText.init();
  },

  frame: function()
  {
    this.frameClean();
    GameViewText.frame();
  },

  frameClean:function()
  {
    this.ctx.fillStyle="#001900";
    this.ctx.fillRect(0, 0, GameView.width, GameView.height);
  },

}
