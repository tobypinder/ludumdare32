var Generator = {
  p1: [
    'ACID',
    'ZERO',
    'FIRE',
    'CLOAK',
    'TREE',
    'SHADOW',
    'RED',
    'BLUE',
    'GREEN',
    'WHITE',
    'BLACK',
    'SPRAY',
    'RADIO',
    'SMART'
  ],
  p2: [
    'FOX',
    'BURN',
    'COOL',
    'CONFIG',
    'BEARD',
    'PUNK',
    'DRAGON',
    'SNAKE',
    'LION',
    'SWORD',
    'SQUIRREL',
    'SEED'
  ],
  member_refusal: [
    [
      'I will take my services elsewhere.'
    ],
    [
      "I'm sure another nation will adequately compensate",
      'me for my skils.'
    ],
    [
      'Your loss.'
    ],
  ],
  member_accept: [
    [
      'Glad to be of service.'
    ],
    [
      "I'll put my corporate clients on hold immediately.",
    ],
    [
      'Fascinating...'
    ],
  ],
  member_offer: [
    [
      'So, I heard you folks have a little clandestine department thingy',
      'going on...'
    ],
  ],
  day_nothing: [
    [
      'Nothing to report.'
    ],
    [
      'Awaiting Instructions'
    ],
    [
      'Scanning /0. '
    ],
    [
      'System nominal.'
    ],
  ],
  team_member: function()
  {
    var name1 = this.p1[Math.floor(Math.random() * this.p1.length)]
    var name2 = this.p2[Math.floor(Math.random() * this.p2.length)]

    return name1 + name2
  },
  message_member_refusal: function()
  {
    return this.member_refusal[Math.floor(Math.random() * this.member_refusal.length)]
  },
  message_member_accept: function()
  {
    return this.member_accept[Math.floor(Math.random() * this.member_accept.length)]
  },
  message_member_offer: function(member)
  {
    return this.member_offer[Math.floor(Math.random() * this.member_offer.length)].concat(Generator.member_stats(member))
  },
  message_day_nothing: function()
  {
    return this.day_nothing[Math.floor(Math.random() * this.day_nothing.length)]
  },
  member_stats: function(member)
  {
    stats =  [
      'Codename:     ' + member.name,
      'Attribution:  ' + member.skills.attribution,
      'Scanning:     ' + member.skills.scanning,
      'Exploitation: ' + member.skills.exploitation,
      'Pwnage:       ' + member.skills.pwnage,
      'Price:        ' + member.btc.toFixed(8)+' btc/day'
    ]

    for(var i=0; i<stats.length;i++)
    {
      while(stats[i].length < 38)
      {
        stats[i]=stats[i]+" ";
      }
    }

    return stats;
  },
  show_total_power: function()
  {
    stats = GamePlayer.totals;
    a1 = [
      'Pwned:  ',
      '  Proxies:         ' + stats.pwned.proxies,
      '  Botnet :         ' + stats.pwned.botnet,
      'Exploits: ',
      '  Standard:        ' + stats.exploits.standard,
      '  Zeroday:         ' + stats.exploits.zeroday,
    ]

    a2 = [
      'Total Skills:       ',
      '  Attribution:      ' + stats.skills.attribution(),
      '  Scanning:         ' + stats.skills.scanning(),
      '  Exploitation:     ' + stats.skills.exploitation(),
      '  Pwnage:           ' + stats.skills.pwnage(),
      'Deniability:        ' + stats.stats.deniability().toFixed(0)+"%"
    ]

    for(var i=0; i<a1.length;i++)
    {
      while(a1[i].length < 38)
      {
        a1[i]=a1[i]+" ";
      }
    }

    for(var i=0; i<a2.length;i++)
    {
      while(a2[i].length < 38)
      {
        a2[i]=a2[i]+" ";
      }
    }

    for(var i=0;i<a1.length; i++)
    {
      a1[i] = a1[i] +"" + a2[i];
    }

    return a1;
  },
  show_two_members: function(m1, m2)
  {
    var s1 = this.member_stats(m1);
    var s2 = this.member_stats(m2);

    for(var i=0;i<s1.length; i++)
    {
      s1[i] = s1[i] +"" + s2[i];
    }

    return s1
  }


}
