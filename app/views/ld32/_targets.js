var Targets = {
  currentPage: 0,
  currentTarget: null,
  types: ['PWN', 'EXPLOIT'],
  renderTargets: function(){
    var entries = GamePlayer.targets

    if(entries.length > 0)
    {
      GameViewText.changeLine(4, "Target List")

      var o = 10 * this.currentPage // TODO
      var count = Math.min(entries.length - o, 10)

      for(var i=0; i<count; i++)
      {
        var ip   = padString(entries[i+o].ip, 20)
        var type = padString(entries[i+o].type, 15)

        GameViewText.changeLine(6 + i, ip + "   " + type + " {Inspect#"+(i+o)+"}")


      }

      prev = ""
      if(this.currentPage > 0)
      {
        prev += "{Prev}"
      } else {
        prev += "      "
      }

      next  = ""
      if(entries.length > (this.currentPage+1)*10)
      {
        next += "{Next}"
      } else {
        next += "      "
      }

      GameViewText.changeLine(18, prev + "                                                    " + next)
    } else {
      GameViewText.changeLine(7, "No targets found.")
    }
  },
  renderTargetDetail:function(idx)
  {
    GameViewText.wipeMainScreen();

    this.currentTarget =parseInt(idx)

    var target = GamePlayer.targets[idx]

    compare_text = Generator.target_stats(target)


    GameViewText.changeLine(4, '          Target                           Our Capabilities')
    for(var i=0; i<compare_text.length;i++)
    {
      GameViewText.changeLine(5 + i, compare_text[i])
    }

    switch(target.type)
    {
      case 'PWN':
        GameViewText.changeLine(15, 'Pwn machine and convert to:')
        GameViewText.changeLine(16, '  {Proxy} - Add to proxy network. Increases anonymisation.')
        GameViewText.changeLine(17, '  {Slave} - Add to botnet. Increases income.')
      break;
    }
  }
}
