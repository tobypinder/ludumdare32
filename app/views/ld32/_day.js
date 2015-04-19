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

  goodEventChance:function(always, perc, dep)
  {
    return (perc * Math.pow(1-perc, dep * GamePlayer.daysCompleted)) + always
  },
  seedRandom:function()
  {
    this.seedRandomMemberEvent();

    this.seedRandomDay();
  },
  seedRandomDay:function()
  {
    // TODO: Generate more dynamic actual days.
    GameDay.current.text = Generator.message_day_nothing(),
    GameDay.current.actions = {
      'Continue': function(){
      }
    }
  },
  seedRandomMemberEvent:function()
  {
    // A random day
    chance = this.goodEventChance(0.2, 0.1, 0.1)
    roll   = Math.random()

    if(roll <= chance)
    {
      GameDay.events.push(this.getMemberOffer())
    }
  },
  seedStaticFirstDay:function()
  {
    member = GamePlayer.generateTeamMember();


    GameDay.current = this.getMemberOffer(
      member,
      [
        "Asset "+ member.name + ' reporting in.',
        "Was instructed to contact you after APT program initialization.",
        '',
        'Awaiting further instructions.'
      ].concat(Generator.member_stats(member))
    )

    //TODO: Remove
    // this.addEventToCalendar(
    //   this.in_x_days(GamePlayer.date, 3),
    //   {
    //     name: 'Hello',
    //     text: ['Oopsie doopsie!'],
    //     actions: {
    //       'OK?': function(){}
    //     }
    //   },
    //   true //false
    // )
  },

  getMemberOffer:function(member, text, text_accept, text_reject)
  {
    if (typeof member === 'undefined')      { member      = GamePlayer.generateTeamMember(); }
    if (typeof text === 'undefined')        { text        = Generator.message_member_offer(member); }
    if (typeof text_accept === 'undefined') { text_accept = Generator.message_member_accept(); }
    if (typeof text_reject === 'undefined') { text_reject = Generator.message_member_refusal(); }

    return {
      member_offer: member,
      text: text,
      actions: {
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
          GameDay.events.push(event)
        }
      }
    }
  },

  addEventToCalendar:function(date, event, visibility)
  {
    this.calendar.push({date: date, event: event, visibility: visibility})
  },
  addEventsFromCalendar:function() {
    this.calendar.forEach(function(entry) {
      if(entry.date.valueOf() == GamePlayer.date.valueOf())
      {
        GameDay.events.push(entry.event)
      }
    });
  },

  seedBailoutEvent:function()
  {
    event = {
      name: 'Bailout',
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
