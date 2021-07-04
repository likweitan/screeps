function choose(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

var roleSoldier = {
  run: function (creep) {
    var dx = choose([-1, 0, 1]);
    var dy = choose([-1, 0, 1]);
    creep.moveTo(creep.pos.x + dx, creep.pos.y + dy);
  },
};

module.exports = roleSoldier;
