var GamePlayer = {
  approvalRating: 25,
  maxApproval: 50,
  date: new Date(1970, 3, 1),
  daysCompleted: 0,
  team: [],
  targets: [],
  balanceSheet: [],
  totals: {
    btc: 0,
    pwned: {
      proxies: 0,
      botnet: 0,
    },
    exploits: {
      standard: 0,
      zeroday: 0,
    },
    skills: {
      attribution: function() {
        var total = 0
        GamePlayer.team.forEach(function(member){
          total += member.skills.attribution
        })
        return total + 5
      }, //
      scanning: function() {
        var total = 0
        GamePlayer.team.forEach(function(member){
          total += member.skills.scanning
        })
        return total + 5
      },
      exploitation: function() {
        var total = 0
        GamePlayer.team.forEach(function(member){
          total += member.skills.exploitation
        })
        return total + 5
      },
      pwnage: function() {
        var total = 0
        GamePlayer.team.forEach(function(member){
          total += member.skills.pwnage
        })
        return total + 5
      },
    },
    stats: {
      deniability: function()
      {
        //TODO: Better function of available proxies and skill of team.
        return Math.pow(GamePlayer.totals.pwned.proxies + 1, 0.3) * (1 + Math.pow(GamePlayer.totals.skills.attribution(), 0.3)) + 70
      }
    }
  },
  generateTeamMember:function()
  {
    var member = {
      name: Generator.team_member(),
      skills: {
        attribution:  this.generateStat(0.1, 0.5, 0.01, 1, 3),
        scanning:     this.generateStat(0.1, 0.5, 0.01, 1, 3),
        exploitation: this.generateStat(0.1, 0.5, 0.01, 1, 3),
        pwnage:       this.generateStat(0.1, 0.5, 0.01, 1, 3),
      },
      btc: this.generateStat(0.02, 0.1, 0.01, 1.5, 8)
    }
    return member;
  },
  generateTarget: function(type)
  {
    var ip = '' +Math.floor(Math.random() * 0x100) + '.' + Math.floor(Math.random() * 0x100) + '.' + Math.floor(Math.random() * 0x100) + '.' + Math.floor(Math.random() * 0x100)
    //TODO: More diverse than "pwnage" targets
    return {
      ip: ip ,
      type: type,
      stats: {
        attribution: 5, // % to be detected on failure
        scannability: 1,
        exploitability: 1,
        pwnability: 1
      }
    }
  },
  generateStat:function(multiplier, addition, day_multiplier, day_power, digits) {
    var base = Math.cos(Math.random() * Math.PI) * multiplier + addition
    var days = Math.pow((Math.random() * (this.daysCompleted + 1 ) * day_multiplier), day_power)

    return roundStat((base + days), digits)
  },
  addMember:function(member)
  {
    GamePlayer.team.push(member);
    GameDay.current.member_offer = null
  },

  performBalanceChange:function()
  {
    this.performWages();
    this.performIncome();
  },

  calculateWages:function()
  {
    var wages = 0

    this.team.forEach(function(member){
      wages += member.btc
    })

    return wages
  },

  performWages:function()
  {
    wages = this.calculateWages();

    if(wages > 0)
    {
      this.balanceSheet.push([this.date, 'Employee Services Rendered', -wages])
      this.totals.btc -= wages
    }
  },
  performIncome:function()
  {
    //TODO
    var income = (Math.sin(Math.random() * (Math.PI / 2)) * this.totals.pwned.botnet) * 0.1

    if(income > 0)
    {
      this.balanceSheet.push([this.date, 'Botnet lease', +income.toFixed(8)])
      this.totals.btc += roundStat(income, 8)
    }

    return income
  },
  performBailout:function()
  {
    bailout = this.calculateBailout();
    this.approvalRating -= 17

    this.totals.btc += bailout

    this.balanceSheet.push([this.date, 'Too Big to Fail', bailout])
  },

  calculateBailout:function()
  {
    bailout = (this.calculateWages() * 4) + 1

    return bailout;
  }
}


