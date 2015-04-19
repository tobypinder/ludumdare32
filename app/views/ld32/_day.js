var GameDay = {
  current: null,
  events: [
    // {text:, actions:}
  ],
  calendar: [
    // future events: { date:, event: }
  ],
  displayDate: function(date){
    month = date.getMonth()+''
    if(month.length == 1)
    {
      month = ' ' + month
    }

    day = date.getDate()
    if(day.length == 1)
    {
      day = ' ' + day
    }

    return month + "/" + day
  },
  in_x_days:function(old_date, days)
  {
    var date = new Date(old_date);
    date.setDate(date.getDate() + days);
    return date;
  },
  advance: function()
  {
    //Modify Player stats
    GamePlayer.daysCompleted+= 1;
    GamePlayer.performBalanceChange();



    //Set Date
    GamePlayer.date = this.in_x_days(GamePlayer.date.valueOf(), 1);

    //Add from Calendar
    this.addEventsFromCalendar();

    GameDay.current = {
      member_offer: null,
      text: [],
      actions: {}
    }

    if(GamePlayer.totals.btc < 0 && GameDay.events.length == 0)
    {
      this.seedBailoutEvent();
    }

    if(GamePlayer.daysCompleted == 1)
    {
      this.seedStaticFirstDay();
    } else
    {
      this.seedRandom();
    }
  },
  render:function()
  {
    var startLine = 3
    GameDay.current.text.forEach(function(line){
      GameViewText.changeLine(startLine++, line)
    });

    startLine = 16
    $.each(GameDay.current.actions, function(key, value)
    {
      GameViewText.changeLine(startLine++, "{" + key + "}")
    });

  },
  renderEvent:function()
  {
    event = this.events[0];

    var startLine = 3
    event.text.forEach(function(line){
      GameViewText.changeLine(startLine++, line)
    });

    startLine = 16
    $.each(event.actions, function(key, value)
    {
      GameViewText.changeLine(startLine++, "{" + key + "}")
    });
  },
  seedRandom:function()
  {
    // TODO: ALL THE GENERATION!
    GameDay.current.text = [
      "Nothing Happened."
    ]
    GameDay.current.actions = {
      'Advance': function(){
      }
    }
  },
  seedStaticFirstDay:function()
  {
    member = GamePlayer.generateTeamMember();
    this.seedMemberOffer(
      member,
      [
        "Asset "+ member.name + ' reporting in.',
        "Was instructed to contact you after APT program initialization.",
        '',
        'Awaiting further instructions.'
      ].concat(Generator.member_stats(member))
    )

    //TODO: Remove
    this.addEventToCalendar(
      this.in_x_days(GamePlayer.date, 3),
      {
        text: ['Oopsie doopsie!'],
        actions: {
          'OK?': function(){}
        }
      },
      true //false
    )
  },

  seedMemberOffer:function(member, text, text_accept, text_reject)
  {
    if (typeof member === 'undefined')      { member      = GamePlayer.generateTeamMember(); }
    if (typeof text === 'undefined')        { text        = Generator.message_member_offer(); }
    if (typeof text_accept === 'undefined') { text_accept = Generator.message_member_accept(); }
    if (typeof text_reject === 'undefined') { text_reject = Generator.message_member_refusal(); }

    GameDay.current.member_offer = member
    GameDay.current.text = text

    GameDay.current.actions = {
      'Accept': function(){
        GamePlayer.addMember(member)
        event = {
          text: text_accept.concat(Generator.member_stats(member)),
          actions: {
            'Continue': function() {}
          }
        }
      },
      'Reject': function(){
        event = {
          text: text_reject,
          actions: {
            'Continue': function() {}
          }
        }
        console.log(event);
        GameDay.events.push(event)
      }
    }

  },

  addEventToCalendar:function(date, event, visibility)
  {
    this.calendar.push([date, event, visibility])
  },
  addEventsFromCalendar:function() {
    console.log("Date:")
    console.log(GamePlayer.date)
    console.log("---")
    this.calendar.forEach(function(entry) {

      console.log(entry)
      if(entry[0].valueOf() == GamePlayer.date.valueOf())
      {
        GameDay.events.push(entry[1])
      }
    });
  },

  seedBailoutEvent:function()
  {
    event = {
      text: [
        "Fiscal performance is unacceptable.",
        "Emergency Program Funding has been activated.",
        "Adapt to sensible budget constraints or face",
        "immediate consequence.",
        "",
        "",
        "",
        'Emergency Funds: '+GamePlayer.calculateBailout().toFixed(8) + ' BTC'
      ],
      actions: {
        'Bailout': function(){
          GamePlayer.performBailout();
        },
      }
    }

    this.events.push(event)
  }

}
