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
        return true;
      break;
      case 'Team':
        GameMenuState.changeState('team');
        return true;
      break;
      case 'Targets':
        GameMenuState.changeState('targets');
        return true;
      break;
      case 'Date':
        GameMenuState.changeState('date');
        return true;
      break;
      case 'BTC':
        GameMenuState.changeState('btc');
        return true;
      break;
    }

    return false;
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
    if(this.applyActionForFooter(name))
    {
      //do nothing
    } else if(name.indexOf('Inspect') !== -1 )
    {
      name = name.split('#')
      idx = name[1]
      Targets.renderTargetDetail(idx)

    } else {
      switch(name)
      {

        case 'Next':
          Targets.currentPage++;
          GameMenuState.changeState('targets');
        break;
        case 'Prev':
          Targets.currentPage--;
          GameMenuState.changeState('targets');
        break;

        case 'Proxy':
          // TODO: Chance
          Attack.start(Targets.currentTarget, 'proxy')
        break;
        case 'Slave':
          Attack.start(Targets.currentTarget, 'botnet')
          // TODO: Chance
        break;

        case 'Exploit':
          if(Attack.in_progress === true && GamePlayer.totals.exploits.standard > 0)
          {
            GamePlayer.totals.exploits.standard -= 1
            Attack.progress += 20
            Attack.renderActions();
          }
        break;

        case 'ZeroDay':
        if(Attack.in_progress === true && GamePlayer.totals.exploits.zeroday > 1)
          {
            GamePlayer.totals.exploits.zeroday -= 1
            Attack.progress += 50 // Instant Win.
            Attack.renderActions();
          }
        break;

        default:
          console.warn('Unknown Action on Target: ['+ name +']')
        break;
      }
    }
  },
  resetTargetState:function(skipMenuState)
  {
    if(skipMenuState !== true)
    {
      GameMenuState.changeState('targets');
    }
    Targets.currentPage = 0
    Targets.currentTarget = null
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
