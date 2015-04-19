var GameAction = {
  applyAction:function(state, action)
  {
    switch(state)
    {
      case 'main':
        this.applyActionForMain(action)
      break;

      case 'day':
        this.applyActionForDay(action)
      break;

      case 'team':
        this.applyActionForTeam(action)
      break;

      case 'targets':
        this.applyActionForTargets(action)
      break;

      case 'date':
        this.applyActionForDate(action)
      break;

      case 'btc':
        this.applyActionForBTC(action)
      break;

      case 'accept_main':
        GameMenuState.changeState('day')
      break;

      default:
        console.warn('No action performed for State['+state+'], Action['+action+']')
      break;
    }
  },
  applyActionForMain:function(name)
  {
    switch(name)
    {
      case 'ACCEPT':
        GameMenuState.changeState('accept_main')
      break;
      case 'REJECT':
        GameMenuState.changeState('reject_main')
      break;
    }
  },

  applyActionForFooter:function(name)
  {
    switch(name)
    {
      case 'Sitrep':
        GameMenuState.changeState('day');
      break;
      case 'Team':
        GameMenuState.changeState('team');
      break;
      case 'Targets':
        GameMenuState.changeState('targets');
      break;
      case 'Date':
        GameMenuState.changeState('date');
      break;
      case 'BTC':
        GameMenuState.changeState('btc');
      break;
    }
  },
  footerMethods: function()
  {
    ['Sitrep', 'Team', 'Targets', 'Date', 'BTC']
  },
  applyActionForDay:function(name)
  {
    this.applyActionForFooter(name);


    var firedEvent = false

    if(GameDay.events.length > 0)
    {
      $.each(GameDay.events[0].actions, function(action, method)
      {
        if(name == action) {

          method()
          firedEvent = true
          GameDay.events.shift()
        }
      })
    } else {
      $.each(GameDay.current.actions, function(action, method)
      {
        if(name == action) {

          method()
          firedEvent = true
          GameDay.current = null
        }
      });
    }

    if(firedEvent)
    {
      GameViewText.currentAction = 0
      GameMenuState.applyGameDay();
    }
  },
  applyActionForTeam:function(name)
  {
    this.applyActionForFooter(name);
  },
  applyActionForTargets:function(name)
  {
    this.applyActionForFooter(name);
  },
  applyActionForDate:function(name)
  {
    this.applyActionForFooter(name);
  },
  applyActionForBTC:function(name)
  {
    this.applyActionForFooter(name);
  }
}
