var Attack = {
  progress: 25,
  maxProgress: 50,
  target: null,
  target_idx:-1,
  in_progress: false,
  attack_type: '',
  stepInterval: null,
  log: [],
  start:function(target_idx, type)
  {
    this.target_idx  = target_idx
    this.target      = GamePlayer.targets[target_idx]
    this.attack_type = type

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
    var multiplier = 1 * Math.pow(0.9, (GamePlayer.daysCompleted / 7))
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

    var event_text = []

    switch(this.attack_type)
    {
      case 'proxy':
        GamePlayer.totals.pwned.proxies++;
        event_text = Generator.message_win_proxy();
      break;
      case 'botnet':
        GamePlayer.totals.pwned.botnet++;
        event_text = Generator.message_win_botnet();
      break;
    }

    //Add win event to queue.
    event = {
      text: event_text,
      actions: {
        'Disconnect': function(){
          GameMenuState.changeState('day')
        }
      }
    }
    GameDay.events.push(event);
    // Remove target
    GamePlayer.targets.splice(this.target_idx, 1)

    this.finish();
  },
  lose:function()
  {
    var rollTarget = (GamePlayer.totals.stats.deniability() - this.target.stats.attribution) + 10 * Math.sin(Math.random() * 2 * Math.PI)
    rollTarget = Math.min(rollTarget, 100);
    rollTarget = Math.max(rollTarget, 0);

    var roll = Math.random();

    barTarget = Math.round(rollTarget / 2);
    barRoll   = Math.round(roll * 50)

    var b1 = '           ['
    b1 += Array(barTarget + 1).join("X")
    b1 += Array((50 - barTarget) + 1).join(".")
    b1 += "]  "

    var b2 = '           ['
    b2 += Array(barRoll + 1).join("X")
    b2 += Array((50 - barRoll) + 1).join(".")
    b2 += "]  "

    var avoided = barRoll < barTarget;
    var result = ''

    if(avoided)
    {
      result = ['Avoided all traces of attribution.']
    } else {

      var approval_loss = Math.round(Math.random() * 6) + 7
      GamePlayer.approvalRating -= approval_loss

      result = [
        '[ALARM] Indicators of Compromise linked to this facility.',
        '',
        (approval_loss * 2) + '% approval rating lost.'
      ]
    }

    failure_text = [
      '[ACCESS DENIED]',
      'Hostile system successfully applied countermeasures.',
      'Hiding Traces of activities. ',
      '',
      '127.0.0.1: ',
      b1,
      this.target.ip+": ",
      b2,
      '',
    ].concat(result)



    //Add lose event to queue
    event = {
      text: failure_text,
      actions: {
        'Disconnect': function() {
          GameMenuState.changeState('day')
        }
      }
    }
    GameDay.events.push(event);

    this.finish();
  },
  finish:function()
  {
    clearInterval(Attack.stepInterval)
    this.in_progress  = false;
    this.target       = null;
    this.target_idx   = -1;
    this.progress     = 25;
    this.log          = [];
    this.attack_type  = '';
    //Kick user back into main application flow.
    GameMenuState.changeState('day')
  }
}
