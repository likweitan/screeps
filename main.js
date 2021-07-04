var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleBuilder = require("role.builder");
var roleRepairer = require("role.repairer");
var roleSoldier = require("role.soldier");

module.exports.loop = function () {
  var harvesters = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "harvester"
  );
  var upgraders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "upgrader"
  );
  var builders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "builder"
  );
  var repairers = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "repairer"
  );
  var soldiers = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "soldier"
  );

  var tower = Game.getObjectById("60ddccb3e63ac4484ce151b6");
  if (tower) {
    var closestDamagedWall = tower.pos.findClosestByRange(STRUCTURE_WALL, {
      filter: (structure) => structure.hits < 30000,
    }); // this works and is valid and saves the nearest wall

    var closestDamagedRampart = tower.pos.findClosestByRange(
      STRUCTURE_RAMPART,
      {
        filter: (structure) => structure.hits < 30000, //<- structure has a typo
      }
    ); // this also works and saves the nearest rampart

    var closestDamagedStructure = tower.pos.findClosestByRange(
      FIND_STRUCTURES,
      {
        filter: (structure) => structure.hits < structure.hitsMax,
      }
    ); // and this is totally legit too, but it is also what bites you since walls and ramparts are structures too

    if (closestDamagedWall) {
      tower.repair(closestDamagedWall);
    } // works as intended

    if (closestDamagedRampart) {
      tower.repair(closestDamagedRampart);
    } // works as intended too, but overwrites the previous target

    if (closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
    } // overwrites the previous two since as mentioned walls and ramparts are structures and this ignores your hit limit.

    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
      tower.attack(closestHostile);
    } // well the only thing that works 100% at the time since it is the last overwrite
  }

  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("Clearing non-existing creep memory:", name);
    }
  }

  console.log("Harvesters: " + harvesters.length);
  console.log("Upgraders: " + upgraders.length);

  if (harvesters.length < 3) {
    var newName = "Harvester" + Game.time;
    console.log("Spawning new harvester: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: "harvester" },
    });
  }

  if (upgraders.length < 4) {
    var newName = "Upgrader" + Game.time;
    console.log("Spawning new upgrader: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: "upgrader" },
    });
  }

  if (builders.length < 2) {
    var newName = "Builder" + Game.time;
    console.log("Spawning new upgrader: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: "builder" },
    });
  }

  if (repairers.length < 4) {
    var newName = "Repairer" + Game.time;
    console.log("Spawning new repairer: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: "repairer" },
    });
  }

  if (soldiers.length < 2) {
    var newName = "Soldier" + Game.time;
    console.log("Spawning new repairer: " + newName);
    Game.spawns["Spawn1"].spawnCreep([TOUGH, ATTACK, MOVE], newName, {
      memory: { role: "soldier" },
    });
  }

  if (Game.spawns["Spawn1"].spawning) {
    var spawningCreep = Game.creeps[Game.spawns["Spawn1"].spawning.name];
    Game.spawns["Spawn1"].room.visual.text(
      "🛠️" + spawningCreep.memory.role,
      Game.spawns["Spawn1"].pos.x + 1,
      Game.spawns["Spawn1"].pos.y,
      { align: "left", opacity: 0.8 }
    );
  }

  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creep.memory.role == "harvester") {
      roleHarvester.run(creep);
    }
    if (creep.memory.role == "upgrader") {
      roleUpgrader.run(creep);
    }
    if (creep.memory.role == "builder") {
      roleBuilder.run(creep);
    }
    if (creep.memory.role == "repairer") {
      roleRepairer.run(creep);
    }
    if (creep.memory.role == "soldier") {
      roleSoldier.run(creep);
    }
  }
};
