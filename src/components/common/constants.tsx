/**
 * Building Planner
 */
export const PLANNER = {
  RCL: 8,
  ROOM: '',
  SHARD: 'shard0',
  WORLD: 'mmo',
};

/**
 * Screeps Game Constants
 */
export const CREEP_LIFE_TIME: number = 1500;
export const CREEP_CLAIM_LIFE_TIME: number = 600;
export const LAB_BOOST_ENERGY: number = 20;
export const LAB_BOOST_MINERAL: number = 30;
export const SPAWN_ENERGY_CAPACITY: number = 300;

export const EXTENSION_ENERGY_CAPACITY: { [level: number]: number } = {
  0: 50,
  1: 50,
  2: 50,
  3: 50,
  4: 50,
  5: 50,
  6: 50,
  7: 100,
  8: 200,
};

export const RCL_ENERGY: { [level: number]: number } = {
  1: 300,
  2: 550,
  3: 800,
  4: 1300,
  5: 1800,
  6: 2300,
  7: 5600,
  8: 12900,
};

export const BODYPART_COST: { [part: string]: number } = {
  move: 50,
  work: 100,
  attack: 80,
  carry: 50,
  heal: 250,
  ranged_attack: 150,
  tough: 10,
  claim: 600,
};

export const BODYPARTS: { [part: string]: string } = {
  tough: 'TOUGH',
  move: 'MOVE',
  work: 'WORK',
  carry: 'CARRY',
  attack: 'ATTACK',
  ranged_attack: 'RANGED_ATTACK',
  heal: 'HEAL',
  claim: 'CLAIM',
};

export const BODYPART_NAMES: { [part: string]: string } = {
  tough: 'Tough',
  move: 'Move',
  work: 'Work',
  carry: 'Carry',
  attack: 'Attack',
  ranged_attack: 'Ranged Attack',
  heal: 'Heal',
  claim: 'Claim',
};

export const BOOSTS: { [part: string]: { [resource: string]: { [method: string]: number } } } = {
  work: {
    UO: {
      harvest: 3,
    },
    UHO2: {
      harvest: 5,
    },
    XUHO2: {
      harvest: 7,
    },
    LH: {
      build: 1.5,
      repair: 1.5,
    },
    LH2O: {
      build: 1.8,
      repair: 1.8,
    },
    XLH2O: {
      build: 2,
      repair: 2,
    },
    ZH: {
      dismantle: 2,
    },
    ZH2O: {
      dismantle: 3,
    },
    XZH2O: {
      dismantle: 4,
    },
    GH: {
      upgradeController: 1.5,
    },
    GH2O: {
      upgradeController: 1.8,
    },
    XGH2O: {
      upgradeController: 2,
    },
  },
  attack: {
    UH: {
      attack: 2,
    },
    UH2O: {
      attack: 3,
    },
    XUH2O: {
      attack: 4,
    },
  },
  ranged_attack: {
    KO: {
      rangedAttack: 2,
      rangedMassAttack: 2,
    },
    KHO2: {
      rangedAttack: 3,
      rangedMassAttack: 3,
    },
    XKHO2: {
      rangedAttack: 4,
      rangedMassAttack: 4,
    },
  },
  heal: {
    LO: {
      heal: 2,
      rangedHeal: 2,
    },
    LHO2: {
      heal: 3,
      rangedHeal: 3,
    },
    XLHO2: {
      heal: 4,
      rangedHeal: 4,
    },
  },
  carry: {
    KH: {
      capacity: 2,
    },
    KH2O: {
      capacity: 3,
    },
    XKH2O: {
      capacity: 4,
    },
  },
  move: {
    ZO: {
      fatigue: 2,
    },
    ZHO2: {
      fatigue: 3,
    },
    XZHO2: {
      fatigue: 4,
    },
  },
  tough: {
    GO: {
      damage: 0.7,
    },
    GHO2: {
      damage: 0.5,
    },
    XGHO2: {
      damage: 0.3,
    },
  },
};

export const CONTROLLER_STRUCTURES: { [structure: string]: { [level: number]: number } } = {
  spawn: { 0: 0, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 2, 8: 3 },
  extension: { 0: 0, 1: 0, 2: 5, 3: 10, 4: 20, 5: 30, 6: 40, 7: 50, 8: 60 },
  link: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 2, 6: 3, 7: 4, 8: 6 },
  road: { 0: 2500, 1: 2500, 2: 2500, 3: 2500, 4: 2500, 5: 2500, 6: 2500, 7: 2500, 8: 2500 },
  constructedWall: { 1: 0, 2: 2500, 3: 2500, 4: 2500, 5: 2500, 6: 2500, 7: 2500, 8: 2500 },
  rampart: { 1: 0, 2: 2500, 3: 2500, 4: 2500, 5: 2500, 6: 2500, 7: 2500, 8: 2500 },
  storage: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1 },
  tower: { 1: 0, 2: 0, 3: 1, 4: 1, 5: 2, 6: 2, 7: 3, 8: 6 },
  observer: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 1 },
  powerSpawn: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 1 },
  extractor: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 1, 7: 1, 8: 1 },
  terminal: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 1, 7: 1, 8: 1 },
  lab: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 3, 7: 6, 8: 10 },
  container: { 0: 5, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5, 7: 5, 8: 5 },
  nuker: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 1 },
  factory: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 1, 8: 1 },
};

export const STRUCTURES: { [structure: string]: string } = {
  spawn: 'Spawn',
  container: 'Container',
  extension: 'Extension',
  tower: 'Tower',
  storage: 'Storage',
  link: 'Link',
  terminal: 'Terminal',
  extractor: 'Extractor',
  lab: 'Lab',
  factory: 'Factory',
  observer: 'Observer',
  powerSpawn: 'Power Spawn',
  nuker: 'Nuker',
  rampart: 'Rampart',
  constructedWall: 'Wall',
  road: 'Road',
};
