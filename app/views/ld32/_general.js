var roundStat = function(input, digits)
{
  amt = Math.pow(10, digits)
  return Math.round(input * amt) / amt
}

var padString = function(string, chars)
{
  while(string.length < chars)
  {
    string = string + " ";
  }

  return string
}
