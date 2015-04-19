var GameKeyListener = {
  init:function()
  {
    window.addEventListener("keydown",this.keyDown,true);
    window.addEventListener("keyup",this.keyUp,true);
  },

  keyDown:function(e)
  {
    GameKeyListener.setKey(e, true)
  },
  keyUp:function(e)
  {
    GameKeyListener.setKey(e, false)
  },
  setKey:function(e, state)
  {
    var map = GameModel.input.keyboard
    switch(e.keyCode)
    {
      case 87:
        map.w = state
        e.preventDefault();
      break;
      case 83:
        map.s = state
        e.preventDefault();
      break;
      case 65:
        map.a = state
        e.preventDefault();
      break;
      case 68:
        map.d = state
        e.preventDefault();
      break;
      case 13:
        map.enter = state
        e.preventDefault();
      break;
      case 32:
        map.space = state
        e.preventDefault();
      break;
      case 37:
        map.left_arrow = state
        e.preventDefault();
      break;
      case 38:
        map.up_arrow = state
        e.preventDefault();
      break;
      case 39:
        map.right_arrow = state
        e.preventDefault();
      break;
      case 40:
        map.down_arrow = state
        e.preventDefault();
      break;
    }
  }
}
