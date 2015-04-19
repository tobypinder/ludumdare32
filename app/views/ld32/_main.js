var GameMain = {
  loop: null,
  start:function()
  {
    GameModel.init();
    GameView.init();
    GameKeyListener.init();
    this.loop = setInterval(this.frame, (1000/GameConfig.fps));
  },
  frame:function()
  {
    GameView.frame();
  }

}

GameMain.start();
