var Team = {
  renderTeam: function(){
    var teamSize = GamePlayer.team.length
    var offset   = 0
    if(teamSize > 0)
    {
      x = GamePlayer.team[offset]
      y = GamePlayer.team[offset + 1]

      all_text = Generator.show_total_power();
      member_text = []

      if(typeof y == 'object')
      {
        member_text = Generator.show_two_members(x, y);
      } else if(typeof x == 'object') {
        member_text = Generator.member_stats(x)
      } else {
        member_text = [ 'Members not found.' ]
      }

      for(var i=0; i<all_text.length;i++)
      {
        GameViewText.changeLine(4 + i, all_text[i])
      }

      for(var i=0; i<member_text.length;i++)
      {
        GameViewText.changeLine(12 + i, member_text[i])
      }

    } else {
      GameViewText.changeLine(14, "No recruited team members.")
    }
  }
}
