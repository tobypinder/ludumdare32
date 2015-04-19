var GameViewText = {
  lines: 23,
  cursorX: 0,
  cursorY: 0,

  content: [],
  displayContent: [],
  actions: [],
  currentAction: 0,
  navigateTimeout: 4,
  framesSinceNavigated: 0,

  init:function()
  {
    for(var i=0;i<this.lines;i++)
    {
      this.content[i] = ""
      this.displayContent[i] = ""
    }

    GameMenuState.applyCurrentState();
  },
  changeLine:function(line, text)
  {
    this.content[line]        = text
    this.displayContent[line] = ""
  },
  wipeScreen:function()
  {
    for(var i=0;i<this.lines;i++)
    {
      this.content[i]        = ""
      this.displayContent[i] = ""
    }
    this.actions = []
  },
  parseLine:function(x)
  {
    var line      = this.content[x];
    var cleanline = line
    // Find {x} and to actions

    var regex = /\{(\S+)\}/gi

    matched = regex.exec(line);
    while(matched != null)
    {
      var command = matched[1]

      if(this.actions.indexOf(command) === -1)
      {
        this.actions.push(command)
      }

      var startChar = ' '
      if(this.actions.indexOf(command) === this.currentAction )
      {
        startChar = '>'
      }

      cleanline = cleanline.replace('{'+ command +'}', startChar + command +' ')

      matched = regex.exec(line);
    }

    return cleanline
  },

  navigate:function()
  {
    this.framesSinceNavigated++;
    keys = GameModel.input.keyboard

    if(keys.down_arrow || keys.s || keys.right_arrow || keys.d)
    {
      if(this.framesSinceNavigated >= this.navigateTimeout)
      {
        this.framesSinceNavigated = 0
        this.currentAction = (this.currentAction + 1) % this.actions.length
        this.currentAction = isNaN(this.currentAction) ? 0 : this.currentAction
      }
    }
    if(keys.up_arrow || keys.w || keys.left_arrow || keys.a)
    {
      if(this.framesSinceNavigated >= this.navigateTimeout)
      {
        this.framesSinceNavigated = 0

        if(this.currentAction > 0)
        {
          this.currentAction = (this.currentAction - 1) % this.actions.length
          this.currentAction = isNaN(this.currentAction) ? 0 : this.currentAction
        } else {
          this.currentAction = this.actions.length - 1
        }
      }
    }

    if(keys.enter)
    {
      if(this.framesSinceNavigated >= this.navigateTimeout)
      {
        this.framesSinceNavigated = 0
        GameAction.applyAction(GameMenuState.currentState, this.actions[this.currentAction])
      }
    }

    if(keys.space)
    {
      this.advanceChars(10);
    }
  },
  advanceChars:function(chars)
  {
    for(var i=0;i<this.lines;i++)
    {
      for(var j=0;j<this.content[i].length;j++)
      {
        contentLine = this.parseLine(i)

        if(this.displayContent[i][j] !== contentLine[j])
        {
          this.displayContent[i] = this._replaceChar(this.displayContent[i], j, contentLine[j])

          chars = chars - 1;

          if(chars <= 0)
          {
            return;
          }
        }
      }
    }

  },
  header:function()
  {
    if(GamePlayer.approvalRating <= 0)
    {
      return;
    }

    var emote = "D:"
    if(GamePlayer.approvalRating/GamePlayer.maxApproval > 0.2)
    {
      emote = ':('
    }
    if(GamePlayer.approvalRating/GamePlayer.maxApproval > 0.4)
    {
      emote = ':|'
    }
    if(GamePlayer.approvalRating/GamePlayer.maxApproval > 0.70)
    {
      emote = ':)'
    }
    if(GamePlayer.approvalRating/GamePlayer.maxApproval > 0.9)
    {
      emote = ':D'
    }

    var bar = "Approval Rating [" + Array(Math.floor(GamePlayer.approvalRating) + 1).join("X")
    bar += Array(Math.ceil(GamePlayer.maxApproval-GamePlayer.approvalRating) + 1).join(" ") + '] '+emote

    GameViewText.changeLine(0, bar)
    GameViewText.changeLine(1, "-----------------------------------------------------------------------")
  },
  footer:function()
  {
    if(GamePlayer.approvalRating <= 0)
    {
      return;
    }

    GameViewText.changeLine(21, "-----------------------------------------------------------------------")
    team = GamePlayer.team.length


    GameViewText.changeLine(22, "{Sitrep}    {Team}"+team+"     {Targets}0     {Date}"+GameDay.displayDate(GamePlayer.date)+"     {BTC}"+GamePlayer.totals.btc.toFixed(8))
  },
  frame:function()
  {
    this.navigate();

    this.advanceChars(4);

    GameView.ctx.font="24px Ubuntu Mono";

    for(var i=0;i<this.lines;i++)
    {

      var flicker = Math.cos((GamePlayer.approvalRating / GamePlayer.maxApproval) * Math.PI / 2) * 15
      var green = Math.floor(Math.random()*flicker) + 153;
      GameView.ctx.fillStyle="rgb(0,"+green+",0)";
      GameView.ctx.fillText(this.displayContent[i], 24, 25 * i + 30 );
    }
  },
  _replaceChar: function(string, index, character)
  {
    return string.substr(0, index) + character + string.substr(index+character.length);
  }
}
