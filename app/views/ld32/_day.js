var GameDay = {
  current: null,
  events: [
    // {text:, actions:}
  ],
  calendar: [
    // future events: { date:, event:, visibility:  }
  ],
  displayDate: function(date){
    month = (date.getMonth()+1)+''
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

  // EVENT GENERATION

  goodEventChance:function(constant, chance, depreciation)
  {
    var value = constant + chance * Math.pow(1- depreciation, GamePlayer.daysCompleted);
    return value;
  },
  seedRandom:function()
  {
    this.seedRandomMemberEvent();
    this.seedRandomPwnTargetEvent();
    this.seedRandomGenerateExploitEvent();
    this.seedRandomBuyZeroDayEvent();
    this.seedRandomCalendarTargetEvent();
    this.seedRandomExploitInvestEvent();


    this.seedRandomDay();
  },
  seedRandomExploitInvestEvent:function()
  {
    var chance = 0.02;
    var roll   = Math.random();
    if(roll <= chance)
    {
      var price = roundStat(0.2 + Math.random() * 0.2, 8)

      this.events.push({
        text: [
          'Funding Request: Reverse Engineering',
          'Source: Unknown advanced sample found',
          '   on highrisk target',
          'Amount: '+price.toFixed(8)+" BTC",
          '',
          'Approve?'
        ],
        actions: {
          'Yes': function()
          {
            if(GamePlayer.totals.btc > price)
            {
              GamePlayer.totals.btc -= price
              GamePlayer.balanceSheet.push([GamePlayer.date, 'Research Investment', -price])

              // Add research fruition.
              for(var x=0; x<3; x++)
              {
                var date = GameDay.in_x_days(GamePlayer.date, (Math.random()*2+5)*(x+1))
                var maturity = {
                  text: [
                    'Malware research yielded usable results.',
                    '',
                    '1 Exploit Added.'
                  ],
                  actions: {
                    'OK': function(){
                      GamePlayer.totals.exploits.standard++;
                    }
                  }
                }

                GameDay.calendar.push({date: date, event: maturity, visibility: false} )
              }

              var tx = {
                text: ['Funds allocated.','','Removed '+price.toFixed(8)+" BTC"],
                actions: {
                  'OK': function(){}
                }
              }

              GameDay.events.push(tx)
            }
          },
          'No': function()
          {

          }
        }
      });

    }
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
  seedRandomCalendarTargetEvent:function()
  {
    var chance = 0.08;
    var roll   = Math.random();
    //

    if(roll <= chance)
    {
      var day = this.in_x_days(GamePlayer.date, Math.round(Math.random() * 5) + 5);
      var target = GamePlayer.generateTarget('HIT');

      var event = {
        text: Generator.message_new_calendar_target(target, day),
        actions: {
          'OK': function()
          {
            GamePlayer.targets.push(target);

            var calendar_event = {
              name: 'Takedown ' + target.ip + ' before' + GameDay.displayDate(day),
              text: Generator.message_check_calendar_target(target, day),
              actions: {
                'More': function()
                {
                  var ips = GamePlayer.targets.map(function(t){ return t.ip })
                  var found = ips.indexOf(target.ip) !== -1;
                  if (found) {
                    GameDay.spawnCalendarEventFailure(target)
                  } else {
                    GameDay.spawnCalendarEventSuccess(target)
                  }
                }
              }
            }

            GameDay.calendar.splice(1, 0, {
              date: day,
              event: calendar_event,
              visibility: true
            });
          }
        }
      }

      GameDay.events.push(event)
    }
  },
  spawnCalendarEventSuccess:function(target)
  {
    var approvalGain = (Math.round(Math.random()*3) + 2)
    var event = {
      text: Generator.message_takedown_success(approvalGain),
      actions: {
        'Continue': function(){
          GamePlayer.approvalRating += approvalGain
        }
      }
    }
    GameDay.events.splice(1, 0, event)
  },
  spawnCalendarEventFailure:function(target)
  {
    var approvalLoss = (Math.round(Math.random()*3) + 8)

    var event = {
      text: Generator.message_takedown_failure(approvalLoss),
      actions: {
        'Continue': function(){
          GamePlayer.approvalRating -= approvalLoss

          var ips = GamePlayer.targets.map(function(t){ return t.ip })

          GamePlayer.targets.splice(ips.indexOf(target.ip), 1)
        }
      }
    }
    GameDay.events.splice(1, 0, event)
  },
  seedRandomGenerateExploitEvent:function()
  {
    // CHANCE
    var added_chance = (GamePlayer.totals.skills.exploitation() / 100) - (GamePlayer.daysCompleted / 1000)

    added_chance = Math.max(added_chance, 0)

    var chance = this.goodEventChance(0.01, 0.05, 0.05) + added_chance
    var roll   = Math.random()
    //

    if(roll <= chance)
    {
      var event = {
        text: Generator.message_generate_exploit(),
        actions: {
          'Stockpile': function()
          {
            GamePlayer.totals.exploits.standard += 1
          }
        }
      }

      GameDay.events.push(event)
    }
  },
  seedRandomBuyZeroDayEvent:function()
  {
    // CHANCE
    var chance = this.goodEventChance(0.01, 0.05, 0.08)
    var roll   = Math.random()

    if(roll <= chance)
    {
      var price = 1 + (Math.random() / 5) * (1 + (GamePlayer.daysCompleted / 30))

      var event = {
        text: Generator.message_buy_zeroday(price),
        actions: {
          'Yes': function()
          {
            if(GamePlayer.totals.btc > price)
            {
              GamePlayer.totals.exploits.zeroday += 1
              GamePlayer.totals.btc -= price
              GamePlayer.balanceSheet.push([GamePlayer.date, 'Purchased Zeroday', -price])

              var tx = {
                text: [
                  'Added 1 Zeroday Exploit',
                  'Removed '+price.toFixed(8)+" BTC"],
                actions: {
                  'OK': function(){}
                }
              }

              GameDay.events.push(tx)
            }
          },
          'No': function()
          {

          }
        }
      }

      GameDay.events.push(event)
    }
  },
  seedRandomMemberEvent:function()
  {
    // CHANCE
    chance = this.goodEventChance(0.03, 0.07, 0.05)
    roll   = Math.random()
    //

    if(roll <= chance)
    {
      GameDay.events.push(this.getMemberOffer())
    }
  },
  seedRandomPwnTargetEvent:function()
  {
    // CHANCE
    var added_chance = (GamePlayer.totals.skills.scanning() / 100) - (GamePlayer.daysCompleted / 1000)

    added_chance = Math.max(added_chance, 0)
    var chance = this.goodEventChance(0.025, 0.2, 0.05) + added_chance
    var roll   = Math.random()
    //

    if(roll <= chance)
    {
      var target = GamePlayer.generateTarget('PWN')
      var event = {
        text: Generator.message_new_pwn_target(target),
        actions: {
          'Add': function() {
            GamePlayer.targets.push(target);
          }
        }
      }
      GameDay.events.push(event);
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
  },

  // EVENT GENERATION END

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
          var event = {
            text: text_accept.concat(Generator.member_stats(member)),
            actions: {
              'Continue': function() {}
            }
          }
        },
        'Reject': function(){
          var event = {
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
    var new_calendar = []

    this.calendar.forEach(function(entry) {
      if(entry.date.valueOf() == GamePlayer.date.valueOf())
      {
        GameDay.events.push(entry.event)
      } else {
        new_calendar.push(entry)
      }
    });

    this.calendar = new_calendar;
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
