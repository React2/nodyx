#301 Turn based game

{{ON newGame}}
{{IF Players.size > 0}}

  

{{ELSE}}
  Game.error("Need at least one player");
{{/IF}}
{{/ON}}
