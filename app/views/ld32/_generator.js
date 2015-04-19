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
    [
      'You need someone with my 1337 skillz.',
    ],
    [
      'You need root? I can get it.',
    ],
    [
      "Firewalls? Psssh. You want to get past them, I'm your man.",
    ],
    [
      "What I do have are a very particular set of skills, skills I",
      "have acquired over a very long career."
    ]
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
  new_pwn_target: [
    [
      '%ip% is a potential target',
      "Let's expand our operational capability."
    ],
    [
      '%ip% presents strategic importance.',
      "You know what to do."
    ]
  ],
  generate_exploit: [
    [
      'Found a russian darknet forum with a useful technique in it.',
      'Added it to the toolchain.'
    ],
    [
      "Is there any reason we aren't using CVE-"+(Math.floor(Math.random() * 0x1000).toString(16))+"?"
    ],
    [
      "Please find attached malware sample. Utilises novel techniques for",
      'popping shells on hardened clients.'
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
  message_new_pwn_target: function(target)
  {
    lines = this.new_pwn_target[Math.floor(Math.random() * this.new_pwn_target.length)]

    lines = lines.map(function(line) {
      return line.replace('%ip%', target.ip)
    });

    return lines
  },
  message_generate_exploit: function()
  {
    lines = this.generate_exploit[Math.floor(Math.random() * this.generate_exploit.length)]
    lines = lines.concat(['','1 Exploit Found.'])

    console.log(lines)

    return lines
  },
  member_stats: function(member)
  {
    stats =  [
      '',
      'Codename:     ' + member.name,
      'Attribution:  ' + member.skills.attribution.toFixed(3),
      'Scanning:     ' + member.skills.scanning.toFixed(3),
      'Exploitation: ' + member.skills.exploitation.toFixed(3),
      'Pwnage:       ' + member.skills.pwnage.toFixed(3),
      'Price:        ' + member.btc.toFixed(8)+' btc/day'
    ]

    for(var i=0; i<stats.length;i++)
    {
      stats[i] = padString(stats[i], 38)
    }

    return stats;
  },
  target_stats: function(target)
  {
    var target_stats = [
      'IP:             ' + target.ip,
      'Attribution:    ' + target.stats.attribution,
      'Scannability:   ' + target.stats.scannability,
      'Exploitability: ' + target.stats.exploitability,
      'Pwnability:     ' + target.stats.pwnability,
      '',
      'Mission Type:   ' + target.type
    ]

    us_stats = this.get_total_skills();

    for(var i=0; i<target_stats.length;i++)
    {
      target_stats[i] = padString(target_stats[i], 38)
    }

    for(var i=0; i<us_stats.length;i++)
    {
      us_stats[i] = padString(us_stats[i], 38)
    }

    for(var i=0;i<target_stats.length; i++)
    {
      target_stats[i] = target_stats[i] +"" + us_stats[i];
    }

    return target_stats;
  },

  get_total_skills: function()
  {
    return [
      'Total Skills:       ',
      '  Attribution:      ' + GamePlayer.totals.skills.attribution().toFixed(3),
      '  Scanning:         ' + GamePlayer.totals.skills.scanning().toFixed(3),
      '  Exploitation:     ' + GamePlayer.totals.skills.exploitation().toFixed(3),
      '  Pwnage:           ' + GamePlayer.totals.skills.pwnage().toFixed(3),
      'Deniability:        ' + GamePlayer.totals.stats.deniability().toFixed(0)+"%",
      ''
    ]
  },

  show_total_power: function()
  {
    stats = GamePlayer.totals;
    a1 = [
      'Pwned:  ',
      '  Proxies:         ' + stats.pwned.proxies,
      '  Botnet :         ' + stats.pwned.botnet,
      'Exploits:          ',
      '  Standard:        ' + stats.exploits.standard,
      '  Zeroday:         ' + stats.exploits.zeroday,
      '                   '
    ]

    a2 = this.get_total_skills();

    for(var i=0; i<a1.length;i++)
    {
      a1[i] = padString(a1[i], 38);
    }

    for(var i=0; i<a2.length;i++)
    {
      a2[i] = padString(a2[i], 38)
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
