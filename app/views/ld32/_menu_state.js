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
  applyLogo:function()
  {
    GameViewText.changeLine(0,'     ___    ____  ______                                      ')
    GameViewText.changeLine(1,'    /   |  / __ \\/_  __/  Advanced                            ')
    GameViewText.changeLine(2,'   / /| | / /_/ / / /       Persistent      a game for LD32   ')
    GameViewText.changeLine(3,'  / ___ |/ ____/ / /          Threat          by @tobypinder  ')
    GameViewText.changeLine(4,' /_/  |_/_/     /_/                                           ')
  },
  applyMain: function()
  {
    this.applyLogo();

    GameViewText.changeLine(6, "Establishing Secure Connection Protocols               [ OK ]")
    GameViewText.changeLine(7, "Connecting to MILCOM Network                           [ OK ]")
    GameViewText.changeLine(8, "")
    GameViewText.changeLine(9, "Message found >>> PUBKEY matches fingerprint ")
    GameViewText.changeLine(10, "From: Cloaked/09f911029d/")
    GameViewText.changeLine(11, "---")
    GameViewText.changeLine(12, "Congrats on the congressional funding. But it's time now.")
    GameViewText.changeLine(13, "We need you to form a department, train operatives, and")
    GameViewText.changeLine(14, "become operational. We have plans for China, Russia, Iran...")
    GameViewText.changeLine(15, "Don't let me down.")

    GameViewText.changeLine(18, "{ACCEPT}")
    GameViewText.changeLine(19, "{REJECT}")

    GameViewText.changeLine(22, "[^v<>] Navigate Caret  [Ent] Accept  [Space] Faster Terminal")
  },
  applyRejectMain: function()
  {
    GameViewText.wipeScreen()
    this.applyLogo();

    GameViewText.changeLine(6, "Message found >>> PUBKEY matches fingerprint ")
    GameViewText.changeLine(7, "---")
    GameViewText.changeLine(8, "You're rejecting? I don't have time for insubordination.")
    GameViewText.changeLine(9, "After all we worked for... What, you think you can pull a Snowden?")
    GameViewText.changeLine(10, "Fat chance.")

    GameViewText.changeLine(20, "Terminal Access Rights Revoked. Data expunged.")
    GamePlayer.gameover = true
  },

  applyGameOverApproval: function()
  {
    GameViewText.wipeScreen()
    this.applyLogo();

    GameViewText.changeLine(6, "Message found >>> PUBKEY matches fingerprint ")
    GameViewText.changeLine(7, "---")
    GameViewText.changeLine(8, "Your performance has been deemed unsatisfactory by the council.")
    GameViewText.changeLine(9, "Consider your employment terminated immediately.")

    GameViewText.changeLine(17, "Employment Length: "+ GamePlayer.daysCompleted +" days")

    GameViewText.changeLine(20, "Terminal Access Rights Revoked. Data expunged.")
    GamePlayer.gameover = true
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
