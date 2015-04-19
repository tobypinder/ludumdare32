var GameMenuState = {
  currentState: 'main',
  skipRender: false,
  applyCurrentState: function()
  {
    switch(this.currentState)
    {
      case 'main':
        this.applyMain();
      break;

      case 'day':
        this.applyGameDay();
      break;

      case 'team':
        this.applyTeam()
      break;

      case 'date':
        this.applyDate()
      break;

      case 'targets':
        this.applyTargets()
      break;

      case 'btc':
        this.applyBTC()
      break;

      case 'reject_main':
        this.applyRejectMain();
      break;

      case 'game_over_approval':
        this.applyGameOverApproval();
      break;

      case 'accept_main':
        this.applyAcceptMain();
      break;

      default:
      console.warn('Unhandled state: ['+this.currentState+'] ')
      break;
    }
  },
  changeState: function(state)
  {
    this.currentState = state
    this.applyCurrentState()
  },
  applyMain: function()
  {
    GameViewText.changeLine(0, "v0.0.5 APT Management Console.")
    GameViewText.changeLine(1, "Establishing Secure Connection Protocols               [ OK ]")
    GameViewText.changeLine(2, "Connecting to MILCOM Network                           [ OK ]")
    GameViewText.changeLine(3, "")
    GameViewText.changeLine(4, "Message found >>> PUBKEY matches fingerprint ")
    GameViewText.changeLine(5, "From: Cloaked/09f911029d/")
    GameViewText.changeLine(5, "---")
    GameViewText.changeLine(6, "Congrats on the congressional funding. But it's time now.")
    GameViewText.changeLine(7, "We need you to form a department, train operatives, and")
    GameViewText.changeLine(8, "become operational. We have plans for China, Russia, Iran...")
    GameViewText.changeLine(9, "Don't let me down.")

    GameViewText.changeLine(11, "{ACCEPT}")
    GameViewText.changeLine(12, "{REJECT}")

    GameViewText.changeLine(22, "[^v<>] Navigate   [Ent] Accept  [ ] Expedite Terminal Redraw ")
  },
  applyRejectMain: function()
  {
    GameViewText.wipeScreen()
    GameViewText.changeLine(0, "Message found >>> PUBKEY matches fingerprint ")
    GameViewText.changeLine(1, "---")
    GameViewText.changeLine(2, "You're rejecting? I don't have time for insubordination.")
    GameViewText.changeLine(3, "After all we worked for... What, you think you can pull a Snowden?")
    GameViewText.changeLine(4, "Fat chance.")

    GameViewText.changeLine(20, "Terminal Access Rights Revoked. Data expunged.")
  },

  applyGameOverApproval: function()
  {
    GameViewText.wipeScreen()
    GameViewText.changeLine(0, "Message found >>> PUBKEY matches fingerprint ")
    GameViewText.changeLine(1, "---")
    GameViewText.changeLine(2, "Your performance has been deemed unsatisfactory by the council.")
    GameViewText.changeLine(3, "Consider your employment terminated immediately.")

    GameViewText.changeLine(17, "Employment Length: "+ GamePlayer.daysCompleted +" days")

    GameViewText.changeLine(20, "Terminal Access Rights Revoked. Data expunged.")
  },
  applyAcceptMain: function()
  {
    GameViewText.wipeScreen()
    GameViewText.header()

    GameViewText.changeLine(0, "Good. Here's your stipend. Get recruiting, build your team, and")
    GameViewText.changeLine(1, "stockpile vulnerabilities. We need you operational ASAP.")

    this.addBTCLine(7, 3, 'Departmental Seed Capital.')
    GameViewText.changeLine(11, "{ACCEPT}")
    GameViewText.footer()
  },
  applyGameDay:function()
  {
    GameViewText.wipeScreen()

    if(GameDay.current == null)
    {
      GameDay.advance();
    }
    if(GameDay.events.length > 0)
    {
      GameDay.renderEvent();

    } else {
      GameViewText.header()
      GameDay.render();
      GameViewText.footer()
    }

    if(GamePlayer.approvalRating <= 0)
    {
      this.changeState('game_over_approval');
    }
  },
  applyTeam:function()
  {
    GameViewText.wipeScreen()
    GameViewText.header()
    Team.renderTeam();
    GameViewText.footer()
  },
  applyDate:function()
  {
    GameViewText.wipeScreen()
    GameViewText.header()

    Calendar.renderCalendar();

    GameViewText.footer()
  },
  applyTargets:function()
  {
    GameViewText.wipeScreen()
    GameViewText.header()

    Targets.renderTargets();

    GameViewText.footer()
  },
  applyBTC:function()
  {
    GameViewText.wipeScreen()
    GameViewText.header()

    Wallet.renderTransactions();

    GameViewText.footer()
  },
  addBTCLine: function(line, amount, reason)
  {
    if (typeof reason === 'undefined') { reason = 'Undocumented Income. SECRET//NOFORN'; }

    var verb = amount > 0 ? 'added' : 'removed'
    GameViewText.changeLine(line, amount + ' BTC ' + verb);
    GamePlayer.balanceSheet.push([GamePlayer.date, reason, amount])
    GamePlayer.totals.btc += amount
  },
}
