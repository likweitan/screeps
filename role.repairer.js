var roleRepairer = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.memory.repairing && creep.carry.energy == 0) {
      creep.memory.repairing = false;
    }
    if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
      creep.memory.repairing = true;
    }

    if (creep.memory.repairing) {
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (object) => object.hits < object.hitsMax / 4,
      });
      if (creep.memory.target.hits > creep.memory.target.hitsMax / 4) {
        if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {
            visualizePathStyle: { stroke: "#ffaa00" },
          });
        }
      } else {
        console.log("REPAIRING:" + targets);
        targets.sort((a, b) => a.hits - b.hits);

        if (targets.length > 0) {
          if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
            creep.memory.target = targets[0];
            creep.moveTo(targets[0], {
              visualizePathStyle: { stroke: "#ffaa00" },
            });
          }
        }
      }
    } else {
      var sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffffff" } });
      }
    }
  },
};

module.exports = roleRepairer;
