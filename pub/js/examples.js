"use strict";

// example 1
const env1 = new Enviroment("env1", 300, 600, "White", 10, 200);
env1.createEnviroment();
const env1_solid1 = new Matter(
  env1,
  200,
  40,
  200.1,
  100,
  "Orange",
  100,
  false,
  true,
  "sand1"
);
env1_solid1.createSolid();
const env1_solid2 = new Matter(
  env1,
  40,
  35,
  160,
  100,
  "Orange",
  100,
  false,
  true,
  "sand2"
);
env1_solid2.createSolid();
const env1_solid3 = new Matter(
  env1,
  39.5,
  35,
  400.3,
  100,
  "Orange",
  100,
  false,
  true,
  "sand3"
);
env1_solid3.createSolid();
const env1_liquid1 = new Matter(
  env1,
  40,
  40,
  280,
  60,
  "Blue",
  100,
  false,
  true,
  "water"
);
env1_liquid1.createLiquid();
const env1_gas1 = new Matter(
  env1,
  40,
  40,
  280,
  200,
  "#afdfff",
  100,
  false,
  true,
  "air"
);
env1_gas1.createGas();
const env1_solid4 = new Matter(
  env1,
  200,
  3,
  200,
  200,
  "Green",
  100,
  false,
  true,
  "grass"
);
env1_solid4.createSolid();
const env1_solid5 = new Matter(
  env1,
  50,
  50,
  275,
  220,
  "Grey",
  100,
  false,
  true,
  "home"
);
env1_solid5.createSolid();
const env1_solid6 = new Matter(
  env1,
  56,
  10,
  272,
  280,
  "#cb4154",
  100,
  false,
  true,
  "roof"
);
env1_solid6.createSolid();
const env1_solid7 = new Matter(
  env1,
  10,
  20,
  220,
  220,
  "Brown",
  100,
  false,
  true,
  "treebody1"
);
env1_solid7.createSolid();
const env1_solid8 = new Matter(
  env1,
  30,
  30,
  210,
  260,
  "Green",
  100,
  false,
  true,
  "tree1"
);
env1_solid8.createSolid();
const env1_solid9 = new Matter(
  env1,
  10,
  20,
  370,
  220,
  "Brown",
  100,
  false,
  true,
  "treebody2"
);
env1_solid9.createSolid();
const env1_solid10 = new Matter(
  env1,
  30,
  30,
  360,
  260,
  "Green",
  100,
  false,
  true,
  "tree2"
);
env1_solid10.createSolid();

// example 2
const env2 = new Enviroment("env2", 300, 600, "#003366", 0, 200);
env2.createEnviroment();
const env2_solid1 = new Matter(
  env2,
  40,
  60,
  200,
  150,
  "Orange",
  100,
  true,
  true,
  "orange"
);
env2_solid1.createSolid();
const env2_solid2 = new Matter(
  env2,
  90,
  30,
  120,
  100,
  "Cyan",
  20,
  true,
  true,
  "cyan"
);
env2_solid2.createSolid();
const env2_solid3 = new Matter(
  env2,
  30,
  80,
  130,
  200,
  "Purple",
  20,
  true,
  "purple"
);
env2_solid3.createSolid();
env2.startEnviroment();

// example 3
const env3 = new Enviroment("env3", 300, 600, "#eeeeee", 10, 200);
env3.createEnviroment();
const oxygen = new Matter(
  env3,
  40,
  40,
  180,
  150,
  "#afdfff",
  100,
  false,
  false,
  "oxygen"
);
oxygen.createGas();
const hydrogen = new Matter(
  env3,
  40,
  40,
  380,
  150,
  "#afefef",
  100,
  false,
  false,
  "hydrogen"
);
hydrogen.createGas();
const water = new Matter(
  env3,
  40,
  40,
  380,
  150,
  "Blue",
  100,
  false,
  false,
  "water"
);
water.createLiquid();
oxygen.setReactable(hydrogen, water);

// example 4
const env4 = new Enviroment("env4", 300, 600, "Black", 0, 200);
env4.createEnviroment();
const env4_solid1 = new Matter(
  env4,
  50,
  50,
  220,
  100,
  "Red",
  100,
  true,
  true,
  "red"
);
env4_solid1.createSolid();
const env4_solid2 = new Matter(
  env4,
  80,
  40,
  300,
  150,
  "Green",
  20,
  true,
  true,
  "green"
);
env4_solid2.createSolid();
const env4_solid3 = new Matter(env4, 100, 20, 230, 250, "Blue", 20, true, true);
env4_solid3.createSolid();
env4.startEnviroment();
new EnviromentController(env4).create();

// example 5
const env5 = new Enviroment("env5", 300, 600, "lightgreen", 0, 200);
env5.createEnviroment();
const env5_item1 = new Matter(
  env5,
  200,
  40,
  200.1,
  100,
  "Orange",
  100,
  true,
  true,
  "sand1",
  -100,
  100
);
env5_item1.createSolid();
const env5_item2 = new Matter(
  env5,
  200,
  40,
  200.1,
  100,
  "Blue",
  100,
  true,
  true,
  "blue",
  -200,
  200
);
env5_item2.createSolid();
env5.startEnviroment();
