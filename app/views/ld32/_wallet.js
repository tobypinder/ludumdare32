var Wallet = {
  renderTransactions: function(){
    var idx   = GamePlayer.balanceSheet.length - 1
    var maxTx = 14
    if(idx > 0)
    {
      tx = 0
      for(var i=0;i<maxTx && idx >= 0 ;i++)
      {
        amt = GamePlayer.balanceSheet[idx][2].toFixed(8)
        if(amt >= 0)
        {
          amt = ' ' + amt
        }

        GameViewText.changeLine(4+i, amt + '   ' + GameDay.displayDate(GamePlayer.balanceSheet[idx][0])+ '   '+ GamePlayer.balanceSheet[idx][1] )

        idx--;
      }
    } else {
      GameViewText.changeLine(7, "No transactions recorded.")
    }
  }
}
