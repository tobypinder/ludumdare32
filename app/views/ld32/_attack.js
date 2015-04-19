var Attack = {
  progress: 25,
  maxProgress: 50,
  target: null,
  in_progress: false,
  stepInterval: null,
  log: [],
  start:function(target)
  {
    this.target = target

    GameAction.resetTargetState(true);
    GameViewText.wipeScreen()

    this.in_progress  = true;
    this.stepInterval = setInterval(function(){ Attack.step();}, 100)

    this.renderActions();
  },
  renderActions:function()
  {
    GameViewText.changeLineImmediately(16, '')
    GameViewText.changeLineImmediately(17, '');
    GameViewText.actions = []
    var exploitString = (GamePlayer.totals.exploits.standard > 0) ? ("{Exploit} x"+GamePlayer.totals.exploits.standard) : ''
    var zerodayString = (GamePlayer.totals.exploits.zeroday > 0) ? ("{ZeroDay} x"+GamePlayer.totals.exploits.zeroday) : ''
    GameViewText.changeLineImmediately(16, exploitString )
    GameViewText.changeLineImmediately(17, zerodayString );
  },
  modifyProgress:function()
  {
    var multiplier = 10 * Math.pow(0.9, (GamePlayer.daysCompleted / 7))
    var roll = Math.random()

    if(roll <= 0.1)
    {
      var amount = multiplier * Math.random() * GamePlayer.totals.skills.pwnage();
      this.log.unshift(Generator.get_attack(amount));
      this.progress += amount;
    } else if(roll <= 0.2) {
      var amount = multiplier * Math.random() * this.target.stats.pwnability;
      this.log.unshift(Generator.get_defend(amount));
      this.progress -= amount;
    }
  },
  step:function()
  {
    if(this.progress >= 50)
    {
      this.win();
    }
    else if(this.progress <= 0)
    {
      this.lose();
    } else
    {
      var bar = '         ['
      var roundProgress = Math.floor(Attack.progress);
      roundProgress = Math.max(roundProgress, 0)
      roundProgress = Math.min(roundProgress, 50)

      bar += Array(roundProgress + 1).join(".")
      bar += "[X]"
      bar += Array((50 - roundProgress) + 1).join(".")
      bar += "] "

      GameViewText.changeLineImmediately(7, bar);
      GameViewText.changeLineImmediately(8, "127.0.0.1" + (Array(47).join(' ')) + Attack.target.ip)

      var logCount = Math.min(5, this.log.length)
      for(var i=0;i<logCount;i++)
      {
        GameViewText.changeLineImmediately(10 + i, this.log[i]);
      }

      this.modifyProgress();
      //Can call win/lose then must call finish.
    }
  },
  win:function()
  {
    //Add win event to queue.
    this.finish();
  },
  lose:function()
  {
    //Add lose event to queue
    this.finish();
  },
  finish:function()
  {
    clearInterval(Attack.stepInterval)
    this.in_progress  = false;
    this.target       = null;
    this.progress     = 25;
    this.log          = [];
    //Kick user back into main application flow.
    GameMenuState.changeState('day')
  }
}
