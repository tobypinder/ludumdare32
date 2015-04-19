var GamePlayer = {
  approvalRating: 25,
  maxApproval: 50,
  date: new Date(1970, 3, 1),
  daysCompleted: 0,
  team: [],
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
        return total
      }, //
      scanning: function() {
        var total = 0
        GamePlayer.team.forEach(function(member){
          total += member.skills.scanning
        })
        return total
      },
      exploitation: function() {
        var total = 0
        GamePlayer.team.forEach(function(member){
          total += member.skills.exploitation
        })
        return total
      },
      pwnage: function() {
        var total = 0
        GamePlayer.team.forEach(function(member){
          total += member.skills.pwnage
        })
        return total
      },
    },
    stats: {
      deniability: function()
      {
        //TODO: Better function of available proxies and skill of team.
        return Math.pow(GamePlayer.totals.pwned.proxies + 1, 0.3) * (1 + Math.pow(GamePlayer.totals.skills.attribution(), 0.3))
      }
    }
  },
  generateTeamMember:function()
  {
    member = {
      name: Generator.team_member(),
      skills: {
        attribution: +(Math.cos(Math.random() * Math.PI) * 0.1 + 0.3).toFixed(3),
        scanning:  +(Math.cos(Math.random() * Math.PI) * 0.1 + 0.5).toFixed(3),
        exploitation: +(Math.cos(Math.random() * Math.PI) * 0.2 + 0.8).toFixed(3),
        pwnage: +(Math.cos(Math.random() * Math.PI) * 0.05 + 0.1).toFixed(3)
      },
      btc: 0.1
    }
    return member;
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
