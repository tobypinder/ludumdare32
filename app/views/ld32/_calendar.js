var Calendar = {
  renderCalendar: function(){
    var entries   = GameDay.calendar.sort(function(x, y)
    {
      if(x.date < y.date)
      {
        return -1
      } else if(x.date > y.date) {
        return 1
      } else {
        return 0
      }
    });

    entries = entries.filter(function(x)
    {
      return (x.visibility == true)
    });

    if(entries.length > 0)
    {
      GameViewText.changeLine(4, "Schedule")

      var count = Math.min(entries.length, 12)
      var offset = 0 // TODO

      for(var i=0; i<count; i++)
      {
        date = GameDay.displayDate(entries[i].date)
        name = entries[i].event.name || 'Unknown Event'
        GameViewText.changeLine(6 + i, date + "  " + name)
      }
    } else {
      GameViewText.changeLine(7, "No scheduled events.")
    }
  }
}
